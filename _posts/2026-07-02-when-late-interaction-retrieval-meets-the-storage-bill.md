---
layout: post
title: "When Late Interaction Retrieval Meets the Storage Bill"
date: 2026-07-02 14:06:40 +0000
categories: [rag, ai-infrastructure, llm-ops]
hn_id: 48724127
hn_url: https://news.ycombinator.com/item?id=48724127
source_url: https://www.mixedbread.com/blog/asymmetric-quant
---

Late interaction retrieval keeps getting recommended as if the storage cost were someone else's problem. It isn't. Moving from one dense vector per document to hundreds or thousands of token-level vectors buys real precision and blows up your object-storage bill faster — and at billion-document scale that second number is the one that kills the project. The [asymmetric quantization writeup from Mixedbread](https://www.mixedbread.com/blog/asymmetric-quant) is a clean take on the tradeoff: keep query vectors at full precision, store document vectors as binary signs, and score across the mismatch. They report 32x smaller document storage — 393 KiB down to roughly 12 KiB per document — while NDCG@10 barely moves, 89.65 versus 90.26 for fp32. The asymmetry is the whole point: you pay full precision only on the side you compute per query, not the side you persist billions of times.

What makes this an operational insight and not a benchmark curiosity is that storage bytes don't just hit the invoice. They set shard cold-start time and decide how many bytes every query has to drag out of the slow tier before it can rank. I've watched retrieval systems where the embedding footprint quietly dictated the latency budget, and no amount of reranker tuning rescues a system that's IO-bound on cold vectors.

The catch nobody benchmarks: binary document vectors are near-lossless on their eval suite, not yours. NDCG@10 on a public suite says nothing about whether collapsing to sign bits erases the one distinction your domain actually depends on. If your eval harness can't measure that, 32x cheaper storage is just 32x cheaper wrong answers.

The [HN thread](https://news.ycombinator.com/item?id=48724127) has the predictable "why not just use a smaller dense model" pushback, which misses that late interaction buys a precision a single small vector can't. The real question is whether asymmetric quant becomes the default the way binary rerank did — or whether teams keep paying fp32 rent because measuring the quality loss is harder than paying for the storage. Which side are you on?
