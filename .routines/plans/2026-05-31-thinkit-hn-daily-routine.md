# Thinkit HN-Daily Routine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Claude Code remote trigger that fires twice daily, scans the top 30 Hacker News stories, scores each against Kiran's writer profile, and publishes 0-2 short-take blog posts per run (max 4/day) to `kiranramanna/thinkit/_posts/`.

**Architecture:** Self-contained in the `thinkit` repo. All assets live under `.routines/` (Jekyll-excluded via dotfile convention). Two scheduled Claude triggers (14:00 + 03:00 UTC) clone the repo, load profile/prompts/state, call HN's Firebase API, run a scoring LLM call, run per-item writing LLM calls, write posts, update state, commit, and push back to `origin`. No local-machine dependency at runtime.

**Tech Stack:** Claude Code remote triggers, `claude_agent_sdk` (Sonnet for writing, Haiku for scoring), Hacker News Firebase API, Jekyll 4.x, GitHub Pages, `gh` CLI, `bash`, `jq`, `curl`.

**Spec reference:** `.routines/specs/2026-05-31-thinkit-publishing-routines-design.md` § 4.

---

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `.routines/README.md` | Create | System-level overview of the routine framework |
| `.routines/shared/profile.md` | Create | Curated writer profile snapshot (subset of codex-research/persona) |
| `.routines/shared/voice-rules.md` | Create | Voice/tone do's and don'ts |
| `.routines/shared/post-template.md` | Create | Jekyll frontmatter skeleton + structure example |
| `.routines/shared/policy.md` | Create | Global content policy (no PII, no profanity, etc.) |
| `.routines/hn-daily/README.md` | Create | hn-daily routine docs |
| `.routines/hn-daily/config.yml` | Create | Tunables (threshold, cap, models, etc.) |
| `.routines/hn-daily/state.json` | Create | Initial empty state |
| `.routines/hn-daily/scoring-prompt.md` | Create | Sub-prompt: score HN items vs profile |
| `.routines/hn-daily/writing-prompt.md` | Create | Sub-prompt: write post in voice |
| `.routines/hn-daily/trigger.md` | Create | Orchestrator prompt the Claude trigger runs |
| (none) | Configure | Two Claude RemoteTriggers (morning + evening cron) |

---

## Prerequisites

- [ ] Effort 1 (theme light/dark) is committed (or in flight) — independent, can proceed in parallel.
- [ ] Spec at `.routines/specs/2026-05-31-thinkit-publishing-routines-design.md` is reviewed and approved.
- [ ] `gh` CLI auth resolved for `kiranramanna/thinkit` push access (currently logged in as `krama-mcp`).
- [ ] `codex-research/persona/writers_style_and_profile.md` is accessible at `~/Documents/github/codex-research/persona/writers_style_and_profile.md`.
- [ ] Anthropic / Claude OAuth token is set in the environment (`CLAUDE_CODE_OAUTH_TOKEN`).

---

## Phase A — Shared assets

These files are loaded by the trigger on every run. They're the "brain" of the routine: profile shapes scoring, voice rules shape writing, post template shapes output, policy adds guardrails.

### Task A1: Create branch for routine work

**Files:** none (git operation)

- [ ] **Step 1: Switch to thinkit and check state**

```bash
cd ~/Documents/github/thinkit
git status
git branch --show-current
```

- [ ] **Step 2: Branch from `feat/routines-spec` (the spec is already there)**

```bash
git checkout feat/routines-spec
git pull origin feat/routines-spec 2>/dev/null || echo "branch not yet pushed — fine"
git checkout -b feat/hn-daily-routine
```

Expected: `Switched to a new branch 'feat/hn-daily-routine'`.

---

### Task A2: Create `.routines/README.md`

**Files:**
- Create: `.routines/README.md`

- [ ] **Step 1: Write the file**

Create `~/Documents/github/thinkit/.routines/README.md` with this content:

```markdown
# Routines

This directory holds all automation for the `thinkit` blog. Each routine is a
self-contained folder that produces posts in `_posts/` on a schedule (or on
demand).

## Layout

| Path | Purpose |
|---|---|
| `shared/` | Assets used by every routine: profile, voice rules, post template, policy |
| `lib/` | Optional shared helpers (bash/jq utilities) — most routines won't need these |
| `specs/` | Design specs (one per major effort) |
| `plans/` | Implementation plans (one per design spec) |
| `<routine>/` | One folder per routine (e.g., `hn-daily/`) |

## Adding a new routine

1. Create a folder `<routine-name>/` as a sibling of `hn-daily/`.
2. Add the standard five files: `README.md`, `trigger.md`, sub-prompts as needed, `config.yml`, `state.json`.
3. Reference `../shared/profile.md` and `../shared/voice-rules.md` from your trigger prompt.
4. Schedule via Claude Code remote triggers; each routine has its own schedule.
5. State per routine — routines don't share state.

## Jekyll exclusion

This directory begins with a dot, so Jekyll auto-excludes it. No `_site/` rebuild
publishes anything under `.routines/`. Safe to commit prompts, state files, and
profile snapshots here.

## Active routines

- `hn-daily/` — Twice-daily Hacker News curation. See `hn-daily/README.md`.
```

- [ ] **Step 2: Verify file exists and is readable**

```bash
cat ~/Documents/github/thinkit/.routines/README.md | head -5
```

Expected: file content prints; no `cat: No such file` error.

---

### Task A3: Build `shared/profile.md` from `codex-research` extract

**Files:**
- Create: `.routines/shared/profile.md`
- Reference: `~/Documents/github/codex-research/persona/writers_style_and_profile.md` (read-only)

- [ ] **Step 1: Confirm source file exists**

```bash
ls -la ~/Documents/github/codex-research/persona/writers_style_and_profile.md
```

Expected: file exists, ~20KB.

- [ ] **Step 2: Write the curated profile snapshot**

Create `~/Documents/github/thinkit/.routines/shared/profile.md` with this content:

