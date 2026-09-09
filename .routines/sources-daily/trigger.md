# sources-daily Orchestrator

You are running as a Claude Code remote trigger. Your job: fetch candidate
stories from Hacker News, Lobste.rs, and Hugging Face Daily Papers; dedup
across sources; score them against the writer's profile in one LLM call;
research public sentiment for the selected items; publish 0-2 posts per run
to `kiranramanna/thinkit/_posts/`; and, when several posts turn out to be
following one story, open or extend a timeline for it in `_interests/`.

Sub-prompts: `scoring-prompt.md`, `research-prompt.md`, `writing-prompt.md`,
`interests-prompt.md`. Per-source fetch logic: `adapters/hn.md`,
`adapters/lobsters.md`, `adapters/hf-papers.md`.

## Setup

You have:
- Bash and standard CLI tools (`curl`, `jq`, `git`, `gh`, `python3`)
- `gh` CLI authenticated to the user's GitHub account
- WebSearch/WebFetch tools (required for the research step — Step 7)
- Claude SDK available for sub-LLM calls (scoring, writing)
- Run the fenced bash/python blocks below in ONE logical shell session — later blocks rely on variables exported by earlier ones ($CONFIG, $PROFILE, $POSTS_WRITTEN, ...).

## Step 1 — Clone the repo and cd into it

```bash
gh repo clone kiranramanna/thinkit /tmp/thinkit-run
cd /tmp/thinkit-run
git config user.email "routines@thinkit.local"
git config user.name "thinkit-routine"
```

Determine the run window from the current UTC time:
- 13:00-15:00 UTC → window = "morning"
- 02:00-04:00 UTC → window = "evening"
- otherwise → window = "manual"

```bash
HOUR=$(date -u +%H)
if [ "$HOUR" -ge 13 ] && [ "$HOUR" -le 15 ]; then WINDOW="morning"
elif [ "$HOUR" -ge 2 ] && [ "$HOUR" -le 4 ]; then WINDOW="evening"
else WINDOW="manual"; fi
echo "Run window: $WINDOW"
DATE_UTC=$(date -u +%Y-%m-%d)
TS_UTC=$(date -u +%Y-%m-%dT%H:%M:%SZ)
```

## Step 2 — Load configuration, state, and prompts

```bash
export CONFIG=$(python3 -c "import yaml,json; print(json.dumps(yaml.safe_load(open('.routines/sources-daily/config.yml'))))")
STATE=$(cat .routines/sources-daily/state.json)

PROFILE=$(cat .routines/shared/profile.md)
VOICE_RULES=$(cat .routines/shared/voice-rules.md)
POST_TEMPLATE=$(cat .routines/shared/post-template.md)
POLICY=$(cat .routines/shared/policy.md)
SCORING_PROMPT=$(cat .routines/sources-daily/scoring-prompt.md)
RESEARCH_PROMPT=$(cat .routines/sources-daily/research-prompt.md)
WRITING_PROMPT=$(cat .routines/sources-daily/writing-prompt.md)
```

## Step 3 — Run adapters

For each source in `hn`, `lobsters`, `hf-papers`: if
`.sources.<source>.enabled` is true in `$CONFIG`, read
`.routines/sources-daily/adapters/<source>.md` and execute its bash block.

```bash
rm -f /tmp/candidates-*.json /tmp/adapter-*.txt /tmp/eligible.json /tmp/scores.json /tmp/selected.json /tmp/published_entries.json /tmp/research-*.json
for SRC in hn lobsters hf-papers; do
  ENABLED=$(echo "$CONFIG" | jq -r --arg s "$SRC" '.sources[$s].enabled')
  if [ "$ENABLED" = "true" ]; then
    sed -n '/^```bash$/,/^```$/p' ".routines/sources-daily/adapters/${SRC}.md" \
      | sed '1d;$d' | bash 2>&1 | tee -a /tmp/adapter-log.txt
  else
    echo "skipped: $SRC (disabled)"
  fi
done
grep "^ADAPTER_ERROR" /tmp/adapter-log.txt > /tmp/adapter-errors.txt || true
```

**A source failure must not abort the run.** Failed adapters leave `[]` in
their candidates file; their `ADAPTER_ERROR` lines go into the run record in
Step 9.

## Step 4 — Merge, normalize, dedup

