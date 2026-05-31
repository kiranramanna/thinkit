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
