# Sources-Daily Merged Routine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-source `hn-daily` routine with a merged `sources-daily` routine that fetches HN + Lobste.rs + HF Daily Papers, dedups across sources by canonical URL, scores in one LLM pass, adds a citation-gated sentiment paragraph per post, and retires `hn-daily`.

**Architecture:** One routine folder `.routines/sources-daily/` following the repo's five-file routine pattern, extended with an `adapters/` directory (one fetch+normalize file per source). Adapters emit a common candidate JSON schema; the orchestrator merges, dedups, scores (Haiku), researches sentiment (orchestrator's own WebSearch), writes (Sonnet), and commits. State is keyed by normalized canonical URL.

**Tech Stack:** Markdown orchestrator prompts (Claude Code remote trigger), bash + `curl` + `jq`, `python3` inline snippets, Anthropic SDK for sub-LLM calls, Jekyll `_posts/`.

**Spec:** `.routines/specs/2026-08-05-sources-daily-merged-routine-design.md`

## Global Constraints

- Never `git push` from the implementation session. The routine's `trigger.md` pushes when it runs in production; the implementer only commits locally.
- Model IDs verbatim: scoring `claude-haiku-4-5`, writing `claude-sonnet-4-6`.
- Budgets verbatim: `threshold: 7`, `posts_per_run: 2`, `posts_per_day: 4`, `dedup_window_days: 7`.
- Controlled category vocabulary (unchanged): `agentic-ai`, `rag`, `llm-ops`, `enterprise-ai`, `conversational-ai`, `knowledge-graphs`, `ai-infrastructure`, `research`, `industry`.
- Candidate schema field names verbatim: `source`, `source_id`, `title`, `url`, `discussion_url`, `raw_score`, `extra`.
- `source` values verbatim: `hn`, `lobsters`, `hf-papers`.
- Testing adaptation: this repo has no test suite; "tests" are live-endpoint verification commands and python snippet checks run in the implementation session. Every task still ends with a verification step before its commit.
- All commits use prefix `routine:` and describe the artifact, e.g. `routine: add lobsters adapter`.

---

### Task 1: Scaffold `sources-daily/` with `config.yml`

**Files:**
- Create: `.routines/sources-daily/config.yml`

**Interfaces:**
- Produces: `$CONFIG` JSON shape consumed by every adapter and by `trigger.md`. Key paths: `.sources.hn.{enabled,fetch_limit,min_score}`, `.sources.lobsters.{enabled,fetch_limit,min_score,tag_allowlist}`, `.sources["hf-papers"].{enabled,min_score}`, `.research.{enabled,min_citations,max_citations}`, plus top-level `threshold`, `posts_per_run`, `posts_per_day`, `dedup_window_days`, `date_timezone`, `scoring_model`, `writing_model`, `commit_on_zero_posts`, `abort_on_writing_error`.

- [ ] **Step 1: Create the config file**

Write `.routines/sources-daily/config.yml` with exactly:

```yaml
# sources-daily routine configuration
# Spec: ../specs/2026-08-05-sources-daily-merged-routine-design.md

# --- Selection (global, across all sources) ---
# Minimum LLM score (1-10) for an item to be eligible for publishing
threshold: 7

# Max posts to publish in a single run (cap)
posts_per_run: 2

# Max posts to publish per day across all runs (soft global cap; advisory)
posts_per_day: 4

# Rolling dedup window — don't republish a canonical URL within this many days
dedup_window_days: 7

# --- Output formatting ---
# Timezone for post `date:` frontmatter. Always UTC to avoid past JST bugs.
date_timezone: "+0000"

# --- LLM models ---
# Cheaper model for scoring (all candidates in one call)
scoring_model: "claude-haiku-4-5"

# Better-voice model for writing (per-item)
writing_model: "claude-sonnet-4-6"

# --- Behavior ---
# If true, commit even when 0 posts published (preserves audit trail)
commit_on_zero_posts: true

# If true, abort the run on the first per-item writing error
# If false, skip the bad item and continue
abort_on_writing_error: false

# --- Sources ---
# Per-source fetch settings. raw upvote floors are scaled to community size
# and are expected to need tuning in the first weeks.
sources:
  hn:
    enabled: true
    fetch_limit: 30
    min_score: 30
  lobsters:
    enabled: true
    fetch_limit: 25
    min_score: 10
    # Items with no allowlisted tag are dropped before LLM scoring
    tag_allowlist: [ai, ml, compsci, distributed, devops, programming]
  hf-papers:
    enabled: true
    # HF daily_papers returns one day's list; no fetch_limit needed
    min_score: 5

# --- Sentiment research ---
research:
  enabled: true
  # Below this many usable citations, the reaction paragraph is omitted entirely
  min_citations: 2
  max_citations: 5
```

- [ ] **Step 2: Verify the config parses and exposes every key path**

Run:
```bash
cd /Users/kiranramanna/Documents/github/git_kr/thinkit
python3 -c "
import yaml, json
c = yaml.safe_load(open('.routines/sources-daily/config.yml'))
j = json.dumps(c)
for path in [c['sources']['hn']['min_score'], c['sources']['lobsters']['tag_allowlist'],
             c['sources']['hf-papers']['min_score'], c['research']['min_citations'],
             c['threshold'], c['posts_per_day']]:
    pass
print('OK:', c['sources']['lobsters']['tag_allowlist'])
"
```
Expected: `OK: ['ai', 'ml', 'compsci', 'distributed', 'devops', 'programming']`

- [ ] **Step 3: Commit**

```bash
git add .routines/sources-daily/config.yml
git commit -m "routine: scaffold sources-daily with config.yml"
```

---

### Task 2: Hacker News adapter

**Files:**
- Create: `.routines/sources-daily/adapters/hn.md`

**Interfaces:**
- Consumes: `$CONFIG` (JSON string of config.yml, exported by trigger Step 2).
- Produces: `/tmp/candidates-hn.json` — JSON array of normalized candidates (schema in Global Constraints). On failure the file contains `[]` and the failure is echoed; the adapter never exits nonzero.

- [ ] **Step 1: Create the adapter file**

Write `.routines/sources-daily/adapters/hn.md` with exactly:

````markdown
# Adapter: Hacker News

Fetches top stories from the HN Firebase API and emits normalized candidates
to `/tmp/candidates-hn.json`. Requires `$CONFIG` (JSON of `config.yml`) in the
shell environment.

**Failure contract:** on any error, ensure `/tmp/candidates-hn.json` contains
`[]` and echo a line starting with `ADAPTER_ERROR hn:` — never abort the run.