```bash
python3 - <<'PYEOF'
import json, glob, os
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
from datetime import datetime, timedelta, timezone

CONFIG = json.loads(os.environ['CONFIG'])

def normalize_url(u):
    s = urlsplit(u.strip())
    q = [(k, v) for k, v in parse_qsl(s.query, keep_blank_values=True)
         if not k.lower().startswith('utm_')]
    path = s.path.rstrip('/') or '/'
    return urlunsplit((s.scheme.lower(), s.netloc.lower(), path, urlencode(q), ''))

cands = []
for f in sorted(glob.glob('/tmp/candidates-*.json')):
    try:
        cands.extend(json.load(open(f)))
    except Exception as e:
        print(f"skip {f}: {e}")

state = json.load(open('.routines/sources-daily/state.json'))
window_days = CONFIG['dedup_window_days']
cutoff = datetime.now(timezone.utc) - timedelta(days=window_days)
published = {
    u for u, meta in state.get('published_urls', {}).items()
    if datetime.fromisoformat(meta['published_at'].replace('Z', '+00:00')) > cutoff
}

# Candidate-stage merge: same normalized URL from multiple sources collapses
# into one candidate. HN wins as primary (richest discussion); the losing
# source's discussion link is appended to `extra` for the writer's context.
SOURCE_RANK = {'hn': 0, 'lobsters': 1, 'hf-papers': 2}
merged = {}
for c in cands:
    key = normalize_url(c['url'])
    c['norm_url'] = key
    if key in merged:
        keep, drop = sorted([merged[key], c], key=lambda x: SOURCE_RANK[x['source']])
        note = f"also on {drop['source']}: {drop['discussion_url']}"
        keep['extra'] = f"{keep['extra']} | {note}" if keep.get('extra') else note
        merged[key] = keep
    else:
        merged[key] = c

# Publish-stage dedup: drop anything already published within the window.
eligible = [c for k, c in merged.items() if k not in published]
json.dump(eligible, open('/tmp/eligible.json', 'w'), indent=2)
print(f"eligible: {len(eligible)} "
      f"(raw {len(cands)}, cross-source merged to {len(merged)}, "
      f"{len(merged) - len(eligible)} dropped as already published)")
PYEOF
ELIGIBLE_COUNT=$(jq 'length' /tmp/eligible.json)
```

If `ELIGIBLE_COUNT == 0`, skip to Step 9 (record a no-op run and exit).

## Step 5 — Score all candidates in one LLM call

Build the scoring input (truncate `extra` to 500 chars to keep the call lean):

```bash
SCORING_INPUT=$(jq -n \
  --arg profile "$PROFILE" \
  --argjson candidates "$(jq '[.[] | {source, source_id, title, url, raw_score, extra: ((.extra // "") | gsub("[\\u0000-\\u001f]"; " ") | .[0:500])}]' /tmp/eligible.json)" \
  '{profile: $profile, candidates: $candidates}')
```

Call the LLM with `scoring_model` from config. System message =
`SCORING_PROMPT`; user message = JSON-encoded `SCORING_INPUT`.

```python
import json, os
from anthropic import Anthropic

client = Anthropic()  # uses CLAUDE_CODE_OAUTH_TOKEN or ANTHROPIC_API_KEY
resp = client.messages.create(
    model="claude-haiku-4-5",  # scoring_model from config
    max_tokens=8000,
    system=SCORING_PROMPT,
    messages=[{"role": "user", "content": SCORING_INPUT}],
)
scores = json.loads(resp.content[0].text)
```

Save scores to `/tmp/scores.json`. Validate:
- JSON array; each entry has `source`, `source_id`, `score` (int 1-10), `reason`.
- Every (`source`, `source_id`) pair exists in `/tmp/eligible.json`.

If validation fails: retry once with a stricter system message appended:
`"You MUST output strict JSON only. No markdown, no preamble."`. If the
second attempt also fails, log the error and go to Step 9.

## Step 6 — Select with daily budget and diversity tie-break

