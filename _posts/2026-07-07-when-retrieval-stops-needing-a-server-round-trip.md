---
layout: post
title: "When Retrieval Stops Needing a Server Round-Trip"
date: 2026-07-07 14:04:30 +0000
categories: [rag, ai-infrastructure, llm-ops]
hn_id: 48811644
hn_url: https://news.ycombinator.com/item?id=48811644
source_url: https://ternlight-demo.vercel.app/
---

[Ternlight](https://ternlight-demo.vercel.app/) ships a 7 MB embedding model that runs in the browser on CPU — and the size is the least interesting part. What it changes is where the retrieval boundary sits.

- 🎯 **The embed step is usually a network hop.** Most RAG pipelines call an embedding API to turn the query into a vector. Ternlight does it locally in ~5 ms, so the query never leaves the device.
- ⚡ **Ternary (BitLinear) weights are why it fits.** This is 1.58-bit quantization showing up in a shippable artifact, not a paper — engine plus weights under 7 MB, with a 5 MB mini tier.
- 🔍 **Query-side privacy comes for free.** If the embedding happens client-side, the user's raw query text isn't in your logs or a vendor's. That's a real governance win for regulated deployments.
- 📊 **It reframes cost.** At scale, per-query embedding-API calls are a line item. Zero-network embeddings move that to the client — you pay in bundle size once, not per request.
- ⚠️ **It's only half the RAG loop.** You still need the document vectors somewhere, and a 5 MB model won't match a full cross-encoder or a large embedder on hard retrieval. This is a first-stage recall tool, not a reranker.

The npm-install-and-go demo is genuinely three lines, and the [HN discussion](https://news.ycombinator.com/item?id=48811644) gets into recall tradeoffs versus server-side models. My question: what's the smallest embedder that still holds R@10 on your corpus — because "runs in a browser tab" is worthless if it can't find the right chunk?
