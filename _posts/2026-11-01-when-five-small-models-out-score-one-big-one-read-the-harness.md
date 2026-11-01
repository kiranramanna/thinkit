---
layout: post
title: "When Five Small Models Out-Score One Big One, Read the Harness"
date: 2026-11-01 03:05:45 +0000
categories: [agentic-ai, llm-ops]
source: hn
source_id: "50320995"
discussion_url: https://news.ycombinator.com/item?id=50320995
source_url: https://github.com/guregodevo/memdoor/tree/main/examples/workflows/team-solve
---

The number everyone is quoting from [Memdoor's team-solve example](https://github.com/guregodevo/memdoor/tree/main/examples/workflows/team-solve) is "five Qwen3.8-27B models beat Fable 5." The number I'd actually put in a design doc is the one sitting right next to it: Fable 5 scored 8.0 in a single call; the five-agent run scored a mean 9.8 across fifty runs on ten problems. That isn't a model-count result. It's a harness trading a large token budget and an hour of wall-clock for a few points of pass rate.

What makes Memdoor worth reading isn't the leaderboard line, it's the orchestration underneath. Steps are a YAML graph; a step is done when a check passes, not when the model declares victory; a failed run resumes at the failed step; approval gates pause for a human. There's even a cheap decision model ("Jev") that answers typed relevance questions to prune context and tool lists — the README claims one codebase query dropped from ~55k to ~14k input tokens. That plumbing is what separates a demo agent from one you'd actually operate.

The comparison itself is the trap. A multi-run, check-gated harness against a single frontier call isn't a clean test of "small vs large" — it's a test of whether you can buy accuracy with tokens and verification. The [HN discussion](https://news.ycombinator.com/item?id=50320995) caught that fast: ten problems, a benchmark old enough to be saturated or contaminated, and 2-bit quants whose errors compound over long loops.

My read: the story isn't that small models are catching up. It's that a good harness — check-gated steps, context pruning, resumable state — is now a bigger lever than the model you point it at. How much of your agent's quality actually lives in the scaffold versus the weights?
