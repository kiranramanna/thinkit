---
layout: post
title: "A Wall-Clock Leaderboard for LoRA Fine-Tuning"
date: 2026-07-20 14:04:05 +0000
categories: [llm-ops, ai-infrastructure, research]
hn_id: 48974325
hn_url: https://news.ycombinator.com/item?id=48974325
source_url: https://github.com/Saivineeth147/lora-speedrun
---

Most fine-tuning benchmarks race accuracy and let time float. [LoRA Speedrun](https://github.com/Saivineeth147/lora-speedrun) inverts it: freeze the model, the GPU, and a target accuracy, then race the wall clock to get there. The framing question — how fast can you fine-tune Qwen2.5-1.5B to ≥57% on GSM8K on a single L40S — is the one that actually shows up in a fine-tuning budget, not the one that shows up in a paper.

- 🎯 **The bar is fixed, the clock is the score.** Adapter-only (≤30M trainable params), one L40S, hit the accuracy floor — everything after that is optimization, not modeling.
- ⚡ **The current Track 1 record is 6m05s at 61.1%**, against an 11m57s baseline — a 49% cut from `sequence packing + completion-only loss masking`, not a bigger model.
- 📊 **Two frozen tracks** keep it honest: Qwen2.5-1.5B on GSM8K, and SmolLM2-1.7B on SQuAD (11m08s, 77.5%). Same hardware, same target, reproducible.
- 🔍 **The unclaimed ideas are the interesting column** — DoRA/PiSSA, data pruning, curriculum, Liger/Unsloth kernels — a public backlog of "who can shave the next minute."
- 💡 **This is an LLM-ops artifact, not a research one.** When you're fine-tuning adapters on a schedule, cost-to-target is the metric that hits the invoice; accuracy is just the gate.

What I like is that it makes the boring wins legible. Loss masking and packing rarely make a paper, but they're exactly what moves your fine-tune from an overnight job to a coffee break — and that's a real SLA when adapters ship on a cadence. The [HN thread](https://news.ycombinator.com/item?id=48974325) is already arguing about whether wall-clock leaderboards just reward kernel golf. Maybe. But kernel golf is half of what LLM ops actually is. Would your fine-tuning pipeline survive being scored on the clock instead of the curve?
