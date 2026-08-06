---
layout: post
title: "Post-Training a 4B Model Beats Frontier Retrieval on Cost"
date: 2026-08-06 03:03:55 +0000
categories: [rag, llm-ops, agentic-ai]
hn_id: 49186762
hn_url: https://news.ycombinator.com/item?id=49186762
source_url: https://neon.com/blog/how-castform-neon-beats-frontier-models-on-price-and-efficiency
---

The interesting part of [Castform's retrieval result](https://neon.com/blog/how-castform-neon-beats-frontier-models-on-price-and-efficiency) isn't that a 4B open-weights model matched GPT-5.6-Sol on agentic search — it's how cheaply it got there. RL post-training on synthetic Q&A generated from a company's own docs and support records, no ML team required, and the per-request cost lands about 100x under the frontier baseline (a multi-turn search on the frontier model runs >10s and ~$0.03 end-to-end).

That reframes a decision I watch teams get wrong constantly. In production RAG, the frontier model is rarely the retrieval bottleneck — the retrieval policy is. Once you can cheaply teach a small model to plan multi-step search over *your* corpus, the economics of "just call the biggest model" fall apart. You're paying frontier prices for a task that's mostly about knowing your own index.

The catch is the eval, as always. "Matched frontier accuracy" only means something if the synthetic Q&A distribution reflects real user queries — and synthetic-from-your-docs data has a way of flattering the model that generated it. I'd want held-out human queries and a hard-negative story before I ripped out the frontier fallback.

Still, the direction is right. The [HN thread](https://news.ycombinator.com/item?id=49186762) has the predictable "but will it generalize" pushback, which is fair — except generalization was never the goal. Narrow, cheap, and yours beats broad, expensive, and rented for most retrieval workloads.

If a 4B model post-trained on your own data closes most of the frontier gap at a fraction of the cost, what's the real argument for keeping the frontier model in the retrieval loop — latency insurance, or habit?
