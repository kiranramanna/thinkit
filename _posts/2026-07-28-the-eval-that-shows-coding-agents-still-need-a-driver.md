---
layout: post
title: "The Eval That Shows Coding Agents Still Need a Driver"
date: 2026-07-28 03:06:06 +0000
categories: [llm-ops, agentic-ai, research]
hn_id: 49076391
hn_url: https://news.ycombinator.com/item?id=49076391
source_url: https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/benchmarking-opus-5-on-slop-code-bench.md
---

Most coding benchmarks hand the model the whole problem on turn one. Real work never does. SlopCodeBench, run against Opus 5 in [this writeup](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/benchmarking-opus-5-on-slop-code-bench.md), gets the shape right: it feeds requirements incrementally across checkpoints, so a model has to evolve a codebase it already wrote instead of green-fielding a fresh solution. That's the part that actually breaks agents in production, and it's the part almost no eval measures.

The headline number is humbling. Opus 5 landed a strict pass — all new code green plus inherited regression tests — on 24% of 17 checkpoints. Opus 4.8 and Sonnet 5 managed 6%. Even the best result means three of four incremental changes left something broken. That tracks with what I see running agentic workflows against long-lived services: the first change is easy, the fifth one, on top of the model's own accreted structure, is where the wheels come off.

What I find more telling than the pass rate is the drift. Opus 5 wrote roughly 29,000 source lines where the others wrote ~9,000, and complexity climbed across every checkpoint for every model. More code, more tests, more callables — and still a minority of strict passes. The failure mode isn't "can't write code." It's that the code an agent generates becomes the context an agent then has to maintain, and that context degrades faster than the model's steering can correct.

The benchmark's own framing is that for one-issue-at-a-time engineering, today's models can't "run lights-off without steering." I'd add a corollary for anyone building eval harnesses: measure the *second derivative*. Single-shot pass rates flatter models; maintainability under self-generated slop is the real ceiling.

If a model hit 80% here, would you actually hand it your service and walk away — or would you still want a human on the merge button? The [HN thread](https://news.ycombinator.com/item?id=49076391) is split, and I think that split is the honest answer.
