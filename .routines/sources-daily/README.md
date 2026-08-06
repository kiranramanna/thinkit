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
