---
layout: post
title: "The Shared-vs-Dual Retriever Choice Flips as Data Grows"
date: 2026-09-30 03:14:18 +0000
categories: [rag, research, llm-ops]
source: hf-papers
source_id: "2609.32488"
discussion_url: https://huggingface.co/papers/2609.32488
source_url: https://arxiv.org/abs/2609.32488
---

Most RAG stacks make one quiet architectural decision and never revisit it: do the query and document encoders share weights, or do they each get their own projection? Teams usually pick once, early, on whatever eval set was handy that week. This paper argues that call has a crossover point — and you probably landed on the wrong side of it.

The framing is bias-variance, and it's clean. Shared projections are constrained (positive-semidefinite operators); dual projections can express arbitrary low-rank geometry but cost more parameters to estimate. So shared wins when training pairs are scarce, and dual wins once you have enough data to pay for the extra degrees of freedom — and once your query and document distributions actually diverge. The numbers make it concrete: shared takes 13 of 16 cells at n=32, while dual sweeps all cells at n=1024 and n=2048, and dual's NDCG@10 advantage more than doubles as query rotation climbs from 0° to 90°.

The artifact worth stealing isn't the theorem, it's CARS — a selector that estimates the reproducible directional signal in your own training pairs and picks the geometry for you, cutting held-out regret 49–96% against committing to either fixed choice, at ~90% selection accuracy. In production terms, your retriever's geometry should be a function of corpus size and query/document skew, not a default inherited from a tutorial. The [arXiv page](https://arxiv.org/abs/2609.32488) has the bias-variance derivation, and the [HF paper page](https://huggingface.co/papers/2609.32488) collects the experiment grids if you want to check the crossover against your own data.

The uncomfortable part: a retriever tuned when your corpus was small is silently mis-specified once it grows, and almost nobody re-runs that decision. When did you last check whether your encoders should still be sharing weights?
