---
layout: post
title: "When a 125B Model Fits on a Single Gaming GPU"
date: 2026-10-05 03:07:42 +0000
categories: [llm-ops, ai-infrastructure]
source: hn
source_id: "49953495"
discussion_url: https://news.ycombinator.com/item?id=49953495
source_url: https://github.com/Niko1221/Strata
---

The headline — 125B parameters at 100 tokens/sec on a single RTX 4090 — is doing a lot of work. [Strata](https://github.com/Niko1221/Strata) runs Qwen 3.8 Flash Next, and what makes it fit isn't miracle compression; it's that the model is a sparse MoE with roughly 6B active parameters per token. 4-bit weights plus custom kernel scheduling keep the resident set inside 24GB. The interesting engineering is the scheduling, not the parameter count.

- 🎯 **"125B" is a framing choice** — active params per token set your latency and KV-cache budget, not the total.
- ⚡ **4-bit quantization is the enabler**, and it's also the first thing to measure: long-context reasoning is where it bites.
- 🔍 **Throughput is config-bound** — the same build swings widely across 3090/4080/4090, so a single peak number tells you little.
- 📊 **This reframes "local" cost** — if a 24GB card serves a 125B-class model at interactive speeds, the on-prem-vs-API math shifts for latency-sensitive workloads.
- ⚠️ **Quantized MoE needs its own eval** — per-expert degradation hides inside aggregate perplexity.

The [HN discussion](https://news.ycombinator.com/item?id=49953495) has the usual throughput one-upmanship, which is exactly why reproducibility matters more than the peak figure.

That skepticism is the dominant note across the coverage. [DEV](https://dev.to/wiaia/what-125b-parameters-at-100-toks-on-one-gpu-costs-to-reproduce-del) argues the 100 tok/s headline collapses once cooling, power stability, quantization choices, and memory fragmentation enter the picture. [Developers Digest](https://www.developersdigest.tech/blog/qwen-3-8-flash-next-strata-run-locally-2026) is blunter — the 100 figure is an estimate and the 124 tok/s claim is a single unverified report, with measured speeds landing between 53 and 94 depending on quantization. [PromptZone](https://www.promptzone.com/arlo_girard/strata-runs-qwen-125b-on-rtx-4090-at-100ts-550d) is the most upbeat, calling it worth testing while noting throughput drops on 3090/4080 cards and that 4-bit costs real accuracy on long-context work. The trend is consistent: everyone agrees the feat is real, and almost no one expects the headline number to survive contact with a second machine.
