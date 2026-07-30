---
layout: post
title: "Fitting a 26B Model into 2 GB by Streaming MoE Experts"
date: 2026-07-30 03:03:53 +0000
categories: [llm-ops, ai-infrastructure, research]
hn_id: 49098510
hn_url: https://news.ycombinator.com/item?id=49098510
source_url: https://github.com/drumih/turbo-fieldfare
---

TurboFieldfare runs Gemma 4 26B-A4B on an 8 GB Mac by refusing to load the model. Instead of paging all 14.3 GB of weights into DRAM, the [Swift + Metal runtime](https://github.com/drumih/turbo-fieldfare) keeps only the 1.35 GB shared core and the FP16 KV cache resident, then streams the specific experts each token needs off the SSD. The MoE structure is what makes this viable: 26B total parameters, but only ~3.88B active per token.

- 🎯 Sparsity is the lever — you never need all 26B in memory at once, only the ~2 GB of weights and KV cache for the experts firing on the current token.
- ⚡ Measured decode is 5.1–6.3 tok/s on an 8 GB M2 Air and 31–35 tok/s on a 24 GB M5 Pro — the gap is storage bandwidth and Metal throughput, not model size.
- 🔍 It's model-specific by design, not a wrapper over MLX or llama.cpp, which is how it co-optimizes the 4-bit affine quant (group 64, 8-bit router) with the streaming path.
- 📊 The repo ships 103 measured results across kernels, caching, I/O, prefill, and decode — an experiment record, not a single benchmark screenshot.
- 💡 This flips the local-inference constraint: the ceiling stops being "how much DRAM do you have" and becomes "how fast is your SSD and page cache."

The operational implication for on-device and edge inference is that expert streaming turns a memory problem into an I/O scheduling problem — prefetch the wrong experts and decode stalls. The [HN thread](https://news.ycombinator.com/item?id=49098510) has the usual "just buy more RAM" replies, which miss the point for laptops and phones where you can't.

If active-parameter count, not total size, is what a good runtime pages against, does the 8 GB laptop quietly become a viable target for frontier-class MoE models?
