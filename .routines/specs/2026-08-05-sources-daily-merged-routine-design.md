# Sources-Daily Merged Multi-Source Routine — Design Spec

**Date:** 2026-08-05
**Status:** Approved (brainstorming session, 2026-08-05)
**Author:** Kiran Ramanna (via Claude Code brainstorming session)
**Target repo:** `kiranramanna/thinkit`
**Supersedes:** `hn-daily` routine (retired by this effort; see § 9)

---

## 1. Overview

Replace the single-source `hn-daily` routine with one merged multi-source routine,
`sources-daily`, that fetches candidates from **three sources** — Hacker News,
Lobste.rs, and Hugging Face Daily Papers — normalizes them into a common
candidate schema, dedups across sources, scores them in **one merged LLM pass**
against the writer profile, and publishes 0–2 posts per run to `_posts/`.

New in this design relative to `hn-daily`:

1. **Multi-source fetch** via per-source adapter files (§ 4).
2. **Cross-source dedup** keyed by normalized canonical URL (§ 5).
3. **Sentiment research step**: per selected item, a best-effort public-web
   sweep producing a cited "wider reaction" paragraph in the post (§ 7).
4. **Generalized frontmatter**: `source` / `source_id` / `discussion_url` /
   `source_url` replace `hn_id` / `hn_url` (§ 8).

Decisions locked during brainstorming:

| Decision | Choice |
|---|---|
| Architecture | One merged routine, per-source adapters, single scoring pass |
| `hn-daily` fate | Folded in as an adapter; `hn-daily/` retired in the same change |
| Schedule | Twice daily, same windows as today (13–15 UTC, 02–04 UTC) |
| Sentiment sources | Best-effort public web only (no X/FB/LinkedIn APIs) |
| Budget | `posts_per_run: 2`, `posts_per_day: 4` (carried over) |

## 2. Directory layout

```
.routines/sources-daily/
  README.md               # routine overview, ops notes
  trigger.md              # orchestrator prompt (windows, dedup, scoring,
                          #   research, writing, commit)
  config.yml              # global settings + per-source blocks + research block
  state.json              # merged dedup state + run log
  scoring-prompt.md       # source-aware scoring rubric (1-10)
  writing-prompt.md       # source-aware writing prompt (+ reaction paragraph)
  research-prompt.md      # sentiment research sweep instructions
  adapters/
    hn.md                 # fetch + normalize bash for Hacker News
    lobsters.md           # fetch + normalize bash for Lobste.rs
    hf-papers.md          # fetch + normalize bash for HF Daily Papers
```

`trigger.md` loads adapter files the same way it loads scoring/writing prompts,
keeping the orchestrator roughly the length of today's `hn-daily/trigger.md`.
Shared assets (`../shared/profile.md`, `voice-rules.md`, `post-template.md`,
`policy.md`) are referenced unchanged.

## 3. Normalized candidate schema

Every adapter emits JSON objects in one common shape — this is the interface
that makes the merge work:

```json
{
  "source": "hn | lobsters | hf-papers",
  "source_id": "48511908 | lobsters short_id | arXiv id (e.g. 2508.01234)",
  "title": "...",
  "url": "canonical article/paper URL",
  "discussion_url": "HN thread / Lobste.rs thread / HF paper page",
  "raw_score": 42,
  "extra": "lobsters tags (comma-joined) | paper abstract | null for HN"
}
```

Field rules:

- `url` is the dedup key input (§ 5). For HF papers, `url` is the arXiv abs
  URL; `discussion_url` is the huggingface.co paper page.
- `raw_score` is the source-native upvote count, used only for per-source
  pre-filtering — it is never compared across sources.
- `extra` feeds the scoring and writing prompts (abstract grounding for
  papers; tag context for Lobste.rs).

## 4. Adapters and per-source config

Per-source blocks in `config.yml`:

| Source | Endpoint | `fetch_limit` | `min_score` | Extra filter |
|---|---|---|---|---|
| `hn` | Firebase topstories API (as today) | 30 | 30 | none |
| `lobsters` | `https://lobste.rs/hottest.json` | 25 | 10 | tag allowlist |
| `hf-papers` | `https://huggingface.co/api/daily_papers` | all of today | 5 | none |

Lobste.rs tag allowlist (config, editable): `ai`, `ml`, `compsci`,
`distributed`, `devops`, `programming`. Items with no allowlisted tag are
dropped before LLM scoring (free pre-filter).

Upvote floors are scaled to community size and are config values, not
constants — expect tuning in the first weeks.

## 5. Dedup and state

`state.json` keys published items by **normalized canonical URL**:
lowercase scheme+host, strip `utm_*` query params, strip trailing slash.
The source-native ID is stored alongside for audit. Rolling window stays
`dedup_window_days: 7` with the same pruning behavior as today.

```json
{
  "published_urls": {
    "<normalized-url>": { "source": "hn", "source_id": "48511908",
                          "published_at": "2026-08-05T14:06:48Z" }
  },
  "last_pruned_ts": "...",
  "runs": [ ... ]
}
```

Two dedup points:

1. **Candidate-stage**: after all adapters run, candidates pointing at the
   same normalized URL merge into one. Keep the HN entry as primary when HN
   is among the duplicates (its discussion link is the richest); record the
   other sources' discussion URLs in `extra`.
2. **Publish-stage**: any candidate whose normalized URL is in
   `published_urls` (within window) is dropped before scoring.

