---
layout: interest
title: "bigger context isn't the answer"
blurb: "the running case that long-horizon agents need managed context, not a longer window"
entries:
  - date: 2026-08-23
    kind: post
    post: when-more-context-makes-your-coding-agent-worse
    why: >
      Opened the thread with a paired ablation showing more context
      actively degrades a coding agent — the evidence the rest of the
      arc is built on.

  - date: 2026-08-31
    kind: post
    post: context-management-is-the-agent-loop-nobody-tuned
    why: >
      Named the real lever: long-horizon agents fail as the working
      context grows and drowns the signal, and bolted-on summarization
      isn't management.

  - date: 2026-10-08
    kind: post
    post: give-the-agent-a-ledger-not-a-bigger-context-window
    why: >
      The architectural turn — keep an external ledger of state the
      agent reads back, instead of widening the window to hold
      everything in view.

  - date: 2026-11-05
    kind: post
    post: when-short-context-beats-a-bigger-window
    why: >
      The strongest form of the claim, backed by a paper showing
      compaction costs little accuracy and proposing semantic state
      space models — the 'you may not need long context at all' close.

  - date: 2026-11-12
    kind: post
    post: agents-read-too-much-and-bigger-models-dont-fix-it
    why: >
      Moves the control point to admission time: stop the tokens at the
      read, not after they flood the window. The new beat is that the
      strongest model tested (Opus 5) still over-reads up to 17x, so
      capability never erases the reading bottleneck either.

  # routine:append-here — sources-daily inserts new entries above this line.
  # Hand-written entries are safe anywhere in this list; the routine only
  # inserts, and only for posts whose slug is not already present.
---