```bash
python3 - <<'PYEOF'
import json, os
from datetime import datetime, timezone

CONFIG = json.loads(os.environ['CONFIG'])
scores = json.load(open('/tmp/scores.json'))
state = json.load(open('.routines/sources-daily/state.json'))

threshold = CONFIG['threshold']
cap = CONFIG['posts_per_run']

# Soft daily budget: subtract posts already written today (UTC) by earlier runs.
today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
written_today = sum(r.get('posts_written', 0) for r in state.get('runs', [])
                    if r.get('ts', '').startswith(today))
cap = min(cap, max(0, CONFIG['posts_per_day'] - written_today))

above = [s for s in scores if s['score'] >= threshold]
pool = sorted(above, key=lambda s: -s['score'])

# Greedy pick; on exact score ties prefer a source not yet selected.
selected = []
while pool and len(selected) < cap:
    top = pool[0]['score']
    tied = [p for p in pool if p['score'] == top]
    used = {s['source'] for s in selected}
    pick = next((t for t in tied if t['source'] not in used), tied[0])
    selected.append(pick)
    pool.remove(pick)

json.dump(selected, open('/tmp/selected.json', 'w'), indent=2)
print(f"selected: {len(selected)} (cap {cap}, written today {written_today})")
PYEOF
SELECTED_COUNT=$(jq 'length' /tmp/selected.json)
```

If `SELECTED_COUNT == 0`, skip to Step 9.

## Step 7 — Sentiment research per selected item

Only if `.research.enabled` is true in `$CONFIG`. For each entry in
`/tmp/selected.json`: look up its full candidate in `/tmp/eligible.json`
(match on `source` + `source_id`), then follow
`.routines/sources-daily/research-prompt.md` YOURSELF using your
WebSearch/WebFetch tools (SDK sub-calls have no web access). The prompt
writes `/tmp/research-<source>-<source_id>.json`.

On any failure for an item, write the empty form so writing can proceed:

```bash
echo '{"citations": [], "sentiment_summary": null}' > "/tmp/research-${SRC}-${SID}.json"
```

Record research failures for the run log (Step 9) as
`research_failed: ["<source>-<source_id>", ...]`.

## Step 8 — Write posts

For each entry in `/tmp/selected.json`:

```bash
POSTS_WRITTEN=0
PUBLISHED_ENTRIES="[]"
for row in $(jq -c '.[] | {source, source_id}' /tmp/selected.json); do
  SRC=$(echo "$row" | jq -r '.source')
  SID=$(echo "$row" | jq -r '.source_id')
  ITEM=$(jq --arg s "$SRC" --arg id "$SID" '.[] | select(.source == $s and .source_id == $id)' /tmp/eligible.json)
  URL=$(echo "$ITEM" | jq -r '.url // ""')

  # Fetch article excerpt for hn/lobsters; hf-papers grounds in its abstract.
  EXCERPT=""
  if [ "$SRC" != "hf-papers" ] && [ -n "$URL" ]; then
    EXCERPT=$(curl -sL --max-time 10 "$URL" 2>/dev/null | \
              python3 -c "import sys,re,html; t=sys.stdin.read(); \
                          t=re.sub(r'<[^>]+>',' ',t); \
                          t=html.unescape(t); \
                          t=re.sub(r'\s+',' ',t); \
                          print(t[:2000])" 2>/dev/null || echo "")
  fi

  RESEARCH=$(cat "/tmp/research-${SRC}-${SID}.json" 2>/dev/null || echo '{"citations": [], "sentiment_summary": null}')

  WRITING_INPUT=$(jq -n \
    --arg profile "$PROFILE" \
    --arg voice "$VOICE_RULES" \
    --arg template "$POST_TEMPLATE" \
    --arg policy "$POLICY" \
    --argjson item "$ITEM" \
    --arg excerpt "$EXCERPT" \
    --argjson research "$RESEARCH" \
    --arg ts "$TS_UTC" \
    '{
      profile: $profile, voice_rules: $voice, post_template: $template,
      policy: $policy, item: $item, excerpt: $excerpt, research: $research,
      run_ts: $ts
    }')
```

Call the writing LLM (`writing_model` from config). System message =
`WRITING_PROMPT`; user message = `WRITING_INPUT`. Use the same
python-heredoc pattern as scoring, `max_tokens=2000`.

