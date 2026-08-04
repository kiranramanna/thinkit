---
layout: post
title: "A 304B Model on One GPU Is a Serving Story"
date: 2026-08-04 14:06:21 +0000
categories: [llm-ops, ai-infrastructure]
hn_id: 49166386
hn_url: https://news.ycombinator.com/item?id=49166386
source_url: https://github.com/ryanzhou/deepseek-v4-flash-mi300x
---

Fitting all 304B parameters of DeepSeek V4 Flash into a single MI300X's 192GB of
HBM without quantization is the headline of
[this repo](https://github.com/ryanzhou/deepseek-v4-flash-mi300x), but it's the
least interesting number in it. Memory capacity is a spec-sheet win. The serving
economics underneath are where the actual engineering is.

- 🎯 **Single-stream decode at 168 tok/s, but 542 tok/s aggregate across 8
  concurrent streams** — the per-request latency you demo is not the throughput
  you bill for. That gap is the whole capacity-planning conversation.
- ⚡ **Hybrid KV: 20GB fp8 GPU cache plus a 96GB CPU offload tier.** The offload
  is what buys 256K context without a second GPU, and it's also the first thing
  that will bite you under burst load.
- 🔍 **Speculative decoding (DSpark-7) is doing quiet work** — a lot of that
  single-stream number is drafting, which means throughput is sensitive to how
  well the draft distribution matches your real traffic.
- ⚠️ **"Correctness overlays for pinned ROCm nightly, fixes not yet upstream in
  vLLM."** Translation: this is real, it works, and it is one dependency bump
  from not working. On AMD that footnote is the roadmap.

None of this shows up in a benchmark table, which is exactly why single-GPU
serving posts are worth reading closely. The [HN discussion](https://news.ycombinator.com/item?id=49166386)
is mostly about whether MI300X is finally viable for inference — the more useful
question is whether that 168-to-542 concurrency curve holds at your P99, or
collapses the moment the offload tier starts thrashing.
