---
layout: post
title: "What One GPU Actually Costs You Per User"
date: 2026-06-21 03:05:12 +0000
categories: [llm-ops, ai-infrastructure]
hn_id: 48560227
hn_url: https://news.ycombinator.com/item?id=48560227
source_url: https://injuly.in/blog/napkin-inference-cost/index.html
---

The useful thing about [this napkin-math walkthrough of inference cost](https://injuly.in/blog/napkin-inference-cost/) isn't the algebra — it's that most teams shipping LLMs in production still can't answer the question it opens with: how many users does a single GPU actually top out at? They know the monthly cloud bill. They don't know the per-token unit economics underneath it, which is exactly the number you need before you promise anyone an SLA.

The walk-through builds the cost from the matmul up: peak FLOPs, memory bandwidth, the `2NMd` accounting for a matrix product, then the part that bites in practice — the KV-cache. Decoding is memory-bandwidth bound, not compute bound, so your expensive tensor cores sit idle while you stream cached keys and values. That single fact reorders most capacity planning. The lever that moves dollar-per-user isn't a faster GPU; it's batch size and how much KV-cache you can keep resident before you spill.

This matches what I see operating LLM features at scale. The latency budget and the cost model are the same conversation — concurrency is the variable both depend on, and tokens-per-second-per-user falls off a cliff the moment your batch can't stay full. Teams that treat inference cost as a flat per-request line item get surprised at the P99; teams that reason about it the way this post does can predict where the knee is before they hit it.

The [HN thread](https://news.ycombinator.com/item?id=48560227) has the usual fights over FP8 vs FP16 and whether the napkin ignores too much, which is fair — it's a lower bound, not a quote. But a lower bound you can compute in five minutes beats a vendor estimate you can't audit. If you serve a model and can't sketch your own version of this, what are you actually budgeting against?
