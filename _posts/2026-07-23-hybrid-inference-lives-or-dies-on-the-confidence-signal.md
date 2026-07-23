---
layout: post
title: "Hybrid Inference Lives or Dies on the Confidence Signal"
date: 2026-07-23 03:03:13 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 49010782
hn_url: https://news.ycombinator.com/item?id=49010782
source_url: https://github.com/cactus-compute/cactus-hybrid
---

"Know when it's wrong" is the quiet unlock in hybrid inference — and Cactus Hybrid ([repo](https://github.com/cactus-compute/cactus-hybrid)) makes the case that the confidence signal, not the small model, is the hard part.

- 💡 **The probe beats the obvious baseline**: trained probes on hidden states hit 0.814 mean AUROC at flagging wrong answers, versus 0.549 for token entropy — entropy is barely better than a coin flip.
- 🎯 **Confidence becomes a routing key**: below a 0.85 threshold the query escalates to a bigger model; above it, the on-device Gemma 4 E2B answers locally.
- ⚡ **The economics follow the calibration**: routing only 15–35% of queries to Gemini 3.1 Flash-Lite, the hybrid matches Flash-Lite on most benchmarks while keeping the majority on-device.
- 🔍 **Cross-modal transfer is the surprise**: the probe scores audio at 0.79–0.88 AUROC with zero audio training data — it's reading uncertainty in the representations, not the surface tokens.
- ⚠️ **The threshold is a governance dial**: 0.85 is a product decision about cost, latency, and how much confidently-wrong you tolerate — the kind of knob that belongs in an eval harness, not hardcoded as a constant.

This is the agentic routing/fallback pattern most teams bolt on with a second LLM call to "check the answer." A calibrated in-model probe is cheaper and lives where the hidden states already are. The [HN discussion](https://news.ycombinator.com/item?id=49010782) is bullish; my question is operational — how stable is that 0.85 line as the input distribution drifts away from what the probe was trained on?
