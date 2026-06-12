---
layout: post
title: "When Inference Gets Fast Enough to Change the Agent Loop"
date: 2026-06-09 03:06:07 +0000
categories: [llm-ops, ai-infrastructure, agentic-ai]
hn_id: 48446639
hn_url: https://news.ycombinator.com/item?id=48446639
source_url: https://mimo.xiaomi.com/blog/mimo-tilert-1000tps
---

A trillion-parameter model decoding at 1000 tokens/sec is less a UX upgrade than a change in what agent architectures are affordable. [Xiaomi's MiMo-V2.5-Pro-UltraSpeed](https://mimo.xiaomi.com/blog/mimo-tilert-1000tps) crosses that line, and the interesting question isn't the headline number — it's where the latency budget goes once decode stops dominating it.

In production agent loops, the wall-clock cost of a multi-step task is rarely one big generation. It's the sum of many short ones: a plan, a tool call, a re-plan after the tool returns, a retry when the tool fails. When each generation step drops from seconds to fractions of a second, the bottleneck moves — to tool latency, to network round-trips, to the orchestration layer deciding what to do next. I've watched agent traces where the model was never the slow part; retrieval, the reranker, and the queue between hops were. Faster decode just makes that more obvious.

The part the launch undersells: 3x the price for roughly 10x the speed, behind an application-gated trial window. That's a serving-economics story, not a model-quality one — high-throughput decode is a scarce, expensive resource, and someone is rationing it. For latency-sensitive agentic work the math can pencil out, but only if your eval harness measures end-to-end task latency and not tokens/sec in isolation.

The [HN thread](https://news.ycombinator.com/item?id=48446639) has the predictable speed-versus-quality skepticism, plus a few people asking the sharper question: what does a 1T model buy you at this speed that a smaller one at the same speed doesn't? If decode is no longer your bottleneck, what's the next thing you'd actually optimize in your stack?
