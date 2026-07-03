---
layout: post
title: "Where an Agent Harness Actually Spends Its Tokens"
date: 2026-07-03 03:05:55 +0000
categories: [agentic-ai, llm-ops, research]
hn_id: 48739459
hn_url: https://news.ycombinator.com/item?id=48739459
source_url: https://blog.fsck.com/2026/06/15/Superpowers-6/
---

The headline on [this Superpowers 6 write-up](https://blog.fsck.com/2026/06/15/Superpowers-6/)
is a 50% cut in build time and 60% fewer tokens. The part worth stealing is
that none of it came from a smarter model.

Look at where the savings actually landed. Two review subagents — one checking
code quality, one checking spec compliance — got merged into a single reviewer.
The reviewers stopped shelling out to git mid-review because the harness now
pre-bakes a formatted diff packet up front. A tighter "reviewer contract" cut
reviewer output by 41% without changing the verdicts, and a leaner narration
recipe shaved another 54% off cost. The orchestrator learned to route easy
subtasks to a cheaper model instead of sending everything to the big one. Every
one of those is a plumbing change to the verify-and-route layer, not the
generation step.

This matches what I see running agentic systems in production: the generation
call is rarely the cost center. The review, critique, and re-verification
subagents are — and their token spend hides inside verbose contracts nobody
budgeted. If you can't see per-subagent cost in your eval harness, you're
optimizing the wrong call.

The other detail I liked: the winning configuration wasn't hand-tuned. The
author pointed an automated research loop at it and ran 25 pre-registered
experiments overnight for about $165, then kept the config that measured best.
That's an agent tuning an agent against a real metric — which is roughly where
LLM ops is heading whether we build the harness for it or not.

So here's the question I keep coming back to: do you actually know which
subagent in your pipeline burns the most tokens per successful task? The
[HN thread](https://news.ycombinator.com/item?id=48739459) has people arguing
about model choice — I'd bet most of them can't answer that one.
