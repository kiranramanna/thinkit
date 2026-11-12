---
layout: post
title: "When the Corpus Holds Still, Retrieval Gets a Shortcut"
date: 2026-11-12 03:06:20 +0000
categories: [rag, ai-infrastructure, llm-ops]
source: hn
source_id: "50455633"
discussion_url: https://news.ycombinator.com/item?id=50455633
source_url: https://machinelearning.apple.com/research/faster-retrieval
---

Most of the latency teams obsess over in a RAG pipeline sits in reranking and generation. Retrieval gets a pass because approximate nearest-neighbor indices are "fast enough." Apple's [Faster Retrieval work](https://machinelearning.apple.com/research/faster-retrieval) is interesting precisely because it attacks the part nobody budgets for, and it does so by exploiting a structural quirk of RAG: your short user question and your long curated passage live in very different regions of the embedding space, so centroid routing — which quietly assumes queries look like keys — spends its compute in the wrong place.

The move is to learn the routing offline. SupportNet trains a small input-convex network to score all IVF clusters at once; KeyNet goes further and rewrites the query into the predicted best-matching key before it ever touches a FAISS index. The reported numbers are the kind that matter operationally rather than on a leaderboard: 95% routing recall at ~1.9x less time, and up to ~8x faster to reach 99% recall on Natural Questions. That's a P99 story, not a model-quality one.

Here's the catch I'd flag before anyone ports this into production. The whole scheme amortizes over a *fixed* key database and a query distribution known in advance. Fine for a static corpus; a landmine for the RAG systems I actually operate, where documents are ingested continuously and the key database is never still. The authors are honest about it and claim robustness to mild drift, but don't quantify what happens when you re-index nightly. The [HN discussion](https://news.ycombinator.com/item?id=50455633) keeps circling the same nerve.

So the real eval isn't recall on a frozen corpus. It's the amortized cost of retraining these routers every time the corpus moves — and whether the P99 win survives it.
