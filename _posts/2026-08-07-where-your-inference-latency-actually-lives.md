---
layout: post
title: "Where Your Inference Latency Actually Lives"
date: 2026-08-07 03:08:19 +0000
categories: [llm-ops, ai-infrastructure]
source: hn
source_id: "49202852"
discussion_url: https://news.ycombinator.com/item?id=49202852
source_url: https://www.aleksagordic.com/blog/vllm
---

Most "how inference works" explainers stop at paged attention and call it a day. [Aleksa Gordić's Inside vLLM](https://www.aleksagordic.com/blog/vllm) doesn't — it walks the V1 engine from the scheduler down through continuous batching, chunked prefill, prefix caching, speculative decoding, and disaggregated prefill/decode, then keeps going into multi-GPU execution and the serving layer. It's the rare writeup that treats the serving scaffolding as a first-class system, not an afterthought bolted onto a model.

That framing is what makes it useful for anyone running LLMs behind an SLA. When you're chasing a P99 latency budget, the interesting decisions aren't in the model — they're in the scheduler: how continuous batching evicts a finished request and slots the next one at token granularity, how prefix caching changes your effective throughput, whether chunked prefill is quietly starving your decode step. The post grounds all of it in a real commit and actual code paths, so it reads like a map of where your latency is going rather than a conceptual sketch.

The detail I appreciated most is that it's honest about scope — V1 only, one pinned commit, with the deprecated V0 mentioned just for context on how the design evolved. That's the right call. Inference engines move fast enough that a pinned-commit walkthrough ages better than a hand-wavy overview. The [HN discussion](https://news.ycombinator.com/item?id=49202852) has the usual SGLang-vs-vLLM throughput debates worth skimming.

If you operate inference in production, which subsystem has cost you the most unexpected latency — the scheduler, the KV cache, or the serving layer sitting in front of both?
