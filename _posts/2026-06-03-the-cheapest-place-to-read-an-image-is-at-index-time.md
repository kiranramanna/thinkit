---
layout: post
title: "The Cheapest Place to Read an Image Is at Index Time"
date: 2026-06-03 03:03:59 +0000
categories: [rag, llm-ops]
hn_id: 48372239
hn_url: https://news.ycombinator.com/item?id=48372239
source_url: https://www.kapa.ai/blog/how-we-index-images-for-rag
---

The interesting decision in kapa's [writeup on indexing images for RAG](https://www.kapa.ai/blog/how-we-index-images-for-rag) is what they *don't* do: no images go to the model at query time. They describe each image once, during indexing, with a cheap vision model, store the description as text, and retrieve it next to ordinary chunks. Per-query overhead lands at 1-6% over text-only, and the answer-quality lift is statistically significant.

That tradeoff matches what I keep relearning in production retrieval: the expensive work belongs at index time, where you pay once and amortize, not in the per-query hot path where it taxes every request and your P99. Multimodal RAG that pipes screenshots through a vision model on every query demos beautifully and quietly wrecks your latency budget at scale.

The part worth stealing is their split between *illustrative* and *load-bearing* images. Most diagrams just restate the surrounding text more clearly; a few — a wiring diagram, a spec table, a config screenshot — hold the answer and live nowhere else. If your eval harness doesn't separate those two cases, you can't tell whether a generated description is decorative or carrying the only copy of a fact, and you'll tune for the wrong images. The [HN thread](https://news.ycombinator.com/item?id=48372239) has the predictable "why not just send the image" pushback, which misses that the cost here isn't accuracy, it's the per-query bill.

So the question I'd put to anyone running multimodal retrieval: have you actually measured the load-bearing fraction of your images, or are you paying vision-model latency on every query to cover the 5% that genuinely need it?
