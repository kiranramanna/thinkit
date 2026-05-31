# hn-daily Orchestrator

You are running as a Claude Code remote trigger. Your job: scan today's top
Hacker News stories, score them against the writer's profile, and publish 0-2
short-take blog posts to `kiranramanna/thinkit/_posts/`.

This prompt is the orchestrator. Sub-prompts for scoring and writing are loaded
from `scoring-prompt.md` and `writing-prompt.md` respectively.

## Setup

You have:
- Bash and standard CLI tools (`curl`, `jq`, `git`, `gh`, `python3`)
- `gh` CLI authenticated to the user's GitHub account
- Claude SDK available for sub-LLM calls (or you can use yourself with explicit
  context for sub-prompts; either is fine)

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

## Step 2 — Load configuration and state

```bash
CONFIG=$(python3 -c "import yaml,json; print(json.dumps(yaml.safe_load(open('.routines/hn-daily/config.yml'))))")
STATE=$(cat .routines/hn-daily/state.json)
```

Read profile, voice rules, post template, policy, scoring-prompt, writing-prompt
into variables for later use in LLM calls:

```bash
PROFILE=$(cat .routines/shared/profile.md)
VOICE_RULES=$(cat .routines/shared/voice-rules.md)
POST_TEMPLATE=$(cat .routines/shared/post-template.md)
POLICY=$(cat .routines/shared/policy.md)
SCORING_PROMPT=$(cat .routines/hn-daily/scoring-prompt.md)
WRITING_PROMPT=$(cat .routines/hn-daily/writing-prompt.md)
```

## Step 3 — Fetch HN top stories

```bash
FETCH_LIMIT=$(echo "$CONFIG" | jq -r .fetch_limit)
MIN_HN_SCORE=$(echo "$CONFIG" | jq -r .min_hn_score)
DEDUP_WINDOW=$(echo "$CONFIG" | jq -r .dedup_window_days)

# Fetch top story IDs
curl -s https://hacker-news.firebaseio.com/v0/topstories.json | \
  jq ".[0:${FETCH_LIMIT}]" > /tmp/top_ids.json

# Fetch each story's details (rate-limited at 100ms between calls)
echo "[]" > /tmp/candidates.json
for id in $(jq -r ".[]" /tmp/top_ids.json); do
  story=$(curl -s "https://hacker-news.firebaseio.com/v0/item/${id}.json")
  jq --argjson s "$story" '. += [$s]' /tmp/candidates.json > /tmp/candidates.tmp \
    && mv /tmp/candidates.tmp /tmp/candidates.json
  sleep 0.1
done
```

Filter candidates:
- Drop items with `score < min_hn_score`.
- Drop items where both `url` and `text` are missing.
- Drop items whose `id` appears in `state.published_ids` within the dedup window.

```bash
NOW_TS=$(date -u +%s)
WINDOW_SECONDS=$(( DEDUP_WINDOW * 86400 ))

jq --argjson minscore "$MIN_HN_SCORE" \
   --argjson state "$STATE" \
   --argjson now "$NOW_TS" \
   --argjson window "$WINDOW_SECONDS" '
  map(select(
    .score >= $minscore and
    (.url != null or .text != null) and
    (
      ($state.published_ids[(.id|tostring)] // null) == null
      # OR if you want strict dedup window check, parse the published timestamp
      # and compare: ((now - published_at_unix) > window)
    )
  ))
' /tmp/candidates.json > /tmp/eligible.json

ELIGIBLE_COUNT=$(jq 'length' /tmp/eligible.json)
echo "Eligible candidates: $ELIGIBLE_COUNT"
```

If `ELIGIBLE_COUNT == 0`, skip to Step 7 (record a no-op run and exit).

## Step 4 — Score all candidates in one LLM call

Build the scoring input:

```bash
SCORING_INPUT=$(jq -n \
  --arg profile "$PROFILE" \
  --argjson candidates "$(jq '[.[] | {id, title, url, score, descendants, text}]' /tmp/eligible.json)" \
  '{profile: $profile, candidates: $candidates}')
```

Call the LLM with `scoring_model` from config. The system message is the
`SCORING_PROMPT` content. The user message is the JSON-encoded `SCORING_INPUT`.
Expected output: strict JSON array.

```python
# Use claude_agent_sdk or anthropic SDK
import json, os
from anthropic import Anthropic

client = Anthropic()  # uses CLAUDE_CODE_OAUTH_TOKEN or ANTHROPIC_API_KEY
resp = client.messages.create(
    model="claude-haiku-4-5",  # from config
    max_tokens=4000,
    system=SCORING_PROMPT,
    messages=[{"role": "user", "content": SCORING_INPUT}],
)
scores = json.loads(resp.content[0].text)
```

Save scores to `/tmp/scores.json`. Validate the output:
- Must be a JSON array.
- Each entry has `id`, `score`, `reason`.
- `score` is an integer 1-10.

If validation fails: retry once with a stricter system message appended:
`"You MUST output strict JSON only. No markdown, no preamble."`. If second
attempt also fails, log error and exit Step 7.

## Step 5 — Select and write top posts

```bash
THRESHOLD=$(echo "$CONFIG" | jq -r .threshold)
CAP=$(echo "$CONFIG" | jq -r .posts_per_run)

# Filter and sort, take top CAP
SELECTED=$(jq --argjson t "$THRESHOLD" --argjson c "$CAP" '
  map(select(.score >= $t)) | sort_by(-.score) | .[0:$c]
' /tmp/scores.json)

echo "$SELECTED" > /tmp/selected.json
SELECTED_COUNT=$(echo "$SELECTED" | jq 'length')
echo "Selected for writing: $SELECTED_COUNT"
```