```bash
  # (continuation of the Step 8 for-loop — run in the same shell as the previous block)
  # Check for refusal
  if echo "$POST_CONTENT" | head -c 50 | grep -q '"refuse"'; then
    REASON=$(echo "$POST_CONTENT" | jq -r '.reason // "unknown"')
    echo "Refused ${SRC}-${SID}: $REASON"
    continue
  fi

  # Extract title from frontmatter for slug
  TITLE=$(echo "$POST_CONTENT" | sed -n '/^title:/p' | head -1 | sed 's/title:[[:space:]]*"\(.*\)"/\1/')
  SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 -]//g' | sed 's/  */-/g' | sed -e 's/^-*//' -e 's/-*$//')

  FILENAME="_posts/${DATE_UTC}-${SLUG}.md"
  N=2
  while [ -f "$FILENAME" ]; do
    FILENAME="_posts/${DATE_UTC}-${SLUG}-${N}.md"
    N=$((N + 1))
  done

  echo "$POST_CONTENT" > "$FILENAME"
  echo "Wrote: $FILENAME"
  POSTS_WRITTEN=$((POSTS_WRITTEN + 1))
  NORM=$(echo "$ITEM" | jq -r '.norm_url')
  # POST_SLUG is the filename slug, which is how _interests/ references a post.
  POST_SLUG=$(basename "$FILENAME" .md | sed 's/^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}-//')
  PUBLISHED_ENTRIES=$(echo "$PUBLISHED_ENTRIES" | jq --arg u "$NORM" --arg s "$SRC" --arg id "$SID" --arg slug "$POST_SLUG" \
    '. += [{norm_url: $u, source: $s, source_id: $id, slug: $slug}]')
done
echo "$PUBLISHED_ENTRIES" > /tmp/published_entries.json
```

Per-item writing errors follow `abort_on_writing_error: false` — skip the
item, continue the loop.

## Step 8.5 — Detect running stories and update interests

Some posts are not one-offs: they are the same story picked up again as new
information arrives. When three or more posts turn out to be following one
story, that story becomes a **special interest** — a timeline page under
`_interests/` showing how it came out, in order.

Only runs when this run actually wrote posts, and only proposes a cluster that
contains at least one of them. An old cluster with no new development is not
news, and re-proposing it every run would burn a call twice a day forever.

Skip this whole step if `.interests.enabled` is false in `$CONFIG`, or if
`POSTS_WRITTEN` is 0.

### 8.5a — Build the clustering input

