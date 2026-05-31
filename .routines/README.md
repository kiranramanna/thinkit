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
