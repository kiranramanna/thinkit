---
layout: post
title: "At Billion Scale, Vector Search Is an Engineering Problem"
date: 2026-06-06 03:09:00 +0000
categories: [rag, ai-infrastructure, research]
hn_id: 48398689
hn_url: https://news.ycombinator.com/item?id=48398689
source_url: https://fremaconsulting.ch/blog/faiss
---

Every RAG postmortem I've sat through eventually lands on the same realization: the embedding model was never the bottleneck — the index was. Tom Salembien's [visual walkthrough of FAISS](https://fremaconsulting.ch/blog/faiss) is a sharp reminder of why, revisiting the 2017 billion-scale GPU paper with interactive geometry instead of dense math.

The thing teams underestimate is how much of retrieval quality is decided by index engineering, not model choice:

- 🎯 **Recall is a tuning knob, not a given** — IVF cell counts and nprobe trade latency for recall, and most defaults are wrong for your data
- ⚡ **Product quantization is the real work** — compressing vectors to a few bytes is what lets a billion of them live in RAM
- 🔍 **Exact search is a trap at scale** — brute force is fine in a notebook and ruinous at 10^9 vectors
- 📊 **Eval has to measure end-to-end recall**, not cosine similarity in isolation, or you tune the wrong thing
- ⚠️ **Memory layout beats clever math** — the GPU win in the paper came from batching and coalesced reads, not a smarter algorithm

What I like about the piece is that it treats the index as a systems artifact — partitioning, quantization, memory bandwidth — which is exactly how it behaves in production once your corpus stops fitting in cache. The [HN discussion](https://news.ycombinator.com/item?id=48398689) has the usual "just use a managed vector DB" replies, and they're not wrong for small corpora — but the managed layer is FAISS-shaped underneath, and the moment you care about P99 or cost, you're back to tuning these same knobs.

So here's the contrarian bit: the rush to hosted vector databases hasn't removed this complexity, it's hidden it behind an API until your bill or your latency forces you to learn it anyway. When did an index config last cost you more recall than your embedding model did?