```bash
export POSTS_WRITTEN
export INTERESTS_PROMPT=$(cat .routines/sources-daily/interests-prompt.md)

if [ "$POSTS_WRITTEN" -eq 0 ]; then
  echo "interests: skipped (no posts written this run)"
  echo '[]' > /tmp/interest_clusters.json
  echo '{"status":"skipped-no-posts","created":[],"updated":[],"skipped":[]}' > /tmp/interests_result.json
else
python3 - <<'PYEOF'
import json, os, glob, re, yaml
from datetime import datetime, timedelta, timezone
from urllib.parse import urlsplit

CONFIG = json.loads(os.environ['CONFIG'])
IC = CONFIG.get('interests') or {}
if not IC.get('enabled', True):
    json.dump({}, open('/tmp/interests_input.json', 'w'))
    print('interests: disabled in config')
    raise SystemExit(0)

lookback = IC.get('lookback_days', 120)
cutoff = (datetime.now(timezone.utc) - timedelta(days=lookback)).date()

FM = re.compile(r'\A---\s*\n(.*?)\n---\s*\n(.*)\Z', re.S)

def parse(path):
    """Split a Jekyll file into (front matter dict, body). None if malformed."""
    try:
        m = FM.match(open(path, encoding='utf-8').read())
        if not m:
            return None, None
        return yaml.safe_load(m.group(1)) or {}, m.group(2)
    except Exception as e:
        print(f'skip {path}: {e}')
        return None, None

# --- posts in the lookback window -------------------------------------------
posts = []
for path in sorted(glob.glob('_posts/*.md')):
    name = os.path.basename(path)
    m = re.match(r'(\d{4}-\d{2}-\d{2})-(.+)\.md$', name)
    if not m:
        continue
    date_s, slug = m.group(1), m.group(2)
    if datetime.strptime(date_s, '%Y-%m-%d').date() < cutoff:
        continue
    fm, body = parse(path)
    if fm is None:
        continue
    # First real paragraph, enough for the model to tell stories apart.
    opening = ''
    for para in (body or '').split('\n\n'):
        para = ' '.join(para.split())
        if len(para) > 40:
            opening = para[:250]
            break
    cats = fm.get('categories') or []
    if isinstance(cats, str):
        cats = [cats]
    src = fm.get('source_url') or ''
    posts.append({
        'slug': slug,
        'date': date_s,
        'title': fm.get('title', ''),
        'categories': cats,
        'source_host': urlsplit(src).netloc.lower() if src else '',
        'opening': opening,
    })

# --- interests that already exist -------------------------------------------
existing = []
for path in sorted(glob.glob('_interests/*.md')):
    fm, _ = parse(path)
    if fm is None:
        continue
    slugs = [e.get('post') for e in (fm.get('entries') or []) if e.get('post')]
    existing.append({
        'slug': os.path.splitext(os.path.basename(path))[0],
        'title': fm.get('title', ''),
        'blurb': fm.get('blurb', ''),
        'posts': slugs,
    })

new_slugs = json.load(open('/tmp/published_entries.json')) if os.path.exists('/tmp/published_entries.json') else []
new_slugs = [p['slug'] for p in new_slugs if p.get('slug')]

# --- prefilter -------------------------------------------------------------
# The blog publishes several posts a day, so a 120-day window is ~350 posts:
# too many tokens to send twice daily, and too much noise for the model to
# find a real story in. Rank the window against this run's posts and send only
# the plausible neighbours. This is a cheap recall filter, not a judgement —
# deciding what is actually one story is still the model's job.
STOP = {'that', 'this', 'with', 'from', 'your', 'what', 'when', 'they', 'their',
        'about', 'into', 'more', 'than', 'have', 'been', 'were', 'will', 'just',
        'most', 'some', 'make', 'makes', 'made', 'does', 'over', 'only', 'still'}

def terms(p):
    return {w for w in re.findall(r'[a-z]{5,}', p['title'].lower()) if w not in STOP}

by_slug = {p['slug']: p for p in posts}
seeds = [by_slug[s] for s in new_slugs if s in by_slug]
tracked = {s for i in existing for s in i['posts']}

if seeds:
    seed_cats = set().union(*(set(p['categories']) for p in seeds))
    seed_hosts = {p['source_host'] for p in seeds if p['source_host']}
    seed_terms = set().union(*(terms(p) for p in seeds))

    def relevance(p):
        if p['slug'] in new_slugs:
            return 10_000                      # always send this run's posts
        if p['slug'] in tracked:
            return 5_000                       # and anything already in a story
        score = 0
        if p['source_host'] and p['source_host'] in seed_hosts:
            score += 3
        score += 2 * len(seed_cats & set(p['categories']))
        score += len(seed_terms & terms(p))
        return score

    ranked = sorted(posts, key=lambda p: (-relevance(p), p['date']))
    cap = IC.get('max_candidates', 60)
    posts = [p for p in ranked[:cap] if relevance(p) > 0]

payload = {'new_slugs': new_slugs, 'existing_interests': existing, 'posts': posts}
json.dump(payload, open('/tmp/interests_input.json', 'w'), indent=2)
print(f'interests: {len(posts)} candidates after prefilter, {len(existing)} existing, '
      f'{len(new_slugs)} new this run, '
      f'~{len(json.dumps(payload)) // 4} tokens')
PYEOF
fi
```

### 8.5b — One LLM call to find the stories

Call the LLM with `interests_model` from config. System message =
`INTERESTS_PROMPT`; user message = the contents of `/tmp/interests_input.json`.
Same python-heredoc pattern as scoring, `max_tokens=4000`. Write the reply to
`/tmp/interest_clusters.json`.

Validate: JSON array; each entry has `slug` matching `^[a-z0-9-]+$`, `title`,
`blurb`, numeric `confidence`, and a `posts` array of `{post, why}`. On a
validation failure, retry once with `"You MUST output strict JSON only."`
appended to the system message. If it fails twice, write `[]` and carry on —
a missed interest is not worth failing a publishing run over.

### 8.5c — Apply: create or extend interest files

