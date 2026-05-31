# Thinkit Publishing Routines — Design Spec

**Date:** 2026-05-31
**Status:** Draft — pending user approval
**Author:** Kiran Ramanna (via Claude Code brainstorming session)
**Target repo:** `kiranramanna/thinkit`

---

## 1. Overview

This spec covers three sequenced efforts that together transform `kiranramanna/thinkit` from a sporadically-updated Jekyll blog into an automated, profile-curated daily publishing pipeline.

| # | Effort | Why now | Effort size |
|---|---|---|---|
| 1 | Enable theme light/dark auto-switching | Single-line config change; reduces friction for visitors with light-mode preferences | < 30 min |
| 2 | HN-daily curation routine | Automate the gap between "I have a profile/voice" and "I publish consistently" | 1-2 days |
| 3 | Historical backfill (Mar–Oct 2025) | Establish a consistent publishing history once the routine produces reliable output | After routine stabilizes |

The three efforts are intentionally separated. Each has its own goals, exit criteria, and rollback path. The HN-daily routine is the centerpiece; the theme fix is opportunistic; the backfill is deferred until the routine earns trust.

---

## 2. Sequencing & dependencies

```
Effort 1 (theme)   ──→  ship independently, no dependencies
                          │
Effort 2 (routine) ──→ depends on: nothing
                          │
Effort 3 (backfill) ──→ depends on: Effort 2 working reliably for 10+ days
```

**Why this order:**

1. The theme fix is independent and low risk. Shipping it first builds confidence that we can touch the repo without breaking the published site.
2. The routine is the load-bearing piece. All future automation reuses its patterns (`.routines/` structure, state.json conventions, trigger prompt style).
3. Backfill becomes trivial once the routine works — it's the same routine running against HN's historical Algolia search instead of the live `topstories.json`. Doing it before the routine works means writing throwaway backfill code.

---

## 3. Effort 1 — Enable theme light/dark

### Goal

Make `kiranramanna.github.io/thinkit/` respect the visitor's OS color-scheme preference (light vs. dark). Today the site is always rendered in `hacker` style; visitors on light-mode macOS or iOS see a high-contrast terminal aesthetic that's hard to read in bright environments.

### Scope

**In scope:**
- Enable the existing `listen_for_clients_preferred_style` config flag.
- Verify all three themes (`_light.scss`, `_dark.scss`, `_hacker.scss`) render correctly.
- Pick a sensible default for visitors whose OS doesn't expose a preference.

**Out of scope:**
- Adding a manual user-facing toggle button on the page.
- Customizing the colors of any of the three themes.
- Building a new theme.

### Change details

The Jekyll theme (forked from `b2a3e8/jekyll-theme-console`) already includes the toggle logic in `_includes/head.html`:

```liquid
{%- if site.listen_for_clients_preferred_style -%}
  ... emits CSS that uses @media (prefers-color-scheme: ...) ...
{%- endif -%}
```

In `_config.yml`, uncomment one line:

```yaml
# before
#listen_for_clients_preferred_style: true # true or false (default)

# after
listen_for_clients_preferred_style: true
```

**Decision on `style:` field:** Once `listen_for_clients_preferred_style` is true, the `style: hacker` setting becomes the fallback for browsers that don't expose `prefers-color-scheme`. Keep it as `hacker` — it's distinctive and matches your existing brand voice. Visitors on light-mode get `_light.scss` automatically; dark-mode gets `_dark.scss`; no-preference gets `_hacker.scss`.

### Verification

1. Run `bundle exec jekyll serve` locally.
2. Open the site in Chrome DevTools → toggle "Emulate CSS prefers-color-scheme: light" → page should re-render in light theme.
3. Toggle to "dark" → page should re-render in dark theme.
4. Set to "no-preference" → page should render in hacker theme.
5. Commit the config change and push to master.
6. Wait for GitHub Pages to rebuild (~1 min).
7. Open `https://kiranramanna.github.io/thinkit/` from a macOS Safari with system in light mode → confirm light theme renders.

