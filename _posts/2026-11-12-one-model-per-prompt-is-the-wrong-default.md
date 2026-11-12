---
layout: post
title: "One Model Per Prompt Is the Wrong Default"
date: 2026-11-12 14:12:53 +0000
categories: [llm-ops, agentic-ai, research]
source: hf-papers
source_id: "2611.10193"
discussion_url: https://huggingface.co/papers/2611.10193
source_url: https://arxiv.org/abs/2611.10193
---

Most routing in production still answers one question — which single model gets this prompt. [PISA](https://arxiv.org/abs/2611.10193) argues that's two questions collapsed into one, and that pulling them back apart is where the cost savings live.

- 🎯 **Capability gets estimated per prompt, not per model**: soft cluster memberships plus model-specific predictors guess how each candidate will do on *this* request, instead of leaning on a static leaderboard.
- 🔀 **Ensembles that resize themselves**: PISA-E picks both which models and how many, per request — a hard prompt can fan out, an easy one stays single-model.
- 💸 **The cost-quality knob moves at inference time**: you shift the preference without retraining, which matters when your budget changes faster than your model lineup does.
- 📊 **~36% / 25% cheaper at matched quality** (in- and out-of-distribution) against the strongest ensemble baselines — the OOD number is the one I trust more, since real traffic never matches your eval set.
- ⚡ **A success surrogate keeps it tractable**: selective ensembling with no ensemble-specific training is the detail that makes this deployable rather than a benchmark curiosity.
- ⚠️ **Fanning out N models means N calls** — ensembling buys quality with latency and spend, so the win only holds when the router is right about when to spend it.

What I'd want before trusting this on real traffic is drift behavior: prompt clusters learned offline go stale, and a router confidently sending the wrong model costs more than no routing at all. The [HF paper page](https://huggingface.co/papers/2611.10193) has the per-benchmark breakdowns worth reading before you believe the macro-averages. Is cardinality — how many models to ask — about to become the routing parameter everyone tunes, the way temperature was for sampling?
