---
layout: post
title: "Stacking RL Experts Without Re-Merging the Whole Model"
date: 2026-11-24 14:05:19 +0000
categories: [research, llm-ops, agentic-ai]
source: hf-papers
source_id: "2611.27376"
discussion_url: https://huggingface.co/papers/2611.27376
source_url: https://arxiv.org/abs/2611.27376
---

Every team doing RL post-training hits the same wall: each new domain expert forces you to re-consolidate the whole model through weight merging or multi-teacher distillation, and that re-merge quietly erodes capabilities you never touched. [CSPD](https://arxiv.org/abs/2611.27376) takes a different route — freeze the pre-RL backbone, distill each RL expert into its own soft prompt, then compose experts by concatenating prompts with no joint retraining.

- 🎯 A single soft prompt recovers at least 90% of a teacher's gain in 22 of 23 math, code, and agent settings — surprising mileage for input-space adaptation alone.
- ⚡ Serving overhead stays within 1.5% of the unadapted backbone and hits ~2.4x the throughput of rank-4 LoRA — the number that actually moves a latency budget.
- 🧩 Prompts compose: the full stack matches multi-teacher on-policy distillation (67.83 vs 67.79) and generalizes better across six held-out benchmarks.
- 🔍 The real promise is continual post-training on a fixed backbone — add an expert without a full regression sweep across everything else. Details on the [HF paper page](https://huggingface.co/papers/2611.27376).
- ⚠️ The catch: 23 composed experts in a paper is not 200 in a serving fleet. Prompt concatenation has to interfere eventually, and this work can't tell you where.

If adding a new agent-domain expert becomes a composable prompt instead of a weight re-merge every sprint, how much of your eval-regression budget disappears — and how much of it just migrates into testing cross-prompt interference instead?
