---
layout: post
title:  "The 1000-TPS Model and the Latency-Budget Math"
date:   2026-06-09 14:09:48 +0000
categories: [llm-ops, ai-infrastructure, industry]
hn_id: 48446639
hn_url: https://news.ycombinator.com/item?id=48446639
source_url: https://mimo.xiaomi.com/blog/mimo-tilert-1000tps
---
**The 1000-TPS Model and the Latency-Budget Math**

[Xiaomi's MiMo-V2.5-Pro-UltraSpeed](https://mimo.xiaomi.com/blog/mimo-tilert-1000tps) claims roughly 1000 tokens/s decode on a trillion-parameter model, built with a serving stack called TileRT. The benchmark is the headline. The pricing line is the actual story: 3x the cost for about 10x the speed. Speed is being sold as its own SKU, decoupled from model quality.

That decoupling is what matters if you operate agents rather than chatbots. Decode latency compounds — every tool call, every retry, every reflection step pays it again. Shaving P99 decode in a twelve-hop agent loop buys far more than it does in a single chat turn, which is exactly why a serving team would pay a premium for a separate speed tier.

- ⚡ **Speed as a SKU**: 3x price, ~10x throughput — the serving stack, not the weights, is the differentiated product.
- 🎯 **Latency compounds in agents**: throughput gains multiply across hops; a single chat turn barely notices them.
- 📊 **Measure end-to-end**: tokens/s in isolation lies — what counts is wall-clock per completed task under your real eval harness.
- ⚠️ **Capacity, not GA**: application-gated, enterprise-prioritized, a two-week trial window. That's a supply story dressed as a launch.

The [HN thread](https://news.ycombinator.com/item?id=48446639) is busy arguing benchmark methodology, but the durable shift is the pricing axis. My prediction: within a year, a "fast tier" stops being a vendor gimmick and becomes a standard line item next to context window and token price — you'll provision decode speed the way you provision RAM. Would you pay 3x for 10x on your hottest path?
