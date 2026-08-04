---
layout: post
title: "Where Quantization Pays Off Isn't Where You'd Guess"
date: 2026-08-04 03:04:48 +0000
categories: [llm-ops, ai-infrastructure]
hn_id: 49158581
hn_url: https://news.ycombinator.com/item?id=49158581
source_url: https://blog.cloudflare.com/smaller-faster-safer-models/
---

The interesting result in [Cloudflare's writeup on serving Kimi K2.6 and GLM 5.2](https://blog.cloudflare.com/smaller-faster-safer-models/) isn't how much memory they saved. It's that quantization helped in exactly one half of the inference loop and hurt in the other — so the right answer wasn't a single "quantized" checkpoint.

- 🎯 **FP8 KV cache** halved cache size and pushed Kimi's usable context from ~686K to ~1.37M tokens — decode hit 2,192 tokens/sec, about 41% over BF16, at roughly 30% lower cost per token at 64 concurrent requests.
- ⚡ **INT4 weights** dropped GLM's per-GPU footprint from ~88 GB to ~52 GB and sped single-concurrency decode ~55% — but *slowed* prefill, because INT4 has to expand back out to compute.
- 🔍 So they split it: **BF16 for prefill, INT4 for decode**. The numeric format follows the phase, not the model.
- 📊 Accuracy moved **under 0.8 points** on GSM8K, MMLU, and ARC-Challenge — the quality tax is basically inside the noise floor.
- ⚠️ **KV-cache integrity checks** (validating which pages and tags each request owns before decode) cost only −0.5% to −0.8% throughput — cheap enough to leave on in production.

This is the part of LLM Ops that never shows up on a model card: the win comes from matching numeric precision to the prefill/decode split, not from picking one "smaller" weight file. The [HN thread](https://news.ycombinator.com/item?id=49158581) has good skepticism about whether FP8 KV cache holds up on long-context *recall* rather than aggregate benchmarks — the right thing to be nervous about.

If your serving stack still quantizes uniformly across both phases, what is that symmetry actually costing you at P99?
