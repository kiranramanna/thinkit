---
layout: post
title: "The 48B That Matters More Than LongCat's 1.6T"
date: 2026-06-30 14:08:34 +0000
categories: [llm-ops, ai-infrastructure, agentic-ai]
hn_id: 48727116
hn_url: https://news.ycombinator.com/item?id=48727116
source_url: https://longcat.chat/blog/longcat-2.0/
---

LongCat-2.0 leads with a big number — 1.6 trillion parameters — but the number that decides whether anyone outside the lab can actually run it is the small one: roughly 48 billion active per token.

[The release](https://longcat.chat/blog/longcat-2.0/) frames this as a large-scale MoE built for coding and agentic tasks, with a "LongCat Sparse Attention" mechanism, training over 1M-context data, and an MIT license. The MIT part is the genuinely interesting move. A frontier-scale MoE with permissive licensing is rare, and it matters for anyone who'd rather own the weights than rent an endpoint and inherit its rate limits and deprecation schedule.

Two things keep me from getting excited yet. First, the weights are "coming soon," not out — and an architecture you can't load is a press release, not a tool. Second, the model card leads with capability claims for coding and agentic work but publishes no benchmark numbers I can check. For a routing or tool-use decision, "strong performance on agentic tasks" is a hope, not a measurement, until there's an eval harness behind it.

The sparse-attention claim is the part worth tracking. If LongCat's attention sparsity holds quality while cutting the KV-cache growth and latency that wreck agentic loops at long context, that's a real serving-economics win — the kind that changes what you can afford to put in production, not just what tops a leaderboard.

The [HN discussion](https://news.ycombinator.com/item?id=48727116) is already circling the same question I am: 48B active at what tokens-per-second, and at what cost per agent run?

I'll wait for the weights and a reproducible eval before routing anything to it. Predictions about a model you can't run age badly.
