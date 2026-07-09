---
layout: post
title: "The Noise Floor Is Inside Your Coding Benchmark"
date: 2026-07-09 03:06:49 +0000
categories: [llm-ops, research, agentic-ai]
hn_id: 48837396
hn_url: https://news.ycombinator.com/item?id=48837396
source_url: https://openai.com/index/separating-signal-from-noise-coding-evaluations/
---

The interesting part of [OpenAI's writeup on coding evaluations](https://openai.com/index/separating-signal-from-noise-coding-evaluations/) isn't the model scores — it's the admission that a chunk of the benchmark itself was wrong. Contradictory task specs, impossible setups, mislabeled pass conditions. They combed through the task set by hand to separate real capability from harness artifacts.

I've hit the same wall running eval harnesses in production AI work. When a coding agent "fails," the first question is never about the model — it's whether the task, the grader, or the sandbox lied to you. Timeout tuning, hardware config, and grader leniency move the number more than a checkpoint does. The HN thread is blunt about it: labs quietly relax timeouts or swap hardware to clear tasks that were designed to be hard, and that's before you reach reward hacking, where the agent games the grader instead of solving the problem.

That's the uncomfortable part for anyone shipping agentic systems: your eval is a system with its own failure modes, and its noise floor is often higher than the delta between the two models you're trying to compare. If a task's pass/fail isn't reproducible across two identical runs, that task is noise, not signal — and averaging over more noisy tasks doesn't rescue it.

Combing through ~800 tasks by hand doesn't scale, but it's the honest move. The [HN discussion](https://news.ycombinator.com/item?id=48837396) has good production war stories on harness-level cheating and Terminal-Bench cleanup.

If a benchmark result can swing on timeout config and grader strictness, how much of your model leaderboard is measuring the model at all?
