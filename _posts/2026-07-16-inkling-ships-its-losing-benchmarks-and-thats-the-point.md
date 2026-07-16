---
layout: post
title: "Inkling Ships Its Losing Benchmarks, and That's the Point"
date: 2026-07-16 14:05:49 +0000
categories: [llm-ops, research, agentic-ai]
hn_id: 48924912
hn_url: https://news.ycombinator.com/item?id=48924912
source_url: https://thinkingmachines.ai/news/introducing-inkling/
---

The refreshing thing about [Thinking Machines Lab's Inkling launch](https://thinkingmachines.ai/news/introducing-inkling/) isn't the 975B-parameter MoE or the 1M-token context. It's that the model card leads with a line most vendors would bury: Inkling is not the strongest overall model available today, open or closed. Then it prints the table proving it — 77.6% on SWE-Bench Verified against Fable 5's 95.0%, 63.8% on Terminal Bench against GPT 5.6's 89.5%.

That framing tells you what this release is actually for. With 41B active out of 975B total, and an Inkling-Small at 12B active, the pitch is customization economics, not leaderboard wins. Open weights on Hugging Face plus a fine-tuning platform is a bet that most production teams don't need the frontier — they need a competent multimodal base they can adapt and self-host without paying peak-model latency on every request.

The detail I'll be borrowing for eval harnesses is controllable thinking effort as a first-class knob (0.2 to 0.99), with the claim that Inkling matches a stronger model on Terminal Bench at roughly a third of the tokens. In production, "which model" is often the wrong question; "how much compute per request, gated on task difficulty" is the real latency-budget lever, and baking that into the model instead of into prompt hacks is the right layer for it.

The [HN thread](https://news.ycombinator.com/item?id=48924912) is mostly arguing about whether "open weights" without open data counts. Fair. But the sharper operational question is whether a 41B-active model you can fine-tune on your own evals beats a frontier API you can't touch — for your workload, not for a benchmark leaderboard. Which side of that trade is your team actually on?