```bash
python3 - <<'PYEOF'
import json, os, re, glob, textwrap, yaml

CONFIG = json.loads(os.environ['CONFIG'])
IC = CONFIG.get('interests') or {}
min_posts = IC.get('min_posts', 3)
min_conf = IC.get('min_confidence', 0.7)
max_new = IC.get('max_new_per_run', 1)

try:
    clusters = json.load(open('/tmp/interest_clusters.json'))
except Exception:
    clusters = []

try:
    new_slugs = {p['slug'] for p in json.load(open('/tmp/published_entries.json')) if p.get('slug')}
except Exception:
    new_slugs = set()

# Every post's date, so an entry's sort key comes from the filename rather
# than from anything the model had to get right.
post_dates = {}
for path in glob.glob('_posts/*.md'):
    m = re.match(r'(\d{4}-\d{2}-\d{2})-(.+)\.md$', os.path.basename(path))
    if m:
        post_dates[m.group(2)] = m.group(1)

SENTINEL = '# routine:append-here'
FM = re.compile(r'\A---\s*\n(.*?)\n---\s*\n', re.S)

def render(slug, why):
    """One `- post:` entry, wrapped to sit comfortably in the file."""
    why = ' '.join((why or '').split())
    lines = textwrap.wrap(why, 66) or ['(no note)']
    body = '\n'.join('      ' + l for l in lines)
    return (f'  - date: {post_dates[slug]}\n'
            f'    kind: post\n'
            f'    post: {slug}\n'
            f'    why: >\n{body}\n\n')

TEMPLATE = '''---
layout: interest
title: "{title}"
blurb: "{blurb}"
entries:
{entries}  {sentinel} — sources-daily inserts new entries above this line.
  # Hand-written entries are safe anywhere in this list; the routine only
  # inserts, and only for posts whose slug is not already present.
---
'''

created, updated, skipped = [], [], []

for c in sorted(clusters, key=lambda x: -float(x.get('confidence', 0))):
    slug = c.get('slug', '')
    if not re.match(r'^[a-z0-9-]+$', slug):
        skipped.append(f'{slug or "?"}: bad slug'); continue
    if float(c.get('confidence', 0)) < min_conf:
        skipped.append(f'{slug}: confidence {c.get("confidence")} < {min_conf}'); continue

    entries = [e for e in (c.get('posts') or [])
               if e.get('post') in post_dates]
    if len(entries) < min_posts:
        skipped.append(f'{slug}: {len(entries)} known posts < {min_posts}'); continue
    if not any(e['post'] in new_slugs for e in entries):
        skipped.append(f'{slug}: no post from this run'); continue

    path = f'_interests/{slug}.md'

    if os.path.exists(path):
        text = open(path, encoding='utf-8').read()
        m = FM.match(text)
        have = set()
        if m:
            fm = yaml.safe_load(m.group(1)) or {}
            have = {e.get('post') for e in (fm.get('entries') or []) if e.get('post')}
        # Only ever insert. Anything already present — including entries a
        # human edited — is left exactly as it is.
        add = [e for e in entries if e['post'] not in have]
        if not add:
            skipped.append(f'{slug}: nothing new to add'); continue
        if SENTINEL not in text:
            skipped.append(f'{slug}: no {SENTINEL} marker, refusing to edit'); continue
        block = ''.join(render(e['post'], e.get('why')) for e in
                        sorted(add, key=lambda e: post_dates[e['post']]))
        line = next(l for l in text.splitlines() if SENTINEL in l)
        open(path, 'w', encoding='utf-8').write(text.replace(line, block + line, 1))
        updated.append(f'{slug} (+{len(add)})')
        continue

    if len(created) >= max_new:
        skipped.append(f'{slug}: new-interest cap ({max_new}) reached'); continue

    block = ''.join(render(e['post'], e.get('why')) for e in
                    sorted(entries, key=lambda e: post_dates[e['post']]))
    os.makedirs('_interests', exist_ok=True)
    open(path, 'w', encoding='utf-8').write(TEMPLATE.format(
        title=str(c.get('title', slug)).replace('"', "'"),
        blurb=str(c.get('blurb', '')).replace('"', "'"),
        entries=block, sentinel=SENTINEL))
    created.append(f'{slug} ({len(entries)})')

json.dump({'status': 'ran', 'created': created, 'updated': updated,
           'skipped': skipped},
          open('/tmp/interests_result.json', 'w'), indent=2)
print(f'interests: created {created}, updated {updated}, skipped {len(skipped)}')
for s in skipped:
    print(f'  - {s}')
PYEOF
```

Interests only ever gain entries from the routine. Nothing is rewritten and
nothing is deleted, so a note you edit by hand survives every future run — and
an interest file without the `# routine:append-here` marker is left alone
entirely.

## Step 9 — Update state.json