### Exit criteria

- [ ] `_config.yml` updated and committed.
- [ ] Local `jekyll serve` confirms all three theme paths work.
- [ ] Live site at `kiranramanna.github.io/thinkit/` reflects OS preference on at least one device.
- [ ] No regression on existing posts (verified by visual spot-check of 2-3 random posts in each theme).

### Rollback

Single-line revert in `_config.yml`. If any post renders broken in light or dark theme, comment the line back out and ship a follow-up fix on a branch.

---

## 4. Effort 2 — HN-daily curation routine

### 4.1 Goal & success criteria

**Goal:** Automate a daily routine that scans Hacker News top stories, scores each against the writer's professional profile, and publishes 0-2 short blog posts per run (max 4/day across two runs) to `kiranramanna/thinkit/_posts/` in the writer's voice — without any local-machine dependency.

**Success criteria (measured over a rolling 30-day window after launch):**
- ≥ 90% of scheduled runs complete successfully (commit pushed to thinkit).
- ≥ 70% of runs produce 0 posts when no HN items pass the profile-match threshold (i.e., the routine is appropriately selective, not just publishing to hit a quota).
- 0 posts retracted for hallucinated facts, off-brand voice, or duplicate content.
- 0 runs require manual intervention to recover from a failure mode.

### 4.2 Constraints baked into design

These are decisions the user already confirmed during brainstorming:

| Decision | Value |
|---|---|
| Content type | Short-take posts, 200-400 words per post |
| Selection mode | Score-and-rank with threshold; cap = 2/run, max 4/day total |
| Profile match threshold | Score ≥ 7 / 10 (configurable in `config.yml`) |
| Schedule | Twice daily — morning (~06:00 PT) + evening (~20:00 PT) |
| Publishing mode | Fully automatic; no manual review gate |
| Profile source | Snapshot in `.routines/shared/profile.md` (NOT pulled from codex-research) |
| State storage | In-repo `state.json`; 7-day rolling dedup |
| Push remote | `origin` only (never `upstream`) |
| Date format | UTC, ISO 8601 with explicit `+0000` offset |
| LLM auth | Existing Claude Code OAuth token (already in trigger sandbox) |

### 4.3 Architecture

```
                      ┌──────────────────────────────────┐
                      │  Claude Code Remote Trigger      │
                      │  Two scheduled runs per day:     │
                      │    14:00 UTC  (~06-07 PT morning)│
                      │    03:00 UTC  (~19-20 PT evening)│
                      └──────────────┬───────────────────┘
                                     │ runs trigger.md prompt
                                     ▼
                ┌───────────────────────────────────────┐
                │  Ephemeral trigger sandbox            │
                │  - user's GitHub OAuth token          │
                │  - bash, git, gh CLI, jq, curl        │
                │  - claude_agent_sdk in scope          │
                └───┬────────────┬──────────────┬───────┘
                    │            │              │
        ┌───────────▼──┐  ┌──────▼──────┐  ┌────▼────────────────────┐
        │ HN Firebase  │  │ Anthropic   │  │ kiranramanna/thinkit    │
        │ API          │  │ (via SDK)   │  │  ├─ _posts/             │
        │ (no auth)    │  │             │  │  └─ .routines/          │
        └──────────────┘  └─────────────┘  │      ├─ shared/         │
                                           │      ├─ lib/            │
                                           │      └─ hn-daily/       │
                                           └─────────────────────────┘
```