```markdown
# Writer Profile — Kiran Kumar Ramanna

> Curated snapshot for the HN-daily routine scoring & writing prompts.
> Authoritative source: `kiranramanna/codex-research/persona/writers_style_and_profile.md`.
> Re-sync quarterly or whenever the writer's role/focus shifts.

## Professional identity

- **Title:** Senior Staff AI Engineer at ServiceNow (since Mar 2024)
- **Experience:** 14+ years in AI/ML and software engineering
- **Location:** San Francisco Bay Area
- **Education:** M.Tech Software Systems (BITS Pilani); B.E. Electronics & Communication (VTU)

## Primary technical focus (HIGH score signal — 8-10)

The writer ships, evaluates, and operates these in production daily. HN items
in these areas should score highest for publishing.

- **Agentic AI**: orchestration, tool use, routing, retries/fallbacks, multi-agent
  workflow systems
- **RAG**: context engineering, embeddings, rerankers, hybrid search, KG-enhanced
  retrieval, evaluation harnesses
- **Conversational AI**: virtual agents, intent/slot/entity recognition,
  dialog-act-aware UX, Python-backed NLU systems
- **LLM Ops**: evaluation harnesses, safety/PII guardrails, observability,
  governance, latency budgets, SLAs
- **Knowledge graphs**: KG-enhanced retrieval signals, schema design,
  entity linking for grounding LLMs

## Secondary technical focus (MID score signal — 5-7)

The writer has shipped these but doesn't go deep daily. HN items in these areas
score medium-high.

- **Platform engineering**: API design, microservices, data pipelines on
  AWS/Azure/GCP
- **System design**: scalability, reliability, monolith→microservices migration,
  versioned APIs, service boundaries
- **ServiceNow platform**: CSM/CRM, Agent Workspace, omni-channel integration
- **Languages/frameworks**: Java, JavaScript, Python; Spring, Spring MVC, Hibernate;
  Node.js; LangChain, LangGraph, LlamaIndex

## What the writer DOESN'T cover (LOW score — 1-3, filter out)

Even if these are hot HN topics, they're not the writer's lane. Score low.

- Crypto, web3, DeFi (unless the story is specifically about AI compute economics)
- Frontend frameworks (React, Vue, Svelte) — not the writer's lane
- Mobile app development (iOS, Android, Flutter, React Native)
- Programming language wars (Rust vs Go, Python vs JS)
- "How I work" / productivity tools (Notion, Obsidian, etc.)
- Gaming, esports
- Politics, geopolitics

## Personal interests (RARE on HN, score 3-4 if appears)

These rarely surface on HN. If a relevant item appears, score 3-4 — write
manually, not via the routine.

- Vedic astrology / Jyotishya
- Sanskrit
- Indian classical music

## Voice signature

- **First-person**, conversational but substantive
- **Leads with insight**, not summary — assumes reader knows the headline
- **Connects to production reality** at ServiceNow when relevant (don't force it)
- **Precise technical terms** — no dumbing down (RAG, agentic, eval harness,
  retrieval, reranker, etc. used as-is)
- **Avoids:**
  - LinkedIn hype: "game-changer", "revolutionary", "paradigm shift"
  - AI-isms: "dive deep", "unpack", "moreover", "in essence", "let's explore"
  - Corporate hedging: "it could be argued", "one might say", "arguably"
  - Filler: "in today's fast-paced world", "as we all know"
- **Emoji bullets**: OK and match existing thinkit style, but ≤ 6 per post
- **Endings**: thought-provoking question, prediction, or contrarian take —
  NOT a summary

## Past blog posts (style reference)

See existing `_posts/` for style:
- `2025-01-22-deepseek-r1-paper-review.md` — paper review style
- `2025-11-27-unlocking-eb1a-success-...md` — list-with-emoji style
```

- [ ] **Step 3: Verify file**

```bash
wc -l ~/Documents/github/thinkit/.routines/shared/profile.md
head -10 ~/Documents/github/thinkit/.routines/shared/profile.md
```

Expected: ~80-100 lines; header reads "# Writer Profile — Kiran Kumar Ramanna".

---

### Task A4: Build `shared/voice-rules.md`

**Files:**
- Create: `.routines/shared/voice-rules.md`

- [ ] **Step 1: Write the file**

Create `~/Documents/github/thinkit/.routines/shared/voice-rules.md`:

```markdown
# Voice Rules

> Hard constraints for writing posts in Kiran's voice. The writing prompt MUST
> honor every "Avoid" rule. Violations are bugs.

## DO

- Write in **first person**, conversational tone.
- **Lead with insight**, not summary. The reader can read the linked article;
  your job is to add the take.
- Use **precise technical terms** — RAG, agentic, eval harness, reranker, KG,
  hybrid search, retrieval-augmented, tool use, orchestration. Don't dumb down.
- **Connect to ServiceNow / production AI** when the connection is real and adds
  insight. Don't force it.
- Use **emoji bullets** (✅ 🎯 ⚠️ 💡 🔍 ⚡ 📊) when listing — matches existing
  thinkit aesthetic. Max 6 emoji bullets per post.
- **End** with one of: a question, a prediction, a contrarian take, an open
  problem. Never a summary or "in conclusion".
- Reference **`source_url`** AND **`hn_url`** in the post body naturally
  (not just in frontmatter).
- Target **200-400 words** of body content (post-frontmatter).

## AVOID

- ❌ **LinkedIn hype phrases**: "game-changer", "revolutionary", "paradigm shift",
  "transform the industry", "next-generation", "cutting-edge", "groundbreaking"
- ❌ **AI-isms**: "dive deep", "unpack", "moreover", "in essence", "let's explore",
  "navigate", "delve into", "in today's fast-paced world", "it's worth noting"
- ❌ **Corporate hedging**: "it could be argued", "one might say", "arguably",
  "perhaps", "potentially"
- ❌ **Padding**: "in today's [adjective] world", "as we all know", "needless to say",
  "it goes without saying"
- ❌ **Hashtag-style listicles**: "5 reasons why...", "10 ways to..."
- ❌ **Conclusions that summarize**: "in conclusion", "to wrap up", "the bottom line is"
- ❌ **Fake humility**: "I'm just a person who...", "this might sound obvious but"
- ❌ **Calling out the reader**: "you might be wondering", "as a developer, you know"

## Voice calibration anchors

If unsure how a sentence reads, compare against these existing thinkit excerpts:

> "Did you know reviewing conference papers could be your ticket to EB1A success?
> Let's demystify the process..."

That's the upper bound of friendliness — it works in context because the topic
is conversational. For technical AI takes, dial back the rhetorical questions:

> Production RAG systems hide a lot of latency in reranking. The reranker spec
> in <paper> reduces P99 by 40% by skipping low-confidence retrievals — useful
> only if your eval harness already measures the right thing.

That tone is the target for HN-curated posts.
```

