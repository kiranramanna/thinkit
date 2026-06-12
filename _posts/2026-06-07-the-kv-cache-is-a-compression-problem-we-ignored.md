---
layout: post
title:  "The KV Cache Is a Compression Problem We Ignored"
date:   2026-06-07 14:05:16 +0000
categories: [ai-infrastructure, llm-ops, research]
hn_id: 48400151
hn_url: https://news.ycombinator.com/item?id=48400151
source_url: https://fergusfinn.com/blog/kv-entropy-coder/
---
**The KV Cache Is a Compression Problem We Ignored**

Every long-context serving stack pays the same tax: the KV cache grows linearly with sequence length, and the moment it spills past HBM you start paging, evicting, or rejecting requests. The usual responses are quantization and eviction — both trade a little accuracy for memory. The move in [Fergus Finn's writeup](https://fergusfinn.com/blog/kv-entropy-coder/) is to stop treating that as the only option and treat the cache as a compression problem instead, losslessly.

The mechanism is speculative. A small predictor model guesses the KV entries, and you entropy-code only the residual between the prediction and the real values. Because the residual is exact, decompression reconstructs the cache bit-for-bit — there's no accuracy regression to defend in your eval harness, which is the part that makes quantization a recurring argument. The headline is ~4× on the cache, and because it's orthogonal to quantization, it stacks on top rather than competing with it.

The honest question for production isn't whether 4× is real — it's where the predictor runs and what it costs. Adding a forward pass to compress the cache only pays off when you're memory-bound, and a lot of high-QPS serving is compute-bound at the margin. But flip to long-context, lower-QPS workloads — document-grounded RAG over large corpora, agents replaying long histories — and the arithmetic inverts. There the cache is the binding constraint, and lossless 4× reads like free context headroom. The [HN discussion](https://news.ycombinator.com/item?id=48400151) is already circling the right concern: the predictor's own latency and memory footprint.

My bet: lossless cache compression shows up as an opt-in flag in a major serving runtime before this time next year, and once it's a flag, KV quantization starts looking like the fallback rather than the first reach. Which constraint is actually binding your serving today — the matmuls, or the memory holding the cache?