**Two actors only:**
1. **The trigger** (runs on Claude's backend twice daily) — fetches, scores, writes, commits, pushes.
2. **The thinkit repo** — holds published posts, routine config, routine state.

**Properties of this architecture:**
- No local Mac dependency at runtime. Your laptop can be off; the routine still runs.
- No external services beyond HN's public API, Anthropic (via Claude SDK), and GitHub.
- Git history is the audit log — every run produces a commit, even no-op runs (more on this below).
- Each routine fire is a fresh sandbox; no cross-run state outside the repo itself.

### 4.4 Repo layout (`kiranramanna/thinkit`)

```
thinkit/                                 # existing Jekyll blog (root unchanged)
├── _posts/                              # published Jekyll posts
│   └── YYYY-MM-DD-<slug>.md
├── _config.yml                          # Jekyll config (Effort 1 modifies)
├── (other Jekyll dirs as-is)
│
└── .routines/                           # NEW — all automation lives here
    │                                    # (dotfile → Jekyll auto-excludes)
    ├── README.md                        # explains the routine system
    │
    ├── shared/                          # cross-routine assets
    │   ├── profile.md                   # writer profile snapshot
    │   ├── voice-rules.md               # voice/tone do/don'ts
    │   ├── post-template.md             # Jekyll frontmatter skeleton
    │   └── policy.md                    # global content policy
    │
    ├── lib/                             # optional shared helpers
    │   ├── hn_fetch.sh                  # curl + jq HN top stories
    │   ├── post_writer.sh               # write Jekyll post w/ frontmatter
    │   └── state_helpers.sh             # safe read/update of state.json
    │
    ├── specs/                           # design specs (this file)
    │   └── 2026-05-31-*.md
    │
    └── hn-daily/                        # one routine = one folder
        ├── README.md                    # what this routine does
        ├── trigger.md                   # the prompt Claude trigger runs
        ├── scoring-prompt.md            # sub-prompt: score HN items
        ├── writing-prompt.md            # sub-prompt: write post in voice
        ├── config.yml                   # routine tunables
        └── state.json                   # last-published HN IDs + run log
```

**Design rules for modularity:**

1. **One folder = one routine.** Future routines (`youtube-weekly`, `daily-notes-mirror`, etc.) drop in as sibling folders without restructuring.
2. **`shared/` holds cross-routine assets.** Profile and voice rules are written once; every routine references them.
3. **`config.yml` separates tunables from prompts.** Adjusting threshold from 7 → 8 is a one-line commit, not a prompt edit.
4. **State per routine.** Routines can't corrupt each other.
5. **`lib/` is optional.** Most routines do everything in the trigger prompt; bash helpers exist for cases where the trigger needs reusable logic.

### 4.5 Trigger flow (per fire)

```
1. CLONE      gh repo clone kiranramanna/thinkit && cd thinkit
2. LOAD       read .routines/shared/{profile,voice-rules,post-template,policy}.md
              read .routines/hn-daily/{config.yml,state.json}
3. FETCH      curl HN topstories.json → take top N (default 30)
              fetch item details for each (title, url, score, descendants, text)
              filter out IDs already in state.json (rolling 7-day dedup)
              filter out items with no URL AND no text (skip empty stories)
4. SCORE      single Claude call with all candidates + profile + scoring-prompt
              → returns JSON [{id, score, reason}, ...]
              filter: score >= config.threshold (default 7)
              sort by score desc, take top config.cap (default 2)
              if 0 items selected → skip to step 6 (still update state for run log)
5. WRITE      for each selected item:
              - fetch linked article excerpt (first ~2000 chars) if URL exists
              - Claude call: item + excerpt + profile + voice-rules + writing-prompt
              - returns full post body (frontmatter + body in Jekyll format)
              - write to _posts/YYYY-MM-DD-<slug>.md
                (slug derived from frontmatter title)
6. RECORD     append run metadata to state.json:
              { run_ts, candidates_count, selected_ids, posts_written }
              prune state.json entries older than 7 days
7. COMMIT     git add _posts/ .routines/hn-daily/state.json
              git commit -m "hn-daily: <N> post(s) — <YYYY-MM-DD> <morning|evening>"
              git push origin master   # explicit origin, never upstream
              if no posts written, commit only state.json with message
              "hn-daily: 0 posts — <YYYY-MM-DD> <morning|evening> (no matches)"
```

### 4.6 Scoring sub-prompt

Lives in `.routines/hn-daily/scoring-prompt.md`. Loaded by the trigger, prepended with profile, and called with the day's HN items.

**Input contract:**

```yaml
inputs:
  profile: <full text of .routines/shared/profile.md>
  candidates:
    - id: <HN item id>
      title: <HN story title>
      url: <linked URL or null>
      score: <HN score>
      descendants: <comment count>
      text: <ASK HN text, if applicable>
    ... (up to 30 items)
```

**Output contract (strict JSON):**

```json
[
  {
    "id": 39842734,
    "score": 8,
    "reason": "Direct overlap with profile's stated focus on agentic AI and RAG; technical depth in retrieval reranking is a topic the writer has shipped to production at ServiceNow."
  },
  {
    "id": 39842801,
    "score": 3,
    "reason": "Off-topic — crypto announcement; no overlap with AI/ML or systems engineering interests."
  },
  ...
]
```

**Scoring rubric (encoded in the prompt):**

- **9-10:** Direct hit on the writer's primary expertise (Agentic AI, RAG, LLM orchestration, conversational AI, knowledge graphs, evaluation harnesses). Substantive technical content.
- **7-8:** Strong adjacency (production AI engineering, enterprise AI, platform architecture, observability/governance for AI). Or a primary-expertise topic with thinner technical content.
- **5-6:** Tangential — touches AI/ML or systems engineering but not in the writer's lane. Or a primary-expertise topic that's pure hype with no substance.
- **3-4:** Off-topic for the professional voice but writer might have personal interest (e.g., Sanskrit, Jyotishya tooling, classical CS papers).
- **1-2:** Completely off-topic (crypto, politics, lifestyle, gaming).

The prompt also includes negative examples: HN items that look related but should score low because they're surface-level marketing posts or rehashed news.

### 4.7 Writing sub-prompt

Lives in `.routines/hn-daily/writing-prompt.md`. Called once per selected HN item.

**Input contract:**

```yaml
inputs:
  profile: <full text of .routines/shared/profile.md>
  voice_rules: <full text of .routines/shared/voice-rules.md>
  post_template: <full text of .routines/shared/post-template.md>
  item:
    id: <HN item id>
    title: <HN story title>
    url: <linked URL>
    score: <HN score>
    descendants: <comment count>
    excerpt: <first ~2000 chars of linked article, if fetched>
    hn_url: https://news.ycombinator.com/item?id=<id>
```

**Output contract:** A complete Jekyll post, frontmatter-first, body second:

```markdown
---
layout: post
title: "<writer-voice title — distinct from HN title>"
date: 2026-05-31 13:42:18 +0000
categories: [<2-4 tags from a controlled vocabulary>]
hn_id: 39842734
hn_url: https://news.ycombinator.com/item?id=39842734
source_url: https://example.com/the-original-article
---

<200-400 word post in writer's voice>
- emoji-bulleted insights where appropriate (matches existing thinkit style)
- 2-3 short paragraphs OR 5-8 bullets
- ends with a thought-provoking question or call-out
- links back to source_url AND hn_url naturally
```

**Voice rules (encoded in `.routines/shared/voice-rules.md`):**

- First-person, conversational but substantive.
- Lead with insight, not summary — assume the reader already knows the headline.
- Connect to writer's production experience at ServiceNow when relevant; don't force it.
- Use technical terms precisely (RAG, agentic, eval harness, etc.) — don't dumb down or pad.
- Avoid: LinkedIn-style hype phrases ("game-changer", "revolutionary"), AI-isms ("dive deep", "unpack", "moreover"), corporate hedging ("it could be argued that…").
- Emoji bullets are OK and match existing thinkit posts, but ≤ 6 per post.
- End with a question, a prediction, or a contrarian take — not a summary.

### 4.8 Controlled vocabulary for `categories:`

Posts use a small fixed taxonomy (defined in `voice-rules.md`):

| Tag | When to use |
|---|---|
| `agentic-ai` | Multi-agent systems, tool use, LangGraph, agentic workflows |
| `rag` | Retrieval, embeddings, vector DBs, reranking, hybrid search |
| `llm-ops` | Evaluation, observability, latency budgets, model serving |
| `enterprise-ai` | ServiceNow-relevant, governance, PII, compliance, ROI |
| `conversational-ai` | Chatbots, virtual agents, dialog systems |
| `knowledge-graphs` | KG-enhanced retrieval, schema design, entity linking |
| `ai-infrastructure` | GPUs, inference servers, model deployment, cost engineering |
| `research` | Paper takes, benchmark commentary, novel methods |
| `industry` | Funding, M&A, regulatory news — when it matters to practitioners |

The writing prompt is constrained to choose 2-4 tags from this list. Posts that don't fit cleanly get the broadest applicable tag (`research` or `industry` as fallbacks).

### 4.9 `config.yml` schema

```yaml
# .routines/hn-daily/config.yml

# How many HN top stories to fetch and score
fetch_limit: 30

# Minimum score (1-10) for an item to be eligible for publishing
threshold: 7

# Max posts to publish per run (cap)
posts_per_run: 2

# Max posts to publish per day across all runs (soft global cap)
posts_per_day: 4

# Rolling dedup window — don't republish an HN ID within this many days
dedup_window_days: 7

# Timezone for post date format. UTC avoids JST bug from prior pipeline.
date_timezone: "+0000"

# Min HN score for an item to be considered (filters HN noise before LLM scoring)
min_hn_score: 30

# LLM model for scoring (cheaper)
scoring_model: "claude-haiku-4-5"

# LLM model for writing (better quality)
writing_model: "claude-sonnet-4-6"

# If true, write commit even when 0 posts published (preserves audit trail)
commit_on_zero_posts: true
```

### 4.10 `state.json` schema

```json
{
  "schema_version": 1,
  "last_pruned_ts": "2026-05-31T13:42:18Z",
  "runs": [
    {
      "ts": "2026-05-31T13:42:18Z",
      "window": "morning",
      "candidates_count": 27,
      "scored_above_threshold": 3,
      "selected_ids": [39842734, 39842801],
      "posts_written": 2,
      "commit_sha": "abc1234"
    }
  ],
  "published_ids": {
    "39842734": "2026-05-31T13:42:30Z",
    "39842801": "2026-05-31T13:43:05Z"
  }
}
```

**Pruning logic:** at the end of each run, entries in `published_ids` older than `dedup_window_days` are removed; `runs` is kept indefinitely (small, useful for audit).

### 4.11 Profile snapshot — what goes in `shared/profile.md`

A curated extract from `codex-research/persona/writers_style_and_profile.md`, NOT the whole file. Goal: give the LLM enough signal to score and write well, without overflowing context on every call.

**Structure (~300-500 lines):**

```markdown
# Writer Profile — Kiran Kumar Ramanna

## Professional identity
- Senior Staff AI Engineer at ServiceNow (since Mar 2024)
- 14+ years in AI/ML and software engineering
- Based: San Francisco Bay Area

## Primary technical focus
- Agentic AI: orchestration, tool use, routing, retries/fallbacks
- RAG: context engineering, embeddings, rerankers, hybrid search
- Conversational AI: virtual agents, intent/slot/entity, dialog-act-aware UX
- LLM ops: evaluation harnesses, safety/PII guardrails, governance
- Knowledge graphs as retrieval signal

## Secondary technical focus
- Platform engineering: APIs, microservices, data pipelines on AWS/Azure/GCP
- ServiceNow platform: CSM/CRM, agent workspace, omni-channel
- System design: scalability, reliability, monolith→microservices

## What the writer DOESN'T cover (filter out)
- Crypto, web3 (unless directly about AI compute economics)
- Frontend frameworks (React, Vue, etc. — not the writer's lane)
- Mobile app development
- General programming language wars
- Productivity tools / "how I work" content

## Personal interests (rare on HN, may surface occasionally)
- Vedic astrology / Jyotishya
- Sanskrit
- Indian classical music

## Voice signature
- First-person, conversational, substantive
- Uses precise technical terms (no dumbing down)
- Connects ideas to production reality at ServiceNow when relevant
- Avoids AI-ism filler ("dive deep", "moreover", "in essence")
- Avoids LinkedIn hype ("game-changer", "paradigm shift")
- Avoids hedge phrasing ("it could be argued", "one might say")
```

The full `persona/writers_style_and_profile.md` from codex-research is too long and includes personal/family details that are off-topic for HN curation. The curated snapshot focuses the LLM on what matters for scoring + writing.

### 4.12 Error handling

| Failure mode | Detection | Recovery |
|---|---|---|
| HN API unreachable | `curl` non-200 / timeout | Exit cleanly; commit a log entry to state.json under `runs[].error`; no post written |
| HN returns malformed JSON | `jq` parse error | Same as above |
| LLM scoring call fails | SDK exception | Exit cleanly; log error; no post written |
| LLM scoring returns invalid JSON | JSON parse error | Retry once with stricter prompt; if still bad, log + exit |
| LLM writing call fails for item N | SDK exception | Skip item N; continue with item N+1; log per-item |
| Linked article fetch fails (404, timeout) | HTTP error | Proceed with HN-only context; note `"excerpt": null` in writing input |
| Git push fails (network) | git non-zero exit | Retry once; if still failing, exit non-zero (claude.ai will surface failure) |
| Git push fails (auth) | git non-zero exit | Exit non-zero immediately — auth requires user action; no point retrying |
| Push tries to go to `upstream` instead of `origin` | Explicit `origin` arg should prevent | Trigger prompt uses `git push origin master` literally |
| State.json corruption | JSON parse error on read | Start with empty state, log warning; user can revert state.json from git history |

**No silent failures.** Every error path commits an entry to `state.json[runs]` with `error: "..."` so `git log` shows the routine ran and failed, instead of just being absent.

### 4.13 Observability

The git history of `thinkit` IS the observability dashboard. No separate logging, no external monitoring service.

**Commit message conventions:**

```
hn-daily: 2 posts — 2026-05-31 morning
hn-daily: 0 posts — 2026-05-31 evening (no matches)
hn-daily: 0 posts — 2026-05-31 morning (error: HN API timeout)
```

To check routine health:

```bash
git log --oneline --grep="^hn-daily:" --since="14 days ago"
```

Expect ~28 commits over 14 days (2/day). A gap of > 1 day means the trigger isn't firing or is silently failing.

### 4.14 Testing approach

**Pre-launch tests:**

1. **Dry-run mode** — add a `--dry-run` flag to the trigger prompt that runs steps 1-5 but skips step 6 (commit/push). Run manually from local terminal first to verify outputs.
2. **Score-only run** — run scoring without writing on 30 hand-picked HN items (mix of on-topic and off-topic). Verify scores are sensible.
3. **Voice calibration** — write 3-5 posts manually using the writing prompt; compare to existing posts in `_posts/`. Iterate on `voice-rules.md` until output is indistinguishable from manually-written posts.
4. **End-to-end manual run** — full pipeline from your local terminal once, with `--dry-run` off. Verify the commit + post + state update look right.
5. **First scheduled run** — enable the trigger; watch the first 2-3 firings closely.

**Post-launch sanity checks (daily for first week):**

- Read each new post before bed; flag voice issues.
- Check `git log` for any `(error: ...)` commits.
- After first week, settle into reading posts in the morning over coffee.

### 4.15 Exit criteria for Effort 2

- [ ] `.routines/` structure created and committed.
- [ ] `shared/profile.md` written from codex-research extract.
- [ ] `shared/voice-rules.md` written.
- [ ] `shared/post-template.md` matches existing thinkit post format.
- [ ] `hn-daily/trigger.md`, `scoring-prompt.md`, `writing-prompt.md`, `config.yml`, `state.json` all in place.
- [ ] At least 3 manual end-to-end test runs successful.
- [ ] Claude trigger configured with two daily schedules (14:00 + 03:00 UTC).
- [ ] First 7 days of scheduled runs show ≥ 6 successful runs (commit pushed, no error in state.json).
- [ ] 0 posts retracted for hallucination or off-brand voice.

---

## 5. Effort 3 — Historical backfill (Mar–Oct 2025)

### 5.1 Goal

Fill the gap between Feb 2025 and Nov 2025 in `thinkit/_posts/` with retroactively-dated posts that establish a consistent publishing history. Goal: ~2-4 posts per month for the Mar–Oct window (16-32 posts total).

### 5.2 Approach

Once Effort 2 is stable, add a `backfill-mode` to the same routine:

1. Use HN's Algolia search API: `https://hn.algolia.com/api/v1/search?tags=story&numericFilters=created_at_i>{week_start},created_at_i<{week_end}&hitsPerPage=30`.
2. Iterate through weeks in the backfill window (e.g., Mar 1 2025 → Oct 31 2025, one week per iteration).
3. For each week, run the existing scoring + writing pipeline against that week's top HN stories.
4. Date the resulting posts to a plausible day within that week.
5. Commit each week's batch separately with a clear message: `backfill: 2025-W14 — 3 posts`.

### 5.3 Disclosure decision

**Recommended: disclose backfilled posts.**

Add a frontmatter field:

```yaml
backfilled: true
backfilled_on: 2026-06-15
```

And a footer line at the bottom of each backfilled post:

> *Written retrospectively in 2026 as part of a historical curation pass on Hacker News stories from this week. Original HN discussion: <link>.*

**Why disclose:**

1. `git log` already exposes it (commit dates won't match post dates). Anyone who checks finds out anyway.
2. If any of this content shows up in an EB1A petition, immigration audit, or job interview, the discrepancy is reputation-damaging if discovered post-facto.
3. The disclosure doesn't reduce the *intellectual* value of the post — your take on a Mar 2025 story is still your take. It just frames the temporal context honestly.
4. Disclosed backfill is a known practice on personal blogs and substacks. Not disclosing it is the rarer choice.

If you decide against disclosure, leave the frontmatter as-is and just date the post — but understand the audit-trail exposure.

### 5.4 Cadence

One-shot batch run after Effort 2 has been stable for ≥ 10 days. Not a recurring routine. Once backfill is done, the `.routines/hn-daily/` config can drop `backfill-mode` entirely.

### 5.5 Exit criteria for Effort 3

- [ ] 16-32 backfilled posts spread across Mar–Oct 2025 (≥ 2/month, ≤ 4/month).
- [ ] All posts include `backfilled: true` frontmatter (if disclosure path chosen).
- [ ] No backfilled post duplicates an existing manually-written post.
- [ ] Backfilled commit messages clearly distinguish from forward-publish commits.

---

## 6. Cross-cutting decisions

### 6.1 Date format (final)

All dates use UTC with explicit `+0000` offset:

```yaml
date: 2026-05-31 13:42:18 +0000
```

Reason: previous pipeline (mcp-moat) had a JST bug (`+0900`). UTC removes timezone-related ambiguity and makes test fixtures simpler. Visitors see dates in their local timezone via Jekyll's rendering (which uses the offset).

### 6.2 Push remote (final)

The trigger uses `git push origin master` explicitly. Never `git push` (which could resolve to `upstream` if remote tracking gets misconfigured).

### 6.3 LLM model choice (final)

- **Scoring:** `claude-haiku-4-5` — fast, cheap, sufficient for ranking 30 items against a profile.
- **Writing:** `claude-sonnet-4-6` — better voice fidelity for 200-400 word posts. Cost per post is small (~few cents); quality matters more than cost at this volume.

If quality on writing is unsatisfactory after first week, escalate to `claude-opus-4-7` for writing only.

### 6.4 Auth (final)

The Claude trigger sandbox already has the user's Claude OAuth token (`CLAUDE_CODE_OAUTH_TOKEN`) for LLM calls and a GitHub OAuth token (via `gh` CLI) for repo operations. No new credentials needed.

### 6.5 Where this spec lives

This spec is committed to `kiranramanna/thinkit/.routines/specs/`. Reasons:

- `.routines/` is auto-excluded by Jekyll (dotfiles).
- Co-locating the spec with the routine code keeps related docs and code together.
- Future routine specs land in the same directory.

---

## 7. Out of scope (explicit non-goals)

To prevent scope creep:

- **Social media cross-posting** (LinkedIn, X, Bluesky). Posts go to thinkit only.
- **Comments system** (Disqus, Giscus). Static Jekyll, no comments.
- **RSS / email subscription tooling.** GitHub Pages emits a default RSS feed via `jekyll-seo-tag`; no extra work.
- **Analytics dashboard.** Use GitHub Pages built-in stats or browser-side Google Analytics if needed later.
- **Multi-author support.** Single-author blog.
- **Image generation** for post hero images. Posts are text-first.
- **Cross-routine orchestration.** Each routine is independent; no shared scheduler.
- **Migration of existing manually-written posts.** They stay as-is.
- **Refactoring `mcp-moat`** to reuse its pieces. The HN-daily routine is self-contained in thinkit. `mcp-moat` can stay as the video-to-blog pipeline it currently is.

---

## 8. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| LLM hallucinates a fact in a published post | Medium | Medium (reputation) | Tight `voice-rules.md` warnings; first-week manual review; ability to delete + commit revert within minutes |
| LLM voice drifts off-brand over time | Medium | Low-Medium | Periodic voice audit (read 10 posts; if 2+ feel off, tune `voice-rules.md`) |
| HN API rate limits or outage | Low | Low | Routine fails gracefully; missing one day doesn't matter |
| GitHub Pages build fails on a malformed post | Low | Medium (site down) | Validate frontmatter format in trigger before commit; CI-style local test before each prompt change |
| Claude trigger quota / billing surprise | Low | Low | Two runs/day × Sonnet is well under typical budgets; monitor monthly |
| Theme regression in Effort 1 | Low | Low | Test locally before push; one-line revert if broken |
| Backfill creates uncomfortable disclosure question | Low | Medium | Default to `backfilled: true` disclosure; revisit if it feels wrong |

---

## 9. Open decisions deferred to implementation

These are NOT blockers for spec approval but will need a call during implementation:

1. **DST handling** for trigger schedule. The recommended cron values:
   - `14:00 UTC` → `07:00 PDT` (summer) / `06:00 PST` (winter) — morning run lands at 6-7am PT year-round.
   - `03:00 UTC` → `20:00 PDT` previous day (summer) / `19:00 PST` previous day (winter) — evening run lands at 7-8pm PT year-round.
   The 1-hour drift across DST is acceptable for both windows. If we want exact-time consistency, we'd need two trigger configs and switch them twice a year — likely not worth the operational overhead.
2. **Should the trigger run on weekends?** HN has lower-quality top stories on Sundays. Two options: (a) run anyway and rely on the threshold to suppress bad days, or (b) skip Sun/Mon morning runs.
3. **Should we maintain a small "blocklist" of HN domains/keywords** (e.g., always skip TikTok/Twitter drama, crypto-only news)? Or trust the LLM scorer to filter? Default: trust the scorer for first 2 weeks; build a blocklist only if specific noise patterns emerge.
4. **Quarterly profile sync from codex-research.** Profile snapshot will drift from the authoritative source over time. Need a lightweight habit (calendar reminder?) to manually `cp` the relevant sections every quarter.

---

## 10. Success summary

This spec is successful if, 90 days after launch:

- Thinkit shows ≥ 50 new posts published by the routine.
- Site renders correctly in light, dark, and hacker themes across devices.
- 0 posts have been deleted for quality issues.
- The Mar–Oct 2025 gap is filled with ≥ 16 backfilled posts.
- Total maintenance time has been < 30 min/week (mostly: reading posts in the morning).

If any of those slip badly, this spec needs revision. If they all hit, the routine is the foundation for future automations (`youtube-weekly`, etc.) that reuse the same `.routines/` patterns.