- [ ] **Step 2: Verify file**

```bash
wc -l ~/Documents/github/thinkit/.routines/shared/voice-rules.md
```

Expected: ~60 lines.

---

### Task A5: Build `shared/post-template.md`

**Files:**
- Create: `.routines/shared/post-template.md`

- [ ] **Step 1: Write the file**

Create `~/Documents/github/thinkit/.routines/shared/post-template.md`:

````markdown
# Post Template

Every post generated by a routine MUST follow this exact frontmatter format. The
writing prompt produces output matching this template.

## Frontmatter (required)

```yaml
---
layout: post
title: "<Title — writer's voice, NOT the HN headline verbatim>"
date: <YYYY-MM-DD HH:MM:SS> +0000
categories: [<2-4 tags from the controlled vocabulary>]
hn_id: <integer HN item id>
hn_url: https://news.ycombinator.com/item?id=<id>
source_url: <linked URL, or null for Ask HN>
---
```

### Field rules

- `layout: post` — always. Don't change.
- `title:` — quoted. Re-phrase the HN headline in the writer's voice. Don't
  copy-paste the HN title verbatim. Don't use "Re:" or "On:" prefixes.
- `date:` — UTC with explicit `+0000` offset. Format: `2026-05-31 13:42:18 +0000`.
- `categories:` — YAML inline list. 2-4 tags from the controlled vocabulary:
  `agentic-ai`, `rag`, `llm-ops`, `enterprise-ai`, `conversational-ai`,
  `knowledge-graphs`, `ai-infrastructure`, `research`, `industry`.
- `hn_id:` — integer, no quotes.
- `hn_url:` — full URL.
- `source_url:` — full URL or the literal word `null` (no quotes) if the HN
  item has no linked URL (Ask HN posts).

## Body (required, after frontmatter)

- **200-400 words** of body content.
- **2-3 short paragraphs** OR **5-8 emoji bullets** — pick one format per post.
- **Voice:** see `voice-rules.md`.
- **Linking:** mention `source_url` and `hn_url` at least once each in the body,
  not just in frontmatter. Markdown link format: `[anchor text](url)`.
- **No trailing whitespace.** No trailing blank lines.

## Filename convention

When writing to `_posts/`:

```
_posts/YYYY-MM-DD-<slug>.md
```

Where `YYYY-MM-DD` matches the `date:` field's date portion (UTC), and `<slug>`
is the title lowercased with spaces → hyphens and special chars stripped.

Example:
- title: "Why Agentic AI Retries Are Expensive"
- date: 2026-05-31 13:42:18 +0000
- filename: `_posts/2026-05-31-why-agentic-ai-retries-are-expensive.md`

## Complete example

```markdown
---
layout: post
title: "When the Reranker Becomes the Bottleneck"
date: 2026-05-31 13:42:18 +0000
categories: [rag, llm-ops]
hn_id: 39842734
hn_url: https://news.ycombinator.com/item?id=39842734
source_url: https://example.com/reranker-blog
---

The [reranker spec from the example team](https://example.com/reranker-blog)
is sound, but the operational story is more interesting than the model story.

Production RAG systems hide a lot of latency in reranking — and most teams
don't realize that until the reranker becomes 60% of the P99 budget. The
naive fix is to cap candidate counts; the better fix is two-stage retrieval
with a cheap first pass.

- 🎯 **Cap candidates at the retriever**, not the reranker
- ⚡ **Two-stage rerank**: cheap MLP first, cross-encoder only for top-K
- 🔍 **Skip low-confidence retrievals** entirely — null result is fine
- 📊 **Measure end-to-end recall**, not reranker-only metrics

Worth a read if you're running >10 QPS hybrid search. The
[HN discussion](https://news.ycombinator.com/item?id=39842734) has good
production stories from teams that hit the same wall.

What's the longest a "fast" reranker has cost you in P99?
```
````

- [ ] **Step 2: Verify file**

```bash
head -20 ~/Documents/github/thinkit/.routines/shared/post-template.md
```

Expected: file starts with `# Post Template`; example renders cleanly.

---

### Task A6: Build `shared/policy.md`

**Files:**
- Create: `.routines/shared/policy.md`

- [ ] **Step 1: Write the file**

Create `~/Documents/github/thinkit/.routines/shared/policy.md`:

```markdown
# Content Policy

> Hard rules for any post produced by a routine. The writing prompt MUST enforce
> these; a post that violates any rule should be rejected and not committed.

## ABSOLUTE — never publish a post that:

1. **Names a real person other than Kiran Ramanna** by full name without prior
   public context (e.g., "according to the article by Jane Doe..." is OK if
   Jane Doe is the article's byline; inventing quotes attributed to her is not).
2. **Quotes content** from the linked article verbatim for more than ~20 words
   without quotation marks and attribution. Paraphrase or quote-and-cite.
3. **Makes specific medical, legal, financial, or immigration advice** in
   first-person voice. General observations OK; specific instructions to
   readers about their personal situations are not.
4. **Mentions a specific employer, customer, or internal ServiceNow project** by
   name. Generic references to "production AI work" or "enterprise CSM
   deployments" are fine. Specifics are not.
5. **Includes PII**: emails, phone numbers, addresses, government IDs.
6. **Uses profanity**, slurs, or politically inflammatory framing.
7. **Promotes** a product or company in a way that reads as paid promotion.
   Honest takes on products (positive or negative) are fine.

## SOFT — flag for human review (but the routine should still write):

- A post that takes a strong stance on a contentious tech-industry topic
  (e.g., specific founders, public layoffs, IP disputes). The routine writes it;
  you review before merging.

## Self-check the writing prompt must do

Before emitting a post, the writing prompt should:

- Confirm no full names of non-public figures.
- Confirm no verbatim quote > 20 words.
- Confirm no specific advice framed as instruction.
- Confirm no PII.
- If any check fails, the prompt returns `{"refuse": true, "reason": "..."}`
  instead of a post. The trigger logs this to state.json and proceeds to the
  next item.
```

- [ ] **Step 2: Verify file**

```bash
wc -l ~/Documents/github/thinkit/.routines/shared/policy.md
```

Expected: ~40 lines.

---

### Task A7: Commit Phase A (shared assets)

**Files:**
- Stage: `.routines/README.md`, `.routines/shared/*.md`