```bash
HN_LIMIT=$(echo "$CONFIG" | jq -r '.sources.hn.fetch_limit')
HN_MIN=$(echo "$CONFIG" | jq -r '.sources.hn.min_score')

echo "[]" > /tmp/candidates-hn.json

if ! curl -s --max-time 20 https://hacker-news.firebaseio.com/v0/topstories.json \
    | jq ".[0:${HN_LIMIT}]" > /tmp/hn_top_ids.json; then
  echo "ADAPTER_ERROR hn: topstories fetch failed"
else
  echo "[]" > /tmp/hn_raw.json
  for id in $(jq -r ".[]" /tmp/hn_top_ids.json); do
    story=$(curl -s --max-time 10 "https://hacker-news.firebaseio.com/v0/item/${id}.json")
    if [ -n "$story" ] && [ "$story" != "null" ]; then
      jq --argjson s "$story" '. += [$s]' /tmp/hn_raw.json > /tmp/hn_raw.tmp \
        && mv /tmp/hn_raw.tmp /tmp/hn_raw.json
    fi
    sleep 0.1
  done

  jq --argjson minscore "$HN_MIN" '
    map(select(
      (.score // 0) >= $minscore and
      ((.url != null) or (.text != null)) and
      .type == "story"
    ))
    | map({
        source: "hn",
        source_id: (.id | tostring),
        title: .title,
        url: (.url // ("https://news.ycombinator.com/item?id=" + (.id | tostring))),
        discussion_url: ("https://news.ycombinator.com/item?id=" + (.id | tostring)),
        raw_score: .score,
        extra: (.text // null)
      })
  ' /tmp/hn_raw.json > /tmp/candidates-hn.json \
    || { echo "[]" > /tmp/candidates-hn.json; echo "ADAPTER_ERROR hn: normalize failed"; }
fi

echo "hn: $(jq length /tmp/candidates-hn.json) candidates"
```
````

- [ ] **Step 2: Verify against the live API**