```bash
python3 - <<PYEOF
import json, os
from datetime import datetime, timedelta, timezone

CONFIG = json.loads(os.environ['CONFIG'])

with open('.routines/sources-daily/state.json') as f:
    state = json.load(f)

now_iso = "$TS_UTC"

def tmp_json(path, default):
    try:
        return json.load(open(path))
    except Exception:
        return default

eligible = tmp_json('/tmp/eligible.json', [])
selected = tmp_json('/tmp/selected.json', [])
published = tmp_json('/tmp/published_entries.json', [])
adapter_errors = []
try:
    adapter_errors = [l.strip() for l in open('/tmp/adapter-errors.txt') if l.strip()]
except Exception:
    pass

per_source = {}
for c in eligible:
    per_source[c['source']] = per_source.get(c['source'], 0) + 1

interests = tmp_json('/tmp/interests_result.json',
                     {"status": "did-not-run", "created": [], "updated": [],
                      "skipped": []})

run = {
    "ts": now_iso,
    "window": "$WINDOW",
    "eligible_count": len(eligible),
    "eligible_per_source": per_source,
    "selected": [f"{s['source']}-{s['source_id']}" for s in selected],
    "posts_written": len(published),
    "adapter_errors": adapter_errors,
}
# Always record the outcome. The right answer most days is that no story
# qualified, so "ran and found nothing" has to be distinguishable from "never
# executed" — otherwise a silently broken step looks exactly like a quiet one.
run['interests'] = {
    'status': interests.get('status', 'did-not-run'),
    'created': interests['created'],
    'updated': interests['updated'],
    'rejected': len(interests['skipped']),
}
state.setdefault('runs', []).append(run)

for p in published:
    state.setdefault('published_urls', {})[p['norm_url']] = {
        "source": p['source'], "source_id": p['source_id'],
        "published_at": now_iso,
    }

# Prune published_urls older than the dedup window
cutoff = datetime.now(timezone.utc) - timedelta(days=CONFIG['dedup_window_days'])
state['published_urls'] = {
    u: m for u, m in state.setdefault('published_urls', {}).items()
    if datetime.fromisoformat(m['published_at'].replace('Z', '+00:00')) > cutoff
}
state['last_pruned_ts'] = now_iso

with open('.routines/sources-daily/state.json', 'w') as f:
    json.dump(state, f, indent=2, sort_keys=True)
PYEOF
```

If the run had `research_failed` items (Step 7), add that list to the run
entry as well.

## Step 10 — Commit and push

```bash
git add _posts/ _interests/ .routines/sources-daily/state.json

IE_NOTE=""
if [ -f /tmp/interests_result.json ]; then
  IE_C=$(jq -r '.created | length' /tmp/interests_result.json)
  IE_U=$(jq -r '.updated | length' /tmp/interests_result.json)
  if [ "$IE_C" -gt 0 ] || [ "$IE_U" -gt 0 ]; then
    IE_NOTE=", interests +${IE_C}/~${IE_U}"
  fi
fi

if [ "$POSTS_WRITTEN" -eq 0 ]; then
  MSG="sources-daily: 0 posts — ${DATE_UTC} ${WINDOW} (no matches above threshold)"
else
  MSG="sources-daily: ${POSTS_WRITTEN} post(s)${IE_NOTE} — ${DATE_UTC} ${WINDOW}"
fi

git commit -m "$MSG" || echo "Nothing to commit"
git push origin master
```

**IMPORTANT:** Always `git push origin master` explicitly. Never plain
`git push` — the repo has both `origin` and `upstream` remotes, and pushing
to upstream would fail noisily AND leak the post to the theme repo.

## Step 11 — Error handling

At every step where a command can fail, capture the error and log it to a
run entry in `state.json` under an `error` field:

```python
state['runs'].append({
    "ts": now_iso,
    "window": "$WINDOW",
    "error": "<concise error message>",
    "posts_written": 0,
})
```

Then commit the state change with a message like:
`sources-daily: 0 posts — 2026-08-05 morning (error: all adapters failed)`

Failure ladder (from the spec):
- **One or two adapters fail** → run continues on the remaining sources;
  errors land in `adapter_errors`.
- **All adapters fail / scoring fails twice** → zero-post run, error
  recorded, still committed and pushed.
- **Research fails for an item** → post publishes without the reaction
  paragraph; item listed in `research_failed`.
- **Writing fails for an item** → skip the item, continue
  (`abort_on_writing_error: false`).

Even on errors, push the commit so the gap is visible in `git log` rather
than silent.

## Step 12 — Exit cleanly

```bash
echo "sources-daily run complete: $POSTS_WRITTEN post(s) written."
```

Sandbox will tear down automatically. No cleanup needed.