- [ ] **Step 1: Stage**

```bash
cd ~/Documents/github/thinkit
git add .routines/README.md .routines/shared/
git status
```

Expected: 5 new files staged.

- [ ] **Step 2: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(routines): add shared assets for routine framework

- .routines/README.md — top-level system overview
- .routines/shared/profile.md — writer profile snapshot
- .routines/shared/voice-rules.md — voice/tone do's and don'ts
- .routines/shared/post-template.md — Jekyll frontmatter skeleton
- .routines/shared/policy.md — global content policy

These are loaded by every routine. profile.md is a curated subset of
codex-research/persona/writers_style_and_profile.md, intentionally
shorter so it fits in LLM context on every call.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: `[feat/hn-daily-routine <sha>] feat(routines): add shared assets...` 5 files changed.

---

## Phase B — hn-daily routine files

### Task B1: Create `hn-daily/README.md`

**Files:**
- Create: `.routines/hn-daily/README.md`

- [ ] **Step 1: Write the file**

Create `~/Documents/github/thinkit/.routines/hn-daily/README.md`:

```markdown
# Routine: hn-daily

Twice-daily Hacker News curation that publishes 0-2 short-take blog posts per
run (max 4/day) to `_posts/`.

## Schedule

- Morning: 14:00 UTC (~06-07 PT)
- Evening: 03:00 UTC (~19-20 PT)

## Flow

1. **Fetch** top 30 HN stories from Firebase API.
2. **Dedup**: filter out HN IDs already in `state.json` (rolling 7 days).
3. **Score**: one LLM call rates all candidates against `../shared/profile.md`.
4. **Select**: top items with score ≥ threshold, capped per run.
5. **Write**: one LLM call per selected item, output is a complete Jekyll post.
6. **Save**: write post to `../../_posts/YYYY-MM-DD-<slug>.md`.
7. **Record**: append to `state.json`, prune old entries.
8. **Commit + push**: single commit per run, pushed to `origin master`.

## Files

- `trigger.md` — the orchestrator prompt the Claude trigger runs.
- `scoring-prompt.md` — sub-prompt for step 3.
- `writing-prompt.md` — sub-prompt for step 5.
- `config.yml` — tunables (threshold, cap, models, fetch_limit).
- `state.json` — run log + 7-day dedup window of published HN IDs.

## Tuning

Most adjustments are in `config.yml`. To change voice, edit `../shared/voice-rules.md`.

| What | Where |
|---|---|
| Match threshold (1-10) | `config.yml` → `threshold` |
| Posts per run cap | `config.yml` → `posts_per_run` |
| HN fetch size | `config.yml` → `fetch_limit` |
| Minimum HN score gate | `config.yml` → `min_hn_score` |
| Dedup window (days) | `config.yml` → `dedup_window_days` |
| LLM models | `config.yml` → `scoring_model`, `writing_model` |
| Voice / tone | `../shared/voice-rules.md` |
| Profile / topics | `../shared/profile.md` |
| Categories taxonomy | `../shared/post-template.md` |

## Monitoring

```bash
git log --oneline --grep="^hn-daily:" --since="14 days ago"
```

Expect ~28 commits over 14 days (2/day). Gaps mean the trigger isn't firing or
is silently failing.
```

- [ ] **Step 2: Verify**

```bash
ls -la ~/Documents/github/thinkit/.routines/hn-daily/
```

Expected: directory exists, contains `README.md`.

---

### Task B2: Create `hn-daily/config.yml`

**Files:**
- Create: `.routines/hn-daily/config.yml`

- [ ] **Step 1: Write the file**

Create `~/Documents/github/thinkit/.routines/hn-daily/config.yml`:

```yaml
# hn-daily routine configuration
# Spec: ../specs/2026-05-31-thinkit-publishing-routines-design.md § 4.9

# --- HN fetching ---
# How many top HN stories to fetch and score per run
fetch_limit: 30

# Minimum raw HN score (upvotes) for an item to be considered
# (filters out HN noise before LLM scoring)
min_hn_score: 30

# --- Selection ---
# Minimum LLM score (1-10) for an item to be eligible for publishing
threshold: 7

# Max posts to publish in a single run (cap)
posts_per_run: 2

# Max posts to publish per day across all runs (soft global cap; advisory)
posts_per_day: 4

# Rolling dedup window — don't republish an HN ID within this many days
dedup_window_days: 7

# --- Output formatting ---
# Timezone for post `date:` frontmatter. Always UTC to avoid past JST bugs.
date_timezone: "+0000"

# --- LLM models ---
# Cheaper model for scoring (30 items in one call)
scoring_model: "claude-haiku-4-5"

# Better-voice model for writing (per-item)
writing_model: "claude-sonnet-4-6"

# --- Behavior ---
# If true, commit even when 0 posts published (preserves audit trail)
commit_on_zero_posts: true

# If true, abort the run on the first per-item writing error
# If false, skip the bad item and continue
abort_on_writing_error: false
```

- [ ] **Step 2: Verify YAML parses**

```bash
cd ~/Documents/github/thinkit
python3 -c "import yaml; print(yaml.safe_load(open('.routines/hn-daily/config.yml')))"
```

Expected: prints a Python dict with all keys; no `yaml.YAMLError`.

---

### Task B3: Create initial `hn-daily/state.json`

**Files:**
- Create: `.routines/hn-daily/state.json`

- [ ] **Step 1: Write the file**

Create `~/Documents/github/thinkit/.routines/hn-daily/state.json`:

```json
{
  "schema_version": 1,
  "last_pruned_ts": null,
  "runs": [],
  "published_ids": {}
}
```

- [ ] **Step 2: Verify JSON parses**

```bash
python3 -c "import json; print(json.load(open('/Users/kiranramanna/Documents/github/thinkit/.routines/hn-daily/state.json')))"
```

Expected: prints `{'schema_version': 1, 'last_pruned_ts': None, 'runs': [], 'published_ids': {}}`.

---

### Task B4: Write `hn-daily/scoring-prompt.md`

**Files:**
- Create: `.routines/hn-daily/scoring-prompt.md`

- [ ] **Step 1: Write the file**

Create `~/Documents/github/thinkit/.routines/hn-daily/scoring-prompt.md`:

````markdown
# Scoring Sub-Prompt

You are scoring Hacker News top stories against a writer's profile to decide
which (if any) deserve a short blog post.