For each selected item:

```bash
POSTS_WRITTEN=0
for sel_id in $(echo "$SELECTED" | jq -r '.[].id'); do
  # Fetch full item details (already in /tmp/eligible.json)
  ITEM=$(jq --argjson id "$sel_id" '.[] | select(.id == $id)' /tmp/eligible.json)

  URL=$(echo "$ITEM" | jq -r '.url // ""')

  # Fetch first 2000 chars of linked article, if URL present
  EXCERPT=""
  if [ -n "$URL" ] && [ "$URL" != "null" ]; then
    EXCERPT=$(curl -sL --max-time 10 "$URL" 2>/dev/null | \
              python3 -c "import sys,re,html; t=sys.stdin.read(); \
                          t=re.sub(r'<[^>]+>',' ',t); \
                          t=html.unescape(t); \
                          t=re.sub(r'\s+',' ',t); \
                          print(t[:2000])" 2>/dev/null || echo "")
  fi

  # Compose writing input
  WRITING_INPUT=$(jq -n \
    --arg profile "$PROFILE" \
    --arg voice "$VOICE_RULES" \
    --arg template "$POST_TEMPLATE" \
    --arg policy "$POLICY" \
    --argjson item "$ITEM" \
    --arg excerpt "$EXCERPT" \
    --arg ts "$TS_UTC" \
    '{
      profile: $profile, voice_rules: $voice, post_template: $template,
      policy: $policy, item: $item, excerpt: $excerpt, run_ts: $ts
    }')

  # Call writing LLM
  POST_CONTENT=$(python3 - <<PYEOF
import json, os
from anthropic import Anthropic
client = Anthropic()
sys_prompt = """$WRITING_PROMPT"""
resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=2000,
    system=sys_prompt,
    messages=[{"role": "user", "content": '''$WRITING_INPUT'''}],
)
print(resp.content[0].text)
PYEOF
)

  # Check for refusal
  if echo "$POST_CONTENT" | head -c 50 | grep -q '"refuse"'; then
    REASON=$(echo "$POST_CONTENT" | jq -r '.reason // "unknown"')
    echo "Refused item $sel_id: $REASON"
    continue
  fi

  # Extract title from frontmatter for slug
  TITLE=$(echo "$POST_CONTENT" | sed -n '/^title:/p' | head -1 | sed 's/title:[[:space:]]*"\(.*\)"/\1/')
  SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 -]//g' | sed 's/  */-/g' | sed 's/^-\|-$//g')

  # Avoid collision: if filename exists, append -2, -3, ...
  FILENAME="_posts/${DATE_UTC}-${SLUG}.md"
  N=2
  while [ -f "$FILENAME" ]; do
    FILENAME="_posts/${DATE_UTC}-${SLUG}-${N}.md"
    N=$((N + 1))
  done

  echo "$POST_CONTENT" > "$FILENAME"
  echo "Wrote: $FILENAME"
  POSTS_WRITTEN=$((POSTS_WRITTEN + 1))
done
```

## Step 6 — Update state.json

```bash
python3 - <<PYEOF
import json, os
from datetime import datetime, timedelta

with open('.routines/hn-daily/state.json') as f:
    state = json.load(f)

now_iso = "$TS_UTC"
selected_ids = json.loads('''$SELECTED''')
posts_written = $POSTS_WRITTEN

# Append run log
state['runs'].append({
    "ts": now_iso,
    "window": "$WINDOW",
    "candidates_count": $ELIGIBLE_COUNT,
    "scored_above_threshold": len(selected_ids),
    "selected_ids": [s['id'] for s in selected_ids],
    "posts_written": posts_written,
})

# Record published IDs with timestamps
for s in selected_ids[:posts_written]:
    state['published_ids'][str(s['id'])] = now_iso

# Prune published_ids older than dedup window
window_days = $DEDUP_WINDOW
cutoff = datetime.utcnow() - timedelta(days=window_days)
state['published_ids'] = {
    k: v for k, v in state['published_ids'].items()
    if datetime.fromisoformat(v.replace('Z', '+00:00')).replace(tzinfo=None) > cutoff
}
state['last_pruned_ts'] = now_iso

with open('.routines/hn-daily/state.json', 'w') as f:
    json.dump(state, f, indent=2, sort_keys=True)
PYEOF
```

## Step 7 — Commit and push

```bash
git add _posts/ .routines/hn-daily/state.json

if [ "$POSTS_WRITTEN" -eq 0 ]; then
  MSG="hn-daily: 0 posts — ${DATE_UTC} ${WINDOW} (no matches above threshold)"
else
  MSG="hn-daily: ${POSTS_WRITTEN} post(s) — ${DATE_UTC} ${WINDOW}"
fi

git commit -m "$MSG" || echo "Nothing to commit"
git push origin master
```

**IMPORTANT:** Always `git push origin master` explicitly. Never plain `git push` — the repo has both `origin` and `upstream` remotes, and pushing to upstream would fail noisily AND leak the post to the theme repo.

## Step 8 — Error handling

At every step where a command can fail, capture the error and log it to a run
entry in `state.json` under an `error` field:

```python
state['runs'].append({
    "ts": now_iso,
    "window": "$WINDOW",
    "error": "<concise error message>",
    "posts_written": 0,
})
```

Then commit the state change with a message like:
`hn-daily: 0 posts — 2026-05-31 morning (error: HN API timeout)`

Even on errors, push the commit so the gap is visible in `git log` rather than silent.

## Step 9 — Exit cleanly

```bash
echo "hn-daily run complete: $POSTS_WRITTEN post(s) written."
```

Sandbox will tear down automatically. No cleanup needed.
