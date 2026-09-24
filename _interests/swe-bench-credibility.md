---
layout: interest
title: "what swe-bench actually measures"
blurb: "successive papers pulling apart what the coding-agent benchmark really tests"
entries:
  - date: 2026-08-11
    kind: post
    post: when-your-agent-benchmark-grades-the-wrong-thing
    why: >
      The first crack in the story: SWE-Bench ProMax made the case that
      a climbing benchmark number need not mean a better agent, raising
      the question the later papers keep answering more sharply.

  - date: 2026-09-04
    kind: post
    post: real-user-prompts-break-the-swe-bench-leaderboard
    why: >
      Shifts the critique from scoring to inputs. RealSWE showed the
      curated, information-rich problem statements barely resemble what
      real users type, so the leaderboard was measuring a distribution
      nobody actually ships against.

  - date: 2026-09-10
    kind: post
    post: your-coding-agent-benchmark-was-leaking-the-answers
    why: >
      The contamination angle lands. SWE-Bench Pro Verified showed the
      isolation every leaderboard number assumes quietly fails, so
      scores were partly reading back answers the model had already
      seen.

  - date: 2026-09-24
    kind: post
    post: are-coding-agents-reasoning-or-memorizing-swe-bench
    why: >
      Tests the memorization claim head-on: scramble the repo's surface
      cues while preserving behavior and performance drops, evidence the
      agents were localizing from memorized cues rather than reasoning
      from the code.

  # routine:append-here — sources-daily inserts new entries above this line.
  # Hand-written entries are safe anywhere in this list; the routine only
  # inserts, and only for posts whose slug is not already present.
---