**State migration:** at cutover, convert `hn-daily/state.json`
`published_ids` into the new URL-keyed format (resolving each HN ID to its
story URL via the HN API; fall back to keying by
`news.ycombinator.com/item?id=<id>` if the item's URL is unavailable), so
nothing republishes across the transition. The `runs` history from
`hn-daily` is not migrated (fresh run log; old log preserved in git history).

## 6. Scoring and selection

One scoring call (model: `claude-haiku-4-5`, as today) over the full deduped
candidate list (~40–60 items) against `shared/profile.md`. Threshold 7,
unchanged. The rubric gains one source-aware rule:

> Papers (`hf-papers`) are scored on **relevance to the writer's production
> practice** (agentic AI, RAG, LLM ops, evals, KG), not novelty alone. An
> incremental-but-applicable RAG-eval paper outranks a flashy-but-distant
> theory paper.

Selection: top-scored items ≥ threshold, capped at `posts_per_run: 2` and
soft daily cap `posts_per_day: 4`. Tie-break at equal score: prefer source
diversity within the run (don't publish two items from the same source if an
equal-scored item from another source exists).

## 7. Sentiment research step

Runs between selection and writing, per selected item (≤ 2/run), governed by
a `research:` config block:

```yaml
research:
  enabled: true
  min_citations: 2   # below this, omit the reaction paragraph entirely
  max_citations: 5
```

Procedure (detailed in `research-prompt.md`): a short WebSearch sweep —
story title + key entities, plus targeted passes over Substack, Reddit,
Bluesky/Mastodon, and general news coverage. X/Facebook/LinkedIn are
login-walled and are **not** direct sources; indexed X posts surfaced by
general search may be cited when they resolve to a readable page.

Output per item:

```json
{
  "citations": [
    { "url": "...", "outlet": "Substack | Reddit | The Verge | ...",
      "stance": "positive | negative | mixed | neutral",
      "note": "one-line gist" }
  ],
  "sentiment_summary": "one sentence on how reception is trending"
}
```

Guardrails:

- **No receipts, no paragraph.** Fewer than `min_citations` usable citations
  → the reaction paragraph is omitted entirely. Never characterize sentiment
  without linked sources. HF papers will commonly take this path.
- **Failure policy.** If the research step errors, the post still publishes
  without the paragraph; the run record logs `research_failed: true` for the
  item. Mirrors `abort_on_writing_error: false` philosophy.

## 8. Writing and post format

Writing model `claude-sonnet-4-6` per item, as today. `shared/post-template.md`
is updated in this effort — frontmatter generalizes to:

```yaml
---
layout: post
title: "<Title — writer's voice, not the source headline verbatim>"
date: <YYYY-MM-DD HH:MM:SS> +0000
categories: [<2-4 tags from the controlled vocabulary>]
source: hn | lobsters | hf-papers
source_id: <string — HN id / lobsters short_id / arXiv id>
discussion_url: <thread or HF paper page URL>
source_url: <article/paper URL, or null>
---
```

`hn_id`/`hn_url` disappear from the template. Existing posts keep their old
frontmatter; nothing in `_layouts/` or `_includes/` reads those fields
(verified 2026-08-05), so no site changes are needed.

Body rules (template update):

- 200–400 words base; **250–500 words** when the reaction paragraph is present.
- Reaction paragraph, when present, is the final paragraph — "the wider
  reaction" in the writer's voice, each citation linked inline, grounded
  **only** in the research step's citations.
- Paper posts ground in the abstract (`extra`); link the arXiv page and the
  HF paper page at least once each.
- All other voice/linking rules unchanged (`voice-rules.md`).

## 9. Cutover plan

One change, one commit sequence:

1. Create `.routines/sources-daily/` (all files in § 2).
2. Update `shared/post-template.md` per § 8.
3. Migrate state per § 5.
4. Delete `.routines/hn-daily/`.
5. Update `.routines/README.md` active-routines table.
6. **Manual, outside the repo:** repoint the Claude Code remote-trigger
   schedule from `hn-daily/trigger.md` to `sources-daily/trigger.md`.
   Same two windows (13–15 UTC, 02–04 UTC). This is the only step the repo
   change cannot perform itself.

Rollback path: revert the commit(s) and repoint the trigger back —
`hn-daily` remains fully recoverable from git history.

## 10. Error handling

- **Per-source fetch failure**: log `{source, error}` in the run record,
  continue with remaining sources. A run with one live source is a valid run.
- **All sources fail**: commit a zero-post run record (`commit_on_zero_posts:
  true` carries over).
- **Research failure**: § 7 — publish without the paragraph.
- **Writing failure**: `abort_on_writing_error: false` carries over — skip
  the item, continue.

## 11. Testing

Before repointing the schedule:

1. Run the orchestrator manually (window = `"manual"`) against a scratch
   clone in the session scratchpad.
2. Verify each adapter emits valid candidate JSON (spot-check counts and
   fields against the live endpoints).
3. Verify candidate-stage dedup with a synthetic duplicate (same URL from
   `hn` and `lobsters`).
4. Verify publish-stage dedup against the migrated state (a recently
   published HN URL must be dropped).
5. Inspect 1–2 generated posts end-to-end: frontmatter fields, word budget,
   reaction paragraph present/omitted correctly per citation count.
6. Do **not** push from test runs; commits stay local to the scratch clone.

## 12. Out of scope (explicitly deferred)

- Tier-2 curated RSS roll (expert blogs, lab blogs, eng blogs) — future
  adapter(s) once the three-source pipeline is proven.
- Tier-3 sources (r/LocalLLaMA, GitHub Trending).
- X API integration for sentiment (revisit only if best-effort public web
  proves too thin).
- Historical backfill interactions — unchanged from the 2026-05-31 spec.
