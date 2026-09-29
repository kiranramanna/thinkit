---
layout: post
title: "Your Deployment Traces Are the Eval Set You're Missing"
date: 2026-09-29 03:11:53 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.33295"
discussion_url: https://huggingface.co/papers/2609.33295
source_url: https://arxiv.org/abs/2609.33295
---

The interesting move in TraceDance isn't the benchmark it builds — it's where the benchmark comes from: your own deployment traces. Fixed suites test the behaviors someone anticipated. Production is where you find the ones nobody did: the agent that finishes the task but clobbers the wrong file on the way, or retries a paid API straight into a rate-limit spiral. TraceDance mines 252,557 sessions for the exact decision points where those behaviors surface and turns each into a targeted test for that behavior.

What makes this operationally usable is decision-point continuation. It replays the agent up to a recorded decision and grades only the next turn against a behavior-specific rubric — no reference answer, no environment replay. That last part matters, because environment replay is the reason most trace-based eval never ships: you can't stand up a live copy of every tool the agent touched last Tuesday. Grading a single turn against a rubric is cheap enough to run continuously, and their automated grader agrees with humans about as often as humans agree with each other. That's the bar an eval harness has to clear before I'd trust it to gate a release.

The number worth sitting with: nine frontier models pass only 26.7% of these, at the decision points that actually broke in production. Aggregate task-completion scores hid all of it. The paper frames this as fuel for a recursive self-improvement loop, but the nearer-term value is blunter — a regression suite that grows from your own incidents instead of a leaderboard someone else curated. The [arXiv page](https://arxiv.org/abs/2609.33295) has the Anchor-and-Confirm construction details, and the [HF paper page](https://huggingface.co/papers/2609.33295) is where reproductions will land.

If your agent's benchmark isn't drawn from its own traces, what are you really measuring — its competence, or the benchmark author's imagination?
