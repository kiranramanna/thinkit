---
layout: post
title: "The Granularity Mismatch Hiding in Multi-Hop RAG"
date: 2026-09-02 03:03:48 +0000
categories: [rag, knowledge-graphs, research]
source: hf-papers
source_id: "2608.30468"
discussion_url: https://huggingface.co/papers/2608.30468
source_url: https://arxiv.org/abs/2608.30468
---

Most multi-hop RAG failures I've debugged trace back to one mismatch: the question is phrased at one level of granularity, and the evidence lives at another. You ask something that implies two hops, but your chunks only answer half a hop at a time, so retrieval either overshoots or returns confident-looking garbage. [Hi-Q](https://arxiv.org/abs/2608.30468) names this directly, calling it "retrievable granularity discovery," and that framing is more useful than the method itself.

The mechanism is a query tree that grows based on corpus support, not a fixed decomposition template or a pre-built graph. At each node a resolution operator asks whether the retrieved evidence already supports this query unit. If yes, the node terminates. If not, it splits with a dependency-preserving operator, and a semantic coverage verifier checks the expansion. The topology is decided by what the corpus can actually answer, which is the opposite of the usual decompose-first-retrieve-second pipeline that commits to a plan before it knows whether the evidence exists.

The result I care about is the full-corpus number: 52.3 EM averaged across three benchmarks with open-domain distractors, ahead of IRCoT by 15 EM and beating the graph-based PropRAG *without* building a corpus-wide graph. In production, that graph-construction step is exactly the cost that kills KG-enhanced retrieval for large, churning corpora, since you can't rebuild the graph every time documents change. An evidence-conditioned tree you grow at query time sidesteps that. The [HF paper page](https://huggingface.co/papers/2608.30468) has the benchmark breakdown. If your multi-hop eval only tests the supporting-passage setting, you're measuring the easy half: how does it hold up when the distractors are your whole index?