## Inputs you will receive

1. The writer's profile (from `shared/profile.md`).
2. A JSON list of up to 30 HN candidates, each with: `id`, `title`, `url`,
   `score`, `descendants`, optional `text` (for Ask HN posts).

## Your output (STRICT)

Output ONLY valid JSON matching this schema. No markdown, no preamble, no commentary.

```json
[
  {
    "id": <hn item id, integer>,
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
  Conversational AI, or Knowledge Graphs. The writer ships this in production.
  Examples: a new retrieval reranker paper, a production agent framework's
  postmortem, an eval harness for tool use.

- **7-8 — strong adjacency.**
  Production AI engineering, enterprise AI deployment, platform architecture,
  governance/observability, multi-agent systems. Or a primary-expertise topic
  with thinner technical content.

- **5-6 — tangential.**
  Touches AI/ML or systems engineering but not in the writer's lane. Or a
  primary-expertise topic that's pure marketing/hype with no substance.

- **3-4 — off-topic for professional voice.**
  Sanskrit/Vedic astrology tooling (rare on HN, score here if appears).
  Personal-interest topics — the writer might want to write manually, not via
  the routine.

- **1-2 — off-topic and uninteresting.**
  Crypto, mobile dev, frontend frameworks, programming language wars,
  productivity tools, gaming, politics. Filter these out hard.

## Hard rules

- **Crypto-only stories**: score ≤ 2 unless explicitly about AI compute economics.
- **"Show HN" project announcements**: score the project on its merits;
  don't bias just because it's a launch.
- **Ask HN posts**: judge the question's substance; a thoughtful Ask HN about
  RAG eval can score 8.
- **Job postings / "We're hiring"**: score 1.
- **Repeat coverage** (same topic that's been on HN multiple days): not your
  job to detect dedup; just score on merits. The orchestrator handles dedup.

## Reasoning style

Keep `reason` to one sentence, ~10-20 words. Examples:

- "Direct match: production RAG eval methodology, writer has shipped this at ServiceNow."
- "Adjacent: enterprise AI compliance — useful context but not deep technical content."
- "Off-topic: crypto announcement with no AI angle."

## Calibration

If you find yourself scoring most items 6-8, re-read the rubric. A typical run
should produce a wide distribution: maybe 1-3 items at 8+, several at 5-7,
many at 1-4. Be selective at the top.
````

- [ ] **Step 2: Verify file**

```bash
wc -l ~/Documents/github/thinkit/.routines/hn-daily/scoring-prompt.md
```

Expected: ~60-80 lines.

---

### Task B5: Write `hn-daily/writing-prompt.md`

**Files:**
- Create: `.routines/hn-daily/writing-prompt.md`

- [ ] **Step 1: Write the file**

Create `~/Documents/github/thinkit/.routines/hn-daily/writing-prompt.md`:

````markdown
# Writing Sub-Prompt

You are writing a short blog post in Kiran Ramanna's voice based on a single
Hacker News item.

## Inputs you will receive

1. The writer's profile (from `shared/profile.md`).
2. Voice rules (from `shared/voice-rules.md`).
3. Post template format (from `shared/post-template.md`).
4. Content policy (from `shared/policy.md`).
5. A single HN item: `id`, `title`, `url`, `score`, `descendants`, optional `excerpt`
   (first ~2000 chars of the linked article if fetched), `hn_url`.

## Your output (STRICT)

Output ONLY the full Jekyll post: frontmatter, blank line, body. No preamble.
No "Here's the post:". No closing remarks.

The output MUST be directly writable to a `_posts/*.md` file as-is.

## Frontmatter requirements

Match `shared/post-template.md` exactly:

```yaml
---
layout: post
title: "<your title — re-phrased in writer's voice, NOT the HN headline>"
date: <UTC datetime>  # provided by the orchestrator; you receive it in input
categories: [<2-4 tags from controlled vocabulary>]
hn_id: <id>
hn_url: <hn_url>
source_url: <url or null>
---
```

**Controlled categories vocabulary:**
`agentic-ai`, `rag`, `llm-ops`, `enterprise-ai`, `conversational-ai`,
`knowledge-graphs`, `ai-infrastructure`, `research`, `industry`.

Pick 2-4 that fit. Don't invent new tags.

## Body requirements

- **200-400 words** of post-frontmatter content.
- **Format**: pick ONE — 2-3 short paragraphs OR 5-8 emoji bullets.
  Don't mix both in the same post.
- **Lead with insight**, not summary.
- **Reference** `source_url` AND `hn_url` at least once each in the body, as
  markdown links.
- **End** with a question, prediction, or contrarian take. Not a summary.

## Voice — apply `shared/voice-rules.md` strictly

Do every "DO" rule. Do not commit a single "AVOID" violation. If you find
yourself writing "dive deep" or "game-changer" or "in today's fast-paced world",
delete and rewrite.

## Policy — apply `shared/policy.md` strictly

If any ABSOLUTE rule would be violated by writing this post, return ONLY this
JSON instead of a post:

```json
{"refuse": true, "reason": "<which rule and why>"}
```

The orchestrator will log the refusal and skip the item.

## Title rules

- Re-phrase, don't copy. "Hacker News: New RAG Paper" → "When Retrieval Stops
  Being the Bottleneck".
- Punctuation: title case is fine; no trailing period; quotes inside title use
  single quotes (because the YAML title is double-quoted).
- Length: 40-70 chars.

## Slug derivation

The orchestrator generates the filename from your title. Make sure the title is
unique enough to not collide with same-day posts. If the orchestrator detects a
collision (same slug already in `_posts/YYYY-MM-DD-*.md`), it will append `-2`,
`-3`, etc.

## Quality bar

Reread your output before emitting. Ask:

- Would Kiran be embarrassed to see this on his blog tomorrow? If yes, rewrite.
- Does any sentence sound like generic AI content? If yes, rewrite that sentence.
- Did I cite both source_url and hn_url? If not, add them.
- Is the ending a question or strong take, not a summary?
````

- [ ] **Step 2: Verify file**

```bash
wc -l ~/Documents/github/thinkit/.routines/hn-daily/writing-prompt.md
```

Expected: ~80-100 lines.

---

### Task B6: Write `hn-daily/trigger.md` (the orchestrator)

**Files:**
- Create: `.routines/hn-daily/trigger.md`

This is the prompt that the Claude remote trigger executes on each scheduled fire. It's a hybrid of instructions to Claude and bash commands Claude runs.

- [ ] **Step 1: Write the file**

Create `~/Documents/github/thinkit/.routines/hn-daily/trigger.md`:

````markdown
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
````

- [ ] **Step 2: Verify file**

```bash
wc -l ~/Documents/github/thinkit/.routines/hn-daily/trigger.md
```

Expected: ~280-330 lines.

---

### Task B7: Commit Phase B

**Files:**
- Stage: `.routines/hn-daily/*`

- [ ] **Step 1: Stage**

```bash
cd ~/Documents/github/thinkit
git add .routines/hn-daily/
git status
```

Expected: 6 new files staged.

- [ ] **Step 2: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(routines): add hn-daily routine — orchestrator + sub-prompts

Adds the first concrete routine under .routines/hn-daily/:

- README.md       — routine docs
- config.yml      — tunables (threshold 7, cap 2/run, models)
- state.json      — initial empty state
- scoring-prompt.md — scoring rubric & strict JSON output
- writing-prompt.md — voice-rule-bound writing instructions
- trigger.md      — full orchestrator prompt (clone → fetch → score
                    → write → state → commit → push)

The trigger is designed to run in Claude Code's remote-trigger sandbox.
It clones thinkit, loads the shared/* assets + this routine's prompts/
config/state, fetches top 30 HN stories, scores against profile, writes
0-2 posts in the writer's voice, updates state, and pushes one commit
to origin master.

State (published HN IDs, run log) is committed back to the repo, so
git history serves as the audit log. No external database needed.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: 6 files changed.

---

## Phase C — Local validation (dry-run)

Before scheduling production triggers, run the routine manually from your local
terminal to verify outputs are reasonable.

### Task C1: Manual HN fetch — capture fixture data

**Files:**
- Create (gitignored): `/tmp/hn-fixture.json`

- [ ] **Step 1: Fetch and save**

```bash
mkdir -p /tmp
curl -s https://hacker-news.firebaseio.com/v0/topstories.json | jq '.[0:30]' > /tmp/top_ids.json
echo "[]" > /tmp/hn-fixture.json
for id in $(jq -r '.[]' /tmp/top_ids.json); do
  story=$(curl -s "https://hacker-news.firebaseio.com/v0/item/${id}.json")
  jq --argjson s "$story" '. += [$s]' /tmp/hn-fixture.json > /tmp/hn-fixture.tmp \
    && mv /tmp/hn-fixture.tmp /tmp/hn-fixture.json
  sleep 0.1
done
echo "Fixture stories: $(jq 'length' /tmp/hn-fixture.json)"
```

Expected: `Fixture stories: 30` (or close to it; some stories may be polls/jobs and skipped).

- [ ] **Step 2: Spot-check fixture**

```bash
jq '.[0:3] | .[] | {id, title, url, score}' /tmp/hn-fixture.json
```

Expected: 3 items with sensible titles + URLs.

---

### Task C2: Manually run scoring prompt against fixture

**Files:**
- Use: `.routines/hn-daily/scoring-prompt.md`, `.routines/shared/profile.md`
- Create (gitignored): `/tmp/scores-test.json`

- [ ] **Step 1: Build scoring input**

```bash
cd ~/Documents/github/thinkit
PROFILE=$(cat .routines/shared/profile.md)
SCORING_PROMPT=$(cat .routines/hn-daily/scoring-prompt.md)
SCORING_INPUT=$(jq -n \
  --arg profile "$PROFILE" \
  --argjson candidates "$(jq '[.[] | {id, title, url, score, descendants, text}]' /tmp/hn-fixture.json)" \
  '{profile: $profile, candidates: $candidates}')
echo "$SCORING_INPUT" > /tmp/scoring-input.json
echo "Input size: $(wc -c < /tmp/scoring-input.json) bytes"
```

Expected: `Input size: ~30000-50000 bytes` (depending on HN story text lengths).

- [ ] **Step 2: Call Claude (Haiku) with the scoring prompt**

Using `claude` CLI or `anthropic` Python SDK. Easiest path with `claude` CLI:

```bash
cat .routines/hn-daily/scoring-prompt.md > /tmp/sys.txt
echo "---" >> /tmp/sys.txt
cat /tmp/scoring-input.json >> /tmp/sys.txt

claude --print --model claude-haiku-4-5 --max-turns 1 \
  "Read /tmp/sys.txt. The first part (before '---') is your system prompt with the scoring rubric. The second part is the user input. Score every candidate per the rubric and output ONLY the JSON array. No markdown." \
  > /tmp/scores-test.json

cat /tmp/scores-test.json | jq '.' > /dev/null && echo "Valid JSON" || echo "INVALID JSON"
```

If invalid JSON, inspect output: `cat /tmp/scores-test.json | head`. Refine the prompt and retry. Once valid:

- [ ] **Step 3: Inspect score distribution**

```bash
jq 'group_by(.score) | map({score: .[0].score, count: length})' /tmp/scores-test.json
```

Expected: a spread, not all 5s or all 8s. Sample expectation:
```json
[
  {"score": 1, "count": 5},
  {"score": 2, "count": 4},
  {"score": 4, "count": 3},
  {"score": 5, "count": 6},
  {"score": 6, "count": 5},
  {"score": 7, "count": 4},
  {"score": 8, "count": 3}
]
```

- [ ] **Step 4: Read the top 3 items + their reasons**

```bash
jq 'sort_by(-.score) | .[0:3] | .[] | {id, score, reason}' /tmp/scores-test.json
```

Sanity check: do the top 3 actually match Kiran's profile? If not, refine
`scoring-prompt.md` or `profile.md`, re-run from step 2.

---

### Task C3: Manually run writing prompt on top scored item

**Files:**
- Use: `.routines/hn-daily/writing-prompt.md`, `.routines/shared/*`
- Create (gitignored): `/tmp/test-post.md`

- [ ] **Step 1: Pick top item**

```bash
TOP_ID=$(jq -r 'sort_by(-.score) | .[0].id' /tmp/scores-test.json)
TOP_ITEM=$(jq --argjson id "$TOP_ID" '.[] | select(.id == $id)' /tmp/hn-fixture.json)
echo "Top item:"
echo "$TOP_ITEM" | jq .
```

- [ ] **Step 2: Build writing input**

```bash
PROFILE=$(cat .routines/shared/profile.md)
VOICE=$(cat .routines/shared/voice-rules.md)
TEMPLATE=$(cat .routines/shared/post-template.md)
POLICY=$(cat .routines/shared/policy.md)
WRITING_PROMPT=$(cat .routines/hn-daily/writing-prompt.md)

TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

WRITING_INPUT=$(jq -n \
  --arg profile "$PROFILE" --arg voice "$VOICE" \
  --arg template "$TEMPLATE" --arg policy "$POLICY" \
  --argjson item "$TOP_ITEM" --arg ts "$TS" \
  '{profile: $profile, voice_rules: $voice, post_template: $template,
    policy: $policy, item: $item, excerpt: "", run_ts: $ts}')

echo "$WRITING_INPUT" > /tmp/writing-input.json
```

- [ ] **Step 3: Call Claude (Sonnet) with the writing prompt**

```bash
cat .routines/hn-daily/writing-prompt.md > /tmp/wsys.txt
echo "---" >> /tmp/wsys.txt
cat /tmp/writing-input.json >> /tmp/wsys.txt

claude --print --model claude-sonnet-4-6 --max-turns 1 \
  "Read /tmp/wsys.txt. The first part (before '---') is your system prompt — voice rules, format, policy. The second part is the user input — one HN item to write about. Output ONLY the full Jekyll post (frontmatter + body). No preamble, no commentary." \
  > /tmp/test-post.md

cat /tmp/test-post.md
```

- [ ] **Step 4: Validate the output**

Check:
- [ ] Output starts with `---` (frontmatter delimiter).
- [ ] Frontmatter has all required fields: `layout`, `title`, `date`, `categories`, `hn_id`, `hn_url`, `source_url`.
- [ ] Body is 200-400 words.
- [ ] Body references `hn_url` and `source_url` (if not null) as markdown links.
- [ ] No AVOID phrases from `voice-rules.md` (search for "dive deep", "game-changer", etc.).
- [ ] Ends with question/prediction/take, not summary.

```bash
# Quick AVOID-phrase check
grep -iE "dive deep|game.changer|paradigm shift|in today's fast.paced|moreover|in essence|let's (dive|explore|unpack)" /tmp/test-post.md && echo "FAIL: avoid-phrase found" || echo "PASS: no avoid phrases"
```

- [ ] **Step 5: Iterate if needed**

If output is off-voice, edit `voice-rules.md` and/or `writing-prompt.md` and re-run step 3.

Don't commit `/tmp/test-post.md` — it's a fixture for calibration only.

---

### Task C4: Document calibration findings

**Files:**
- Modify (optional): `.routines/shared/voice-rules.md`, `.routines/hn-daily/scoring-prompt.md`, `.routines/hn-daily/writing-prompt.md`

- [ ] **Step 1: If you made changes during C2 or C3, commit them**

```bash
cd ~/Documents/github/thinkit
git status
```

If `.routines/` files are modified:

```bash
git add .routines/
git commit -m "$(cat <<'EOF'
calibrate: refine prompts based on local dry-run

Adjustments after running scoring + writing prompts against today's
HN top 30 fixture:
- <list what you changed>

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 2: Note any open issues**

If anything still feels off (voice slightly forced, scoring slightly biased
toward LLM benchmark posts, etc.), add a TODO to `.routines/hn-daily/README.md`
under a `## Known calibration notes` section.

---

## Phase D — Production deployment

### Task D1: Push branch to GitHub

**Files:** none (git operation)

> **Auth caveat:** same as Effort 1 — push to `kiranramanna/thinkit` requires
> `kiranramanna` GH auth. Resolve before this step.

- [ ] **Step 1: Push the branch**

```bash
cd ~/Documents/github/thinkit
git push -u origin feat/hn-daily-routine
```

- [ ] **Step 2: Open PR (or merge to master)**

```bash
gh pr create --base master --head feat/hn-daily-routine \
  --title "Add hn-daily routine — automated HN curation" \
  --body "$(cat <<'EOF'
Implements Effort 2 of the publishing-routines spec.

## What this PR adds

- `.routines/` directory structure for all future automation
- `.routines/shared/` — profile, voice rules, post template, content policy
- `.routines/hn-daily/` — first routine: HN-curated twice-daily posts

## How it runs

After this PR merges, two Claude Code remote triggers will be created
(14:00 UTC + 03:00 UTC) that execute `.routines/hn-daily/trigger.md`
on schedule. Each run can publish 0-2 short-take posts to `_posts/`,
max 4/day. All state lives in `.routines/hn-daily/state.json`.

See `.routines/specs/2026-05-31-thinkit-publishing-routines-design.md`
for the full design and `.routines/plans/2026-05-31-thinkit-hn-daily-routine.md`
for the implementation plan.

## Manual validation done

- [x] Scoring prompt run against today's top 30 HN — distribution looks sane
- [x] Writing prompt run on top-scored item — voice matches existing posts
- [x] No AVOID-phrase regressions

## Next

After merge:
1. Create Claude RemoteTrigger configs (Task D2-D3)
2. Watch first 7 days of scheduled runs

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Or merge directly if no review process:

```bash
git checkout master
git merge --no-ff feat/hn-daily-routine
git push origin master
```

---

### Task D2: Create morning Claude RemoteTrigger

**Files:** none (claude.ai configuration via `RemoteTrigger` tool)

- [ ] **Step 1: Compose the trigger prompt**

The trigger fires a fresh Claude Code session with this prompt. The prompt
delegates to `.routines/hn-daily/trigger.md` after cloning:

Prompt to use:

```
You are a scheduled task for the thinkit hn-daily routine.

1. Clone kiranramanna/thinkit to /tmp/thinkit-run via `gh repo clone`.
2. cd /tmp/thinkit-run.
3. Read .routines/hn-daily/trigger.md and follow it step-by-step exactly.
4. When done, exit. Do not leave any uncommitted state.

If anything fails, append an error entry to .routines/hn-daily/state.json,
commit, and push — never exit silently.
```

- [ ] **Step 2: Create the trigger**

Use the `RemoteTrigger` tool (or Claude Code's `/schedule` skill) to create:

```
action: create
body:
  name: thinkit-hn-daily-morning
  cron: "0 14 * * *"          # 14:00 UTC daily
  timezone: UTC
  prompt: <the prompt from Step 1>
  enabled: true
```

- [ ] **Step 3: Verify it appears in the list**

```
RemoteTrigger action: list
```

Expected: shows `thinkit-hn-daily-morning` with cron `0 14 * * *`.

---

### Task D3: Create evening Claude RemoteTrigger

**Files:** none

- [ ] **Step 1: Create the evening trigger**

```
RemoteTrigger action: create
body:
  name: thinkit-hn-daily-evening
  cron: "0 3 * * *"           # 03:00 UTC daily
  timezone: UTC
  prompt: <same prompt as D2>
  enabled: true
```

- [ ] **Step 2: Verify**

```
RemoteTrigger action: list
```

Expected: both `thinkit-hn-daily-morning` and `thinkit-hn-daily-evening` shown.

---

### Task D4: Force-run the trigger once (smoke test)

**Files:** none

- [ ] **Step 1: Manually trigger the morning routine**

```
RemoteTrigger action: run
trigger_id: <id of thinkit-hn-daily-morning>
```

Wait for the run to complete (~3-5 minutes).

- [ ] **Step 2: Check the result**

```bash
cd ~/Documents/github/thinkit
git fetch origin
git log origin/master --oneline -5
```

Expected: a new commit with message `hn-daily: <N> post(s) — <today's date> manual` or similar.

```bash
git pull origin master
ls _posts/ | tail -3
cat .routines/hn-daily/state.json | jq '.runs[-1]'
```

Expected:
- 0-2 new files in `_posts/` from today.
- Last entry in `state.json` `runs` shows the run metadata.

- [ ] **Step 3: Read the new post(s)**

If posts were created:

```bash
for f in $(ls -t _posts/*.md | head -2); do
  echo "===== $f ====="
  cat "$f"
  echo ""
done
```

Verify:
- Frontmatter format correct.
- Body in your voice.
- No AVOID-phrase violations.
- Links to source_url and hn_url present.

If output looks off, this is your last chance before scheduled runs start hitting daily. Iterate on prompts and re-test.

---

## Phase E — Production monitoring (first 7 days)

### Task E1: Day 1 — verify first scheduled run

**Files:** none (observation)

- [ ] **Step 1: After the next scheduled fire (14:00 or 03:00 UTC), check**

```bash
cd ~/Documents/github/thinkit
git pull origin master
git log --oneline --since="1 day ago" | grep "^[a-f0-9]\{7\} hn-daily:"
```

Expected: at least one commit matching `hn-daily: ...`.

- [ ] **Step 2: Read any new posts**

```bash
ls -lt _posts/ | head -5
```

Open any new `.md` files, read them critically. If anything's off:

1. Delete the bad post: `git rm _posts/<bad-post>.md && git commit -m "revert: bad post — <reason>"`
2. Note the issue in `.routines/hn-daily/README.md` under `## Known calibration notes`.
3. Tune `voice-rules.md` or `writing-prompt.md` accordingly.

---

### Task E2: Day 3 — first calibration check

**Files:** Modify (potentially) `.routines/shared/voice-rules.md`, `.routines/hn-daily/scoring-prompt.md`

- [ ] **Step 1: Review all posts from days 1-3**

```bash
git log --oneline --since="3 days ago" --grep="^hn-daily:"
```

- [ ] **Step 2: Read each post in order, scoring them subjectively**

| Post | Voice? | On-brand topic? | Would you delete it? |
|---|---|---|---|

If 3+ posts feel off in any column, tune prompts. Common adjustments:

- **Voice off**: edit `voice-rules.md` AVOID list with the specific phrases you noticed.
- **Topic off-brand**: tighten `scoring-prompt.md` rubric, raise `threshold` from 7 → 8.
- **Too many posts/day**: lower `posts_per_run` from 2 → 1.
- **Too few posts/day**: lower `threshold` from 7 → 6.

Commit any tuning changes:

```bash
git add .routines/
git commit -m "calibrate: <what and why>"
git push origin master
```

---

### Task E3: Day 7 — go/no-go decision

**Files:** none (review)

- [ ] **Step 1: Count successful runs**

```bash
cd ~/Documents/github/thinkit
git log --oneline --since="7 days ago" --grep="^hn-daily:" | wc -l
```

Expected: 14 commits (2/day × 7).

- [ ] **Step 2: Count error commits**

```bash
git log --oneline --since="7 days ago" --grep="^hn-daily:.*error" | wc -l
```

Expected: ≤ 2 (occasional HN API blips are fine).

- [ ] **Step 3: Count posts published**

```bash
ls _posts/ | grep "$(date +%Y-%m)" | wc -l
```

Plus posts from the prior 6 days of the month.

- [ ] **Step 4: Make the call**

If:
- ≥ 6/7 days had at least one successful run
- 0 posts deleted for hallucination
- Voice feels consistent across posts

→ Routine is **live**. Move to monitoring-only mode (read posts in the morning over coffee).

If:
- < 5/7 days successful
- 2+ posts deleted
- Voice feels off

→ Disable triggers (`RemoteTrigger action: update` with `enabled: false`), debug, re-enable after fixes.

---

## Self-Review Checklist

After all tasks complete:

- [ ] All 5 shared files (`.routines/README.md`, `.routines/shared/*.md`) exist and match templates above.
- [ ] All 6 hn-daily files (`README.md`, `config.yml`, `state.json`, `scoring-prompt.md`, `writing-prompt.md`, `trigger.md`) exist.
- [ ] `config.yml` parses as valid YAML (`python3 -c "import yaml; yaml.safe_load(open(...))"`).
- [ ] `state.json` parses as valid JSON.
- [ ] Both RemoteTriggers visible in `RemoteTrigger action: list`.
- [ ] First scheduled run produced a commit on master.
- [ ] At least 6/7 days in week 1 had a successful run.
- [ ] 0 posts retracted for hallucination or off-brand voice.

---

## Rollback / Disable

To disable the routine without removing it:

```
RemoteTrigger action: update
trigger_id: <id>
body: {enabled: false}
```

(Run for both triggers.) Posts stop appearing. To re-enable, set `enabled: true`.

To remove the routine entirely:

```bash
RemoteTrigger action: delete  # for each trigger
cd ~/Documents/github/thinkit
git rm -r .routines/hn-daily/
git commit -m "remove: hn-daily routine"
git push origin master
```

Shared assets stay for future routines.