Run (extracts and executes the adapter's bash block):
```bash
cd /Users/kiranramanna/Documents/github/git_kr/thinkit
export CONFIG=$(python3 -c "import yaml,json; print(json.dumps(yaml.safe_load(open('.routines/sources-daily/config.yml'))))")
sed -n '/^```bash$/,/^```$/p' .routines/sources-daily/adapters/hn.md | sed '1d;$d' | bash
jq -e 'type == "array" and (length > 0) and all(.[]; .source == "hn" and (.source_id|type)=="string" and .title and .url and .discussion_url and (.raw_score|type)=="number")' /tmp/candidates-hn.json && echo "SCHEMA OK"
```
Expected: a line like `hn: 18 candidates` (count varies) followed by `SCHEMA OK`.

- [ ] **Step 3: Commit**

```bash
git add .routines/sources-daily/adapters/hn.md
git commit -m "routine: add hn adapter"
```

---

### Task 3: Lobste.rs adapter

**Files:**
- Create: `.routines/sources-daily/adapters/lobsters.md`

**Interfaces:**
- Consumes: `$CONFIG`.
- Produces: `/tmp/candidates-lobsters.json` — same schema and failure contract as Task 2 (`ADAPTER_ERROR lobsters:` prefix).

- [ ] **Step 1: Inspect the live API shape first**

Run:
```bash
curl -s -H "User-Agent: thinkit-routine" https://lobste.rs/hottest.json | jq '.[0] | {short_id, title, url, comments_url, score, tags}'
```
Expected: an object with those six fields. If field names differ from `short_id`/`comments_url`/`tags`, adjust the jq in Step 2 to the actual names before writing the file.

- [ ] **Step 2: Create the adapter file**

Write `.routines/sources-daily/adapters/lobsters.md` with exactly:

````markdown
# Adapter: Lobste.rs

Fetches the hottest stories from Lobste.rs and emits normalized candidates to
`/tmp/candidates-lobsters.json`. Requires `$CONFIG` in the shell environment.

Lobste.rs is invite-only with a smaller community than HN, hence the lower
`min_score` floor. The tag allowlist is a free pre-filter: items with no
allowlisted tag are dropped before any LLM call. Text posts (no external URL)
use `comments_url` as their canonical URL.

**Failure contract:** on any error, ensure `/tmp/candidates-lobsters.json`
contains `[]` and echo a line starting with `ADAPTER_ERROR lobsters:` — never
abort the run.

```bash
LOB_LIMIT=$(echo "$CONFIG" | jq -r '.sources.lobsters.fetch_limit')
LOB_MIN=$(echo "$CONFIG" | jq -r '.sources.lobsters.min_score')
LOB_TAGS=$(echo "$CONFIG" | jq -c '.sources.lobsters.tag_allowlist')

echo "[]" > /tmp/candidates-lobsters.json

if ! curl -s --max-time 20 -H "User-Agent: thinkit-routine" \
    https://lobste.rs/hottest.json > /tmp/lobsters_raw.json; then
  echo "ADAPTER_ERROR lobsters: fetch failed"
else
  jq --argjson minscore "$LOB_MIN" --argjson limit "$LOB_LIMIT" --argjson allow "$LOB_TAGS" '
    .[0:$limit]
    | map(select(
        (.score // 0) >= $minscore and
        ((.tags // []) | map(. as $t | ($allow | index($t)) != null) | any)
      ))
    | map({
        source: "lobsters",
        source_id: .short_id,
        title: .title,
        url: (if (.url // "") == "" then .comments_url else .url end),
        discussion_url: .comments_url,
        raw_score: .score,
        extra: ((.tags // []) | join(","))
      })
  ' /tmp/lobsters_raw.json > /tmp/candidates-lobsters.json \
    || { echo "[]" > /tmp/candidates-lobsters.json; echo "ADAPTER_ERROR lobsters: normalize failed"; }
fi

echo "lobsters: $(jq length /tmp/candidates-lobsters.json) candidates"
```
````

- [ ] **Step 3: Verify against the live API**

Run:
```bash
cd /Users/kiranramanna/Documents/github/git_kr/thinkit
export CONFIG=$(python3 -c "import yaml,json; print(json.dumps(yaml.safe_load(open('.routines/sources-daily/config.yml'))))")
sed -n '/^```bash$/,/^```$/p' .routines/sources-daily/adapters/lobsters.md | sed '1d;$d' | bash
jq -e 'type == "array" and all(.[]; .source == "lobsters" and .source_id and .url and .discussion_url)' /tmp/candidates-lobsters.json && echo "SCHEMA OK"
```
Expected: `lobsters: N candidates` (N may be 0-10 — the tag allowlist plus score floor is aggressive; 0 on a slow day is valid) then `SCHEMA OK`. If N is 0, temporarily rerun with `LOB_MIN=1` to confirm the pipeline produces items, then restore.

- [ ] **Step 4: Commit**

```bash
git add .routines/sources-daily/adapters/lobsters.md
git commit -m "routine: add lobsters adapter"
```

---

### Task 4: HF Daily Papers adapter

**Files:**
- Create: `.routines/sources-daily/adapters/hf-papers.md`

**Interfaces:**
- Consumes: `$CONFIG`.
- Produces: `/tmp/candidates-hf-papers.json` — same schema and failure contract (`ADAPTER_ERROR hf-papers:` prefix). `extra` carries the paper abstract; `url` is the arXiv abs page; `discussion_url` is the HF paper page.

- [ ] **Step 1: Inspect the live API shape first**

Run:
```bash
curl -s "https://huggingface.co/api/daily_papers" | jq '.[0] | {id: .paper.id, title: .paper.title, upvotes: .paper.upvotes, summary: (.paper.summary | .[0:80])}'
```
Expected: an object with arXiv-style `id` (e.g. `"2508.01234"`), `title`, numeric `upvotes`, `summary` text. If the nesting differs (e.g. no `.paper` wrapper), adjust the jq paths in Step 2 to the actual shape before writing the file.

- [ ] **Step 2: Create the adapter file**

Write `.routines/sources-daily/adapters/hf-papers.md` with exactly:

````markdown
# Adapter: Hugging Face Daily Papers

Fetches today's community-upvoted papers from the HF daily_papers API and
emits normalized candidates to `/tmp/candidates-hf-papers.json`. Requires
`$CONFIG` in the shell environment.

The API returns one day's curated list (refreshes ~once per weekday), so
there is no fetch_limit. `url` is the arXiv abs page (canonical for dedup);
`discussion_url` is the HF paper page; `extra` carries the abstract, which
grounds both scoring and writing (papers rarely have public reaction yet).

**Failure contract:** on any error, ensure `/tmp/candidates-hf-papers.json`
contains `[]` and echo a line starting with `ADAPTER_ERROR hf-papers:` —
never abort the run.

```bash
HF_MIN=$(echo "$CONFIG" | jq -r '.sources["hf-papers"].min_score')

echo "[]" > /tmp/candidates-hf-papers.json

if ! curl -s --max-time 20 "https://huggingface.co/api/daily_papers" \
    > /tmp/hf_raw.json; then
  echo "ADAPTER_ERROR hf-papers: fetch failed"
else
  jq --argjson minscore "$HF_MIN" '
    map(select((.paper.upvotes // 0) >= $minscore))
    | map({
        source: "hf-papers",
        source_id: .paper.id,
        title: .paper.title,
        url: ("https://arxiv.org/abs/" + .paper.id),
        discussion_url: ("https://huggingface.co/papers/" + .paper.id),
        raw_score: .paper.upvotes,
        extra: (.paper.summary // null)
      })
  ' /tmp/hf_raw.json > /tmp/candidates-hf-papers.json \
    || { echo "[]" > /tmp/candidates-hf-papers.json; echo "ADAPTER_ERROR hf-papers: normalize failed"; }
fi

echo "hf-papers: $(jq length /tmp/candidates-hf-papers.json) candidates"
```
````

- [ ] **Step 3: Verify against the live API**

Run:
```bash
cd /Users/kiranramanna/Documents/github/git_kr/thinkit
export CONFIG=$(python3 -c "import yaml,json; print(json.dumps(yaml.safe_load(open('.routines/sources-daily/config.yml'))))")
sed -n '/^```bash$/,/^```$/p' .routines/sources-daily/adapters/hf-papers.md | sed '1d;$d' | bash
jq -e 'type == "array" and (length > 0) and all(.[]; .source == "hf-papers" and (.url | startswith("https://arxiv.org/abs/")) and (.extra | length > 50))' /tmp/candidates-hf-papers.json && echo "SCHEMA OK"
```
Expected: `hf-papers: N candidates` (typically 5-25 on a weekday) then `SCHEMA OK`. On a weekend the list may be stale but non-empty; that's fine.

- [ ] **Step 4: Commit**

```bash
git add .routines/sources-daily/adapters/hf-papers.md
git commit -m "routine: add hf-papers adapter"
```

---

### Task 5: Generalize `shared/post-template.md`

**Files:**
- Modify: `.routines/shared/post-template.md`

**Interfaces:**
- Produces: the frontmatter contract consumed by `writing-prompt.md` (Task 8) and validated in the end-to-end test (Task 12): `source`, `source_id`, `discussion_url`, `source_url` replace `hn_id`, `hn_url`.

- [ ] **Step 1: Replace the frontmatter block and field rules**

In `.routines/shared/post-template.md`, replace the frontmatter YAML block and its field rules. New frontmatter block:

```yaml
---
layout: post
title: "<Title — writer's voice, NOT the source headline verbatim>"
date: <YYYY-MM-DD HH:MM:SS> +0000
categories: [<2-4 tags from the controlled vocabulary>]
source: <hn | lobsters | hf-papers>
source_id: <string — HN item id / Lobste.rs short_id / arXiv id>
discussion_url: <HN thread / Lobste.rs thread / HF paper page URL>
source_url: <linked article or arXiv URL, or null for discussion-only posts>
---
```

New field rules (replacing the `hn_id:`/`hn_url:` bullets; keep the `layout`, `title`, `date`, `categories` bullets as they are):

```markdown
- `source:` — one of `hn`, `lobsters`, `hf-papers`. No quotes.
- `source_id:` — quoted string (HN ids are numeric but stored as strings;
  arXiv ids contain a dot).
- `discussion_url:` — full URL of the community thread (HN item page,
  Lobste.rs comments page, or HF paper page).
- `source_url:` — full URL of the linked article / arXiv abs page, or the
  literal word `null` (no quotes) for discussion-only posts (e.g. Ask HN).
```

- [ ] **Step 2: Update body rules for the reaction paragraph**

In the Body section, replace the `**200-400 words** of body content.` line with:

```markdown
- **200-400 words** of body content; **250-500 words** when a "wider
  reaction" paragraph is present (see below).
```

And append to the Body section:

```markdown
- **Reaction paragraph (optional):** when the routine's research step
  supplies ≥ 2 citations, the post ends with one paragraph on how the story
  is landing across the public web, each citation linked inline. With fewer
  than 2 citations this paragraph is omitted entirely — never characterize
  sentiment without linked sources.
- **Linking:** mention `source_url` and `discussion_url` at least once each
  in the body, not just in frontmatter.
```

(The old `Linking:` bullet that names `hn_url` is replaced by the above.)

- [ ] **Step 3: Update the complete example**

Replace the `hn_id:`/`hn_url:` lines in the example frontmatter with:

```yaml
source: hn
source_id: "39842734"
discussion_url: https://news.ycombinator.com/item?id=39842734
source_url: https://example.com/reranker-blog
```

The example body stays as-is (it has no reaction paragraph — that's a valid state).

- [ ] **Step 4: Verify no stale field names remain in the template**

Run:
```bash
grep -n "hn_id\|hn_url" .routines/shared/post-template.md; echo "exit: $?"
```
Expected: no matches, `exit: 1`.

- [ ] **Step 5: Commit**

```bash
git add .routines/shared/post-template.md
git commit -m "routine: generalize post template frontmatter for multi-source"
```

---

### Task 6: Scoring prompt

**Files:**
- Create: `.routines/sources-daily/scoring-prompt.md`

**Interfaces:**
- Consumes: candidate objects (Global Constraints schema) with `extra` truncated to 500 chars by the orchestrator.
- Produces: LLM output contract consumed by trigger Step 6: JSON array of `{source, source_id, score, reason}`.

- [ ] **Step 1: Create the file**

Write `.routines/sources-daily/scoring-prompt.md` with exactly:

```markdown
# Scoring Sub-Prompt

You are scoring candidate stories from three sources — Hacker News,
Lobste.rs, and Hugging Face Daily Papers — against a writer's profile to
decide which (if any) deserve a short blog post.

## Inputs you will receive

1. The writer's profile (from `shared/profile.md`).
2. A JSON list of candidates, each with: `source` ("hn" | "lobsters" |
   "hf-papers"), `source_id`, `title`, `url`, `raw_score` (source-native
   upvotes — NOT comparable across sources; ignore it for scoring), and
   `extra` (HN: Ask-HN text or null; Lobste.rs: comma-joined tags;
   hf-papers: the paper abstract, truncated).

## Your output (STRICT)

Output ONLY valid JSON matching this schema. No markdown, no preamble, no
commentary.

```json
[
  {
    "source": "<source verbatim from the candidate>",
    "source_id": "<source_id verbatim from the candidate>",
    "score": <integer 1-10>,
    "reason": "<one-sentence reason for the score, in plain English>"
  },
  ... one entry per candidate ...
]
```

## Scoring rubric

Use the writer's profile to assign each candidate a score 1-10:

- **9-10 — direct hit on primary expertise.**
  Substantive technical content directly in Agentic AI, RAG, LLM Ops,
  Conversational AI, or Knowledge Graphs. The writer ships this in
  production. Examples: a new retrieval reranker paper, a production agent
  framework's postmortem, an eval harness for tool use.

- **7-8 — strong adjacency.**
  Production AI engineering, enterprise AI deployment, platform architecture,
  governance/observability, multi-agent systems. Or a primary-expertise topic
  with thinner technical content.

- **5-6 — tangential.**
  Touches AI/ML or systems engineering but not in the writer's lane. Or a
  primary-expertise topic that's pure marketing/hype with no substance.

- **3-4 — off-topic for professional voice.**
  Personal-interest topics — the writer might want to write manually, not
  via the routine.

- **1-2 — off-topic and uninteresting.**
  Crypto, mobile dev, frontend frameworks, programming language wars,
  productivity tools, gaming, politics. Filter these out hard.

## Source-aware rules

- **Papers (`hf-papers`)**: score on **relevance to the writer's production
  practice**, not novelty alone. An incremental-but-applicable RAG-eval
  paper outranks a flashy-but-distant theory paper. Ground your judgment in
  the abstract (`extra`); a hot paper (high raw_score) far from the
  writer's lane still scores low.
- **Lobste.rs**: tags in `extra` are context, not a score signal — an item
  tagged `ai` can still be tangential fluff.

## Hard rules

- **Crypto-only stories**: score ≤ 2 unless explicitly about AI compute
  economics.
- **"Show HN" / project announcements**: score the project on its merits;
  don't bias just because it's a launch.
- **Ask HN / text posts**: judge the question's substance; a thoughtful Ask
  HN about RAG eval can score 8.
- **Job postings / "We're hiring"**: score 1.
- **Repeat coverage** (same topic across days or sources): not your job to
  detect dedup; just score on merits. The orchestrator handles dedup.

## Reasoning style

Keep `reason` to one sentence, ~10-20 words. Examples:

- "Direct match: production RAG eval methodology, writer has shipped this at ServiceNow."
- "Paper is applicable: agent-tool-use benchmark the writer could run against his own harness."
- "Off-topic: crypto announcement with no AI angle."

## Calibration

If you find yourself scoring most items 6-8, re-read the rubric. A typical
run should produce a wide distribution: maybe 1-3 items at 8+, several at
5-7, many at 1-4. Be selective at the top.
```

- [ ] **Step 2: Verify content against spec § 6**

Check (by reading, no command): output schema keys are `source`, `source_id`, `score`, `reason`; the paper-relevance rule is present; the rubric bands match hn-daily's (9-10 / 7-8 / 5-6 / 3-4 / 1-2).

- [ ] **Step 3: Commit**

```bash
git add .routines/sources-daily/scoring-prompt.md
git commit -m "routine: add source-aware scoring prompt"
```

---

### Task 7: Research prompt (sentiment sweep)

**Files:**
- Create: `.routines/sources-daily/research-prompt.md`

**Interfaces:**
- Consumes: one selected candidate + `research` config block.
- Produces: `/tmp/research-<source>-<source_id>.json` with schema `{"citations": [{"url","outlet","stance","note"}], "sentiment_summary": "<string or null>"}` — consumed by the writing step (Task 8, Task 9 Step "writing input").

- [ ] **Step 1: Create the file**

Write `.routines/sources-daily/research-prompt.md` with exactly:

```markdown
# Research Sub-Prompt (Sentiment Sweep)

You (the orchestrator) execute this yourself using your WebSearch/WebFetch
tools. Do NOT delegate this to an SDK sub-LLM call — sub-calls have no web
access. Run once per selected item, after selection and before writing.

## Inputs

- One selected candidate: `source`, `source_id`, `title`, `url`,
  `discussion_url`, `extra`.
- Config: `research.min_citations`, `research.max_citations`.

## Sources — best-effort public web ONLY

Reachable and citable: news coverage, Substack posts, Reddit threads,
Bluesky/Mastodon posts, YouTube, and X posts only when a search engine
surfaces them AND the link resolves to readable content. X, Facebook, and
LinkedIn are login-walled — never fabricate reaction from them, and never
cite a link you could not read at least a snippet of.

## Procedure

1. Derive 2-4 search queries from the candidate:
   - the title verbatim (quoted);
   - title keywords + the key entity (product, company, paper name);
   - `<key entity> site:substack.com`;
   - `<key entity> reddit`.
2. Run each query with WebSearch. Collect distinct result URLs that are
   public commentary or coverage of THIS story (not merely the same topic).
3. Exclude: the candidate's own `url` and `discussion_url`, login-walled
   pages, SEO-spam aggregators, and anything older than the story itself.
4. For up to `max_citations` promising results, load enough of the page
   (WebFetch) or rely on a clearly stance-bearing search snippet to judge
   the outlet's stance.
5. Write the output JSON to `/tmp/research-<source>-<source_id>.json`.

## Budget

Per item: at most 6 WebSearch calls and 5 WebFetch calls. This step must
never dominate the run; when the budget is spent, emit what you have.

## Output schema (STRICT)

```json
{
  "citations": [
    {
      "url": "<full URL>",
      "outlet": "<Substack | Reddit | Bluesky | The Verge | ...>",
      "stance": "positive | negative | mixed | neutral",
      "note": "<one-line gist of this source's take>"
    }
  ],
  "sentiment_summary": "<one sentence on how reception is trending>"
}
```

## Hard rules

- **No receipts, no paragraph.** If fewer than `min_citations` usable
  citations survive the exclusions, output
  `{"citations": [], "sentiment_summary": null}`. The post will simply omit
  the reaction paragraph. This is the expected outcome for most `hf-papers`
  items (too fresh to have public reaction).
- `sentiment_summary` must be supported by the citations listed — it
  describes THEIR stances, not your own opinion of the story.
- On any tool error mid-sweep, emit what you have (or the empty form) —
  never block the run.
```

- [ ] **Step 2: Verify content against spec § 7**

Check (by reading): min/max citations come from config, the empty-output form matches `{"citations": [], "sentiment_summary": null}`, X/FB/LinkedIn exclusion stated, budget stated.

- [ ] **Step 3: Commit**

```bash
git add .routines/sources-daily/research-prompt.md
git commit -m "routine: add sentiment research prompt"
```

---

### Task 8: Writing prompt

**Files:**
- Create: `.routines/sources-daily/writing-prompt.md`

**Interfaces:**
- Consumes: writing input JSON built by trigger Step 8: `{profile, voice_rules, post_template, policy, item, excerpt, research, run_ts}` where `item` is a normalized candidate and `research` is Task 7's output (possibly the empty form).
- Produces: a complete Jekyll post (frontmatter per Task 5's template + body), or the refusal JSON `{"refuse": true, "reason": "..."}`.

- [ ] **Step 1: Create the file**

Write `.routines/sources-daily/writing-prompt.md` with exactly:

```markdown
# Writing Sub-Prompt

You are writing a short blog post in Kiran Ramanna's voice based on a single
curated item from Hacker News, Lobste.rs, or Hugging Face Daily Papers.

## Inputs you will receive

1. The writer's profile (from `shared/profile.md`).
2. Voice rules (from `shared/voice-rules.md`).
3. Post template format (from `shared/post-template.md`).
4. Content policy (from `shared/policy.md`).
5. A single item: `source`, `source_id`, `title`, `url`, `discussion_url`,
   `raw_score`, `extra`, plus `excerpt` (first ~2000 chars of the linked
   article, when fetched) and `run_ts` (UTC datetime for the `date:` field).
6. `research`: `{citations: [...], sentiment_summary}` from the sentiment
   sweep — possibly `{"citations": [], "sentiment_summary": null}`.

## Your output (STRICT)

Output ONLY the full Jekyll post: frontmatter, blank line, body. No
preamble. No "Here's the post:". No closing remarks.

The output MUST be directly writable to a `_posts/*.md` file as-is.

## Frontmatter requirements

Match `shared/post-template.md` exactly:

```yaml
---
layout: post
title: "<your title — re-phrased in writer's voice, NOT the source headline>"
date: <run_ts formatted as YYYY-MM-DD HH:MM:SS> +0000
categories: [<2-4 tags from controlled vocabulary>]
source: <item.source>
source_id: "<item.source_id>"
discussion_url: <item.discussion_url>
source_url: <item.url, or null if the item is a discussion-only post>
---
```

**Controlled categories vocabulary:**
`agentic-ai`, `rag`, `llm-ops`, `enterprise-ai`, `conversational-ai`,
`knowledge-graphs`, `ai-infrastructure`, `research`, `industry`.

Pick 2-4 that fit. Don't invent new tags. `hf-papers` posts almost always
include `research`.

## Body requirements

- **200-400 words** without a reaction paragraph; **250-500 words** with one.
- **Format**: pick ONE — 2-3 short paragraphs OR 5-8 emoji bullets. Don't
  mix both in the same post. (A reaction paragraph after emoji bullets is
  allowed and doesn't count as mixing.)
- **Lead with insight**, not summary.
- **Reference** `source_url` AND `discussion_url` at least once each in the
  body, as markdown links.
- **End** with a question, prediction, or contrarian take — unless a
  reaction paragraph is present, in which case the reaction paragraph is the
  ending and should close on the trend, not a summary.

## Source-specific grounding

- `hn` / `lobsters`: ground in `excerpt` and the story title. The discussion
  link anchor should say "HN discussion" or "Lobste.rs thread" respectively.
- `hf-papers`: ground in the abstract (`extra`). Link the
  [arXiv page](item.url) and the [HF paper page](item.discussion_url) at
  least once each. Judge the paper through the writer's production lens —
  what would he actually do with this?

## Reaction paragraph ("the wider reaction")

Only when `research.citations` has 2 or more entries:

- One final paragraph, writer's voice, describing how the story is landing
  across the public web.
- Cite ONLY the provided citations, each linked inline as
  `[<outlet or short label>](url)`. Use at least 2, at most all of them.
- Reflect the actual stances (`positive`/`negative`/`mixed`/`neutral`) —
  disagreement between sources is worth naming.
- NEVER invent sentiment, paraphrase unlisted sources, or say "the internet
  thinks" without a link.

When `research.citations` has fewer than 2 entries: omit the paragraph
entirely. Do not mention the absence of reaction.

## Voice — apply `shared/voice-rules.md` strictly

Do every "DO" rule. Do not commit a single "AVOID" violation. If you find
yourself writing "dive deep" or "game-changer" or "in today's fast-paced
world", delete and rewrite.

## Policy — apply `shared/policy.md` strictly

If any ABSOLUTE rule would be violated by writing this post, return ONLY
this JSON instead of a post:

```json
{"refuse": true, "reason": "<which rule and why>"}
```

The orchestrator will log the refusal and skip the item.

## Title rules

- Re-phrase, don't copy. "New RAG Paper" → "When Retrieval Stops Being the
  Bottleneck".
- Punctuation: title case is fine; no trailing period; quotes inside title
  use single quotes (because the YAML title is double-quoted).
- Length: 40-70 chars.

## Quality bar

Reread your output before emitting. Ask:

- Would Kiran be embarrassed to see this on his blog tomorrow? If yes, rewrite.
- Does any sentence sound like generic AI content? If yes, rewrite that sentence.
- Did I cite both source_url and discussion_url? If not, add them.
- If a reaction paragraph exists: is every sentiment claim backed by a
  linked citation? If not, cut the claim.
- Is the ending a question, strong take, or a grounded reaction close — not
  a summary?
```

- [ ] **Step 2: Verify contract consistency**

Run:
```bash
grep -c "discussion_url" .routines/sources-daily/writing-prompt.md && grep -n "hn_id\|hn_url" .routines/sources-daily/writing-prompt.md; echo "exit: $?"
```
Expected: a count ≥ 5, then no matches for the stale fields, `exit: 1`.

- [ ] **Step 3: Commit**

```bash
git add .routines/sources-daily/writing-prompt.md
git commit -m "routine: add multi-source writing prompt"
```

---

### Task 9: Orchestrator `trigger.md`

**Files:**
- Create: `.routines/sources-daily/trigger.md`

**Interfaces:**
- Consumes: everything above — adapters (Tasks 2-4), scoring prompt (Task 6), research prompt (Task 7), writing prompt (Task 8), `config.yml` (Task 1), `state.json` (Task 10 creates the real one; this task tests with a synthetic one).
- Produces: the complete run procedure the remote trigger executes.

- [ ] **Step 1: Create the orchestrator file**

Write `.routines/sources-daily/trigger.md` with exactly:

````markdown
# sources-daily Orchestrator

You are running as a Claude Code remote trigger. Your job: fetch candidate
stories from Hacker News, Lobste.rs, and Hugging Face Daily Papers; dedup
across sources; score them against the writer's profile in one LLM call;
research public sentiment for the selected items; and publish 0-2 posts per
run to `kiranramanna/thinkit/_posts/`.

Sub-prompts: `scoring-prompt.md`, `research-prompt.md`, `writing-prompt.md`.
Per-source fetch logic: `adapters/hn.md`, `adapters/lobsters.md`,
`adapters/hf-papers.md`.

## Setup

You have:
- Bash and standard CLI tools (`curl`, `jq`, `git`, `gh`, `python3`)
- `gh` CLI authenticated to the user's GitHub account
- WebSearch/WebFetch tools (required for the research step — Step 7)
- Claude SDK available for sub-LLM calls (scoring, writing)

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
rm -f /tmp/candidates-*.json /tmp/adapter-errors.txt
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
  --argjson candidates "$(jq '[.[] | {source, source_id, title, url, raw_score, extra: ((.extra // "") | .[0:500])}]' /tmp/eligible.json)" \
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
for row in $(jq -c '.[]' /tmp/selected.json); do
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
  # Check for refusal
  if echo "$POST_CONTENT" | head -c 50 | grep -q '"refuse"'; then
    REASON=$(echo "$POST_CONTENT" | jq -r '.reason // "unknown"')
    echo "Refused ${SRC}-${SID}: $REASON"
    continue
  fi

  # Extract title from frontmatter for slug
  TITLE=$(echo "$POST_CONTENT" | sed -n '/^title:/p' | head -1 | sed 's/title:[[:space:]]*"\(.*\)"/\1/')
  SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 -]//g' | sed 's/  */-/g' | sed 's/^-\|-$//g')

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
  PUBLISHED_ENTRIES=$(echo "$PUBLISHED_ENTRIES" | jq --arg u "$NORM" --arg s "$SRC" --arg id "$SID" \
    '. += [{norm_url: $u, source: $s, source_id: $id}]')
done
echo "$PUBLISHED_ENTRIES" > /tmp/published_entries.json
```

Per-item writing errors follow `abort_on_writing_error: false` — skip the
item, continue the loop.

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

state.setdefault('runs', []).append({
    "ts": now_iso,
    "window": "$WINDOW",
    "eligible_count": len(eligible),
    "eligible_per_source": per_source,
    "selected": [f"{s['source']}-{s['source_id']}" for s in selected],
    "posts_written": len(published),
    "adapter_errors": adapter_errors,
})

for p in published:
    state.setdefault('published_urls', {})[p['norm_url']] = {
        "source": p['source'], "source_id": p['source_id'],
        "published_at": now_iso,
    }

# Prune published_urls older than the dedup window
cutoff = datetime.now(timezone.utc) - timedelta(days=CONFIG['dedup_window_days'])
state['published_urls'] = {
    u: m for u, m in state['published_urls'].items()
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
git add _posts/ .routines/sources-daily/state.json

if [ "$POSTS_WRITTEN" -eq 0 ]; then
  MSG="sources-daily: 0 posts — ${DATE_UTC} ${WINDOW} (no matches above threshold)"
else
  MSG="sources-daily: ${POSTS_WRITTEN} post(s) — ${DATE_UTC} ${WINDOW}"
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
````

- [ ] **Step 2: Test URL normalization and merge logic standalone**

Run:
```bash
cd /Users/kiranramanna/Documents/github/git_kr/thinkit
python3 - <<'PYEOF'
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

def normalize_url(u):
    s = urlsplit(u.strip())
    q = [(k, v) for k, v in parse_qsl(s.query, keep_blank_values=True)
         if not k.lower().startswith('utm_')]
    path = s.path.rstrip('/') or '/'
    return urlunsplit((s.scheme.lower(), s.netloc.lower(), path, urlencode(q), ''))

cases = [
    ("https://Example.com/Post/?utm_source=hn&utm_medium=x", "https://example.com/Post"),
    ("https://example.com/post/", "https://example.com/post"),
    ("https://example.com/post?id=3&utm_campaign=z", "https://example.com/post?id=3"),
    ("https://example.com/", "https://example.com/"),
]
for raw, want in cases:
    got = normalize_url(raw)
    assert got == want, f"{raw} -> {got}, want {want}"
print("normalize_url: 4/4 OK")
PYEOF
```
Expected: `normalize_url: 4/4 OK`. Note: path case is preserved (paths are case-sensitive); only scheme/host lowercase.

- [ ] **Step 3: Test the merge + dedup block end-to-end with synthetic data**

Run:
```bash
cd /Users/kiranramanna/Documents/github/git_kr/thinkit
mkdir -p /tmp/sd-test && cd /tmp/sd-test
cat > /tmp/candidates-hn.json <<'EOF'
[{"source":"hn","source_id":"1","title":"A","url":"https://example.com/a?utm_source=hn","discussion_url":"https://news.ycombinator.com/item?id=1","raw_score":50,"extra":null},
 {"source":"hn","source_id":"2","title":"B","url":"https://example.com/b","discussion_url":"https://news.ycombinator.com/item?id=2","raw_score":40,"extra":null}]
EOF
cat > /tmp/candidates-lobsters.json <<'EOF'
[{"source":"lobsters","source_id":"x1","title":"A","url":"https://example.com/a/","discussion_url":"https://lobste.rs/s/x1","raw_score":12,"extra":"ai"}]
EOF
rm -f /tmp/candidates-hf-papers.json
mkdir -p .routines/sources-daily
cat > .routines/sources-daily/state.json <<'EOF'
{"published_urls": {"https://example.com/b": {"source":"hn","source_id":"2","published_at":"2099-01-01T00:00:00Z"}}, "runs": []}
EOF
export CONFIG='{"dedup_window_days": 7}'
# paste the Step 4 python block from trigger.md here (it reads the same paths)
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
published = {u for u, meta in state.get('published_urls', {}).items()
             if datetime.fromisoformat(meta['published_at'].replace('Z', '+00:00')) > cutoff}
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
eligible = [c for k, c in merged.items() if k not in published]
assert len(merged) == 2, f"expected 2 merged, got {len(merged)}"
assert len(eligible) == 1, f"expected 1 eligible, got {len(eligible)}"
e = eligible[0]
assert e['source'] == 'hn' and e['source_id'] == '1'
assert 'also on lobsters: https://lobste.rs/s/x1' in e['extra']
print("merge+dedup: OK (cross-source merged, HN primary, published dropped)")
PYEOF
cd /Users/kiranramanna/Documents/github/git_kr/thinkit && rm -rf /tmp/sd-test
```
Expected: `merge+dedup: OK (cross-source merged, HN primary, published dropped)`.

- [ ] **Step 4: Commit**

```bash
git add .routines/sources-daily/trigger.md
git commit -m "routine: add sources-daily orchestrator"
```

---

### Task 10: State migration from hn-daily

**Files:**
- Create: `.routines/sources-daily/state.json` (generated by a one-off script; the script itself lives in the session scratchpad and is not committed)

**Interfaces:**
- Consumes: `.routines/hn-daily/state.json` (`published_ids: {hn_id: iso_ts}`), HN Firebase API.
- Produces: `.routines/sources-daily/state.json` with shape `{"published_urls": {norm_url: {source, source_id, published_at}}, "last_pruned_ts": <iso>, "runs": []}` — consumed by trigger Steps 4/6/9.

- [ ] **Step 1: Write and run the migration script**

Write to the session scratchpad (NOT the repo) as `migrate-state.py`:

```python
import json, time, urllib.request
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

REPO = '/Users/kiranramanna/Documents/github/git_kr/thinkit'

def normalize_url(u):
    s = urlsplit(u.strip())
    q = [(k, v) for k, v in parse_qsl(s.query, keep_blank_values=True)
         if not k.lower().startswith('utm_')]
    path = s.path.rstrip('/') or '/'
    return urlunsplit((s.scheme.lower(), s.netloc.lower(), path, urlencode(q), ''))

old = json.load(open(f'{REPO}/.routines/hn-daily/state.json'))
published_urls = {}
for hn_id, ts in old['published_ids'].items():
    fallback = f"https://news.ycombinator.com/item?id={hn_id}"
    try:
        with urllib.request.urlopen(
                f"https://hacker-news.firebaseio.com/v0/item/{hn_id}.json",
                timeout=10) as r:
            item = json.load(r)
        url = (item or {}).get('url') or fallback
    except Exception:
        url = fallback
    published_urls[normalize_url(url)] = {
        "source": "hn", "source_id": hn_id, "published_at": ts,
    }
    time.sleep(0.1)

new = {
    "published_urls": published_urls,
    "last_pruned_ts": old.get("last_pruned_ts"),
    "runs": [],
}
with open(f'{REPO}/.routines/sources-daily/state.json', 'w') as f:
    json.dump(new, f, indent=2, sort_keys=True)
print(f"migrated {len(published_urls)} of {len(old['published_ids'])} ids")
```

Run: `python3 <scratchpad>/migrate-state.py`
Expected: `migrated N of N ids` where both numbers equal the entry count of `published_ids` in `.routines/hn-daily/state.json` (unless two old ids resolved to the same URL — a smaller first number is then correct; note it in the commit message).

Note: the old entries date to June 2026, so they are all outside the 7-day dedup window and will be pruned on the routine's first live run. Migrating them anyway keeps the cutover mechanical and correct regardless of when it lands.

- [ ] **Step 2: Verify the new state file shape**

Run:
```bash
cd /Users/kiranramanna/Documents/github/git_kr/thinkit
python3 -c "
import json
s = json.load(open('.routines/sources-daily/state.json'))
assert set(s.keys()) == {'published_urls', 'last_pruned_ts', 'runs'}
assert s['runs'] == []
for u, m in s['published_urls'].items():
    assert u.startswith('http'), u
    assert set(m.keys()) == {'source', 'source_id', 'published_at'}
    assert m['source'] == 'hn'
print('state shape OK:', len(s['published_urls']), 'entries')
"
```
Expected: `state shape OK: N entries`.

- [ ] **Step 3: Commit**

```bash
git add .routines/sources-daily/state.json
git commit -m "routine: migrate hn-daily state to URL-keyed sources-daily state"
```

---

### Task 11: Routine README + cutover (retire hn-daily)

**Files:**
- Create: `.routines/sources-daily/README.md`
- Modify: `.routines/README.md` (Active routines section)
- Delete: `.routines/hn-daily/` (entire directory)

**Interfaces:**
- Consumes: everything — this task performs the cutover, so Tasks 1-10 must be complete and committed first.

- [ ] **Step 1: Create the routine README**

Write `.routines/sources-daily/README.md` with exactly:

```markdown
# Routine: sources-daily

Twice-daily multi-source curation (Hacker News + Lobste.rs + Hugging Face
Daily Papers) that publishes 0-2 short-take blog posts per run (max 4/day)
to `_posts/`, each optionally closing with a citation-backed "wider
reaction" paragraph.

Replaces the retired `hn-daily` routine (see git history and
`../specs/2026-08-05-sources-daily-merged-routine-design.md`).

## Schedule

- Morning: 14:00 UTC (~06-07 PT)
- Evening: 03:00 UTC (~19-20 PT)

## Flow

1. **Fetch**: each enabled adapter (`adapters/*.md`) pulls its source and
   emits normalized candidates (common schema, per-source upvote floors).
2. **Merge + dedup**: candidates collapse across sources by normalized
   canonical URL (HN primary on collision); anything published within the
   rolling 7-day window is dropped.
3. **Score**: one LLM call rates all candidates against
   `../shared/profile.md` (papers scored on relevance to practice).
4. **Select**: top items ≥ threshold, capped per run and per day, with a
   source-diversity tie-break.
5. **Research**: per selected item, a best-effort public-web sentiment
   sweep (news, Substack, Reddit, Bluesky/Mastodon) producing 0-5 stance
   citations. Fewer than 2 citations → no reaction paragraph.
6. **Write**: one LLM call per item produces a complete Jekyll post.
7. **Record**: append run to `state.json`, register published URLs, prune.
8. **Commit + push**: single commit per run, pushed to `origin master`.

## Files

- `trigger.md` — the orchestrator prompt the Claude trigger runs.
- `adapters/hn.md`, `adapters/lobsters.md`, `adapters/hf-papers.md` —
  per-source fetch + normalize.
- `scoring-prompt.md` — sub-prompt for step 3.
- `research-prompt.md` — sub-prompt for step 5 (run by the orchestrator
  itself; needs WebSearch).
- `writing-prompt.md` — sub-prompt for step 6.
- `config.yml` — tunables (thresholds, caps, per-source floors, research).
- `state.json` — run log + 7-day dedup window of published canonical URLs.

## Tuning

| What | Where |
|---|---|
| Match threshold (1-10) | `config.yml` → `threshold` |
| Posts per run / per day | `config.yml` → `posts_per_run`, `posts_per_day` |
| Per-source upvote floors | `config.yml` → `sources.<name>.min_score` |
| Disable a source | `config.yml` → `sources.<name>.enabled: false` |
| Lobste.rs topic filter | `config.yml` → `sources.lobsters.tag_allowlist` |
| Reaction paragraph on/off | `config.yml` → `research.enabled` |
| Citation floor/cap | `config.yml` → `research.min_citations` / `max_citations` |
| Dedup window (days) | `config.yml` → `dedup_window_days` |
| LLM models | `config.yml` → `scoring_model`, `writing_model` |
| Voice / tone | `../shared/voice-rules.md` |
| Profile / topics | `../shared/profile.md` |
| Categories taxonomy | `../shared/post-template.md` |

## Monitoring

```bash
git log --oneline --grep="^sources-daily:" --since="14 days ago"
```

Expect ~28 commits over 14 days (2/day). Gaps mean the trigger isn't firing
or is silently failing. Check `state.json` → last run's `adapter_errors`
for per-source failures.
```

- [ ] **Step 2: Update `.routines/README.md`**

Replace the active-routines line:

```markdown
- `hn-daily/` — Twice-daily Hacker News curation. See `hn-daily/README.md`.
```

with:

```markdown
- `sources-daily/` — Twice-daily multi-source curation (HN + Lobste.rs + HF
  Daily Papers) with sentiment citations. See `sources-daily/README.md`.
```

Also update the layout-table example `(e.g., ``hn-daily/``)` to `(e.g., ``sources-daily/``)` and the "Adding a new routine" step 1 example `a sibling of ``hn-daily/``` to `a sibling of ``sources-daily/```.

- [ ] **Step 3: Delete hn-daily**

```bash
cd /Users/kiranramanna/Documents/github/git_kr/thinkit
git rm -r .routines/hn-daily/
```

- [ ] **Step 4: Verify no dangling references**

Run:
```bash
grep -rn "hn-daily" .routines/ --include="*.md" --include="*.yml" | grep -v "specs/" | grep -v "plans/"; echo "exit: $?"
```
Expected: no matches outside `specs/` and `plans/` (historical docs may reference it), `exit: 1`.

- [ ] **Step 5: Commit**

```bash
git add .routines/README.md .routines/sources-daily/README.md
git commit -m "routine: cut over to sources-daily, retire hn-daily"
```

---

### Task 12: End-to-end manual test run (no push)

**Files:**
- None created in the repo; scratch clone only.

**Interfaces:**
- Consumes: the complete committed routine (Tasks 1-11).

This validates spec § 11. The implementer plays the orchestrator role
manually against a scratch clone. **Never push from the scratch clone.**

- [ ] **Step 1: Set up the scratch clone**

```bash
SCRATCH=<session scratchpad>/thinkit-e2e
git clone /Users/kiranramanna/Documents/github/git_kr/thinkit "$SCRATCH"
cd "$SCRATCH"
git remote remove origin   # makes an accidental push impossible
```

- [ ] **Step 2: Run trigger Steps 2-4 (load, adapters, merge/dedup)**

Follow `.routines/sources-daily/trigger.md` Steps 2-4 verbatim in the scratch clone (skip Step 1's clone; window will be "manual"). Verify:
- Each enabled adapter printed `<source>: N candidates`.
- The merge printed `eligible: N (raw R, cross-source merged to M, D dropped as already published)`.
- `/tmp/eligible.json` entries all carry `norm_url`.

- [ ] **Step 3: Run trigger Step 5 (scoring)**

Run the scoring call as written (requires `ANTHROPIC_API_KEY` or OAuth token in the session). Verify `/tmp/scores.json` validates: every entry keyed by an existing (`source`, `source_id`), scores are 1-10 integers, distribution is wide (not everything 6-8).

- [ ] **Step 4: Run trigger Steps 6-8 (select, research, write)**

- Verify the selection printout shows the cap math (`cap 2, written today 0`).
- For ONE selected item, perform the research sweep per `research-prompt.md` using this session's WebSearch/WebFetch; verify the output JSON validates against the schema, and that citations actually resolve.
- Run the writing call for that item. Verify the output post: frontmatter has `source`/`source_id`/`discussion_url`/`source_url` (no `hn_id`/`hn_url`), body word count in budget, both links present in the body, and the reaction paragraph present iff citations ≥ 2 with every sentiment claim linked.

- [ ] **Step 5: Run trigger Step 9 (state update) and inspect**

Verify the scratch `state.json` gained a run entry with `eligible_per_source`, `selected`, `posts_written`, and that `published_urls` gained the written item's `norm_url`. Commit locally in the scratch clone only. Do NOT push (origin was removed; confirm with `git remote -v` showing empty).

- [ ] **Step 6: Record results**

Note candidate counts per source, the scored distribution, and any jq/API-shape surprises in the session summary for the user. If an API shape differed from an adapter's assumptions, fix the adapter in the real repo, re-verify (the adapter task's verification step), and commit the fix with `routine: fix <source> adapter for live API shape`.

- [ ] **Step 7: Clean up**

```bash
rm -rf "$SCRATCH"
```

---

### Task 13: Handoff — repoint the remote trigger (user action)

**Files:** none — this is outside the repo (spec § 9 item 6).

- [ ] **Step 1: Present the handoff note to the user**

The final session summary must tell the user, explicitly:

1. The remote-trigger schedule currently pointing at
   `.routines/hn-daily/trigger.md` must be repointed to
   `.routines/sources-daily/trigger.md`. Same two windows: 14:00 UTC and
   03:00 UTC daily. (Observation from git history: no routine commits since
   2026-06-15 — the old trigger appears to have stopped firing in mid-June,
   so this may be a re-creation rather than an edit.)
2. All work is committed locally on `master` and **not pushed** — the user
   pushes when ready (`git push origin master` from the repo).
3. First-week tuning expectations: Lobste.rs may contribute few candidates
   (floor 10 + tag allowlist); HF papers will usually skip the reaction
   paragraph; per-source floors live in `config.yml`.
```

---

## Self-Review (completed at plan-writing time)

- **Spec coverage:** § 2 layout → Tasks 1-9, 11; § 3 schema → Tasks 2-4 (Interfaces); § 4 adapters/config → Tasks 1-4; § 5 dedup/state/migration → Tasks 9 (Step 4 block), 10; § 6 scoring/selection → Tasks 6, 9 (Steps 5-6); § 7 research → Tasks 7, 9 (Step 7); § 8 writing/template → Tasks 5, 8; § 9 cutover → Tasks 11, 13; § 10 errors → Task 9 (Step 11); § 11 testing → Task 12 plus per-task verifications. No gaps found.
- **Placeholder scan:** no TBDs; every created file's full content is inline; the two API-shape "inspect first" steps are deliberate live-endpoint guards with concrete adjustment instructions, not placeholders.
- **Type consistency:** candidate schema fields, `/tmp/candidates-<source>.json` paths, `ADAPTER_ERROR <source>:` prefixes, `/tmp/research-<source>-<source_id>.json`, state shape `{published_urls, last_pruned_ts, runs}`, and score-entry shape `{source, source_id, score, reason}` are used identically across Tasks 2-12.
