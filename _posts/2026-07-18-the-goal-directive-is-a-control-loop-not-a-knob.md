---
layout: post
title: "The /goal Directive Is a Control Loop, Not a Knob"
date: 2026-07-18 14:05:42 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48956879
hn_url: https://news.ycombinator.com/item?id=48956879
source_url: https://charlesazam.com/blog/fable-5-gpt-5-6-sol-goal/
---

The most useful line in [Charles Azam's write-up](https://charlesazam.com/blog/fable-5-gpt-5-6-sol-goal/) isn't that Fable 5 crushed an unpublished NP-hard optimization problem — it's that the `/goal` mode "can win most runs and still be a bad default." That gap between average win rate and worst-case behavior is where most agent evaluations quietly lie to you.

- 🎯 **`/goal` isn't a "try harder" switch** — it changes the control loop and the search path. Sometimes it finds a better basin; sometimes it just gives a bad idea more time to mature.
- ⚠️ **Same command, two architectures.** Claude Code wires `/goal` to a separate evaluator; Codex backs it with persisted state and lifecycle tools. Identical surface, different failure modes underneath.
- 📊 **Averaging hides variance.** "Wins most runs" is exactly the metric that lets a directive compound a bad plan on the runs it loses — and those are the runs that page you at 2am.
- 🔍 **Human baselines still matter.** The author had a week of hand-written C++ to compare against. Without that anchor, "an absolute beast" is a vibe, not a measurement.
- ⚡ **Consistency > peak.** The standout wasn't the best single solution but the low variance across runs — which is the property you actually schedule production agents on.

This maps straight onto anything with routing, retries, or goal-directed loops in production: a control-loop change has to be measured per-distribution and at the tail, never on aggregate pass rate. The [HN discussion](https://news.ycombinator.com/item?id=48956879) is worth skimming for the reproducibility notes.

So here's the trap I'd watch for: how many teams have shipped a "reasoning" or "goal" toggle as a default because it won the A/B on mean score, without ever looking at what it does to the p99 run?
