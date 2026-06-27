---
layout: post
title: "Vector Search Speedups Hiding in Cache Lines and AVX-512"
date: 2026-06-27 14:07:01 +0000
categories: [rag, ai-infrastructure, llm-ops]
hn_id: 48682243
hn_url: https://news.ycombinator.com/item?id=48682243
source_url: https://medium.com/@s_nikolaev/faster-knn-search-in-manticore-2-pass-hnsw-batched-distances-and-avx-512-b85604647aab
---

The retrieval side of RAG gets less attention than rerankers, but the HNSW inner
loop is where a surprising amount of latency hides — and it's memory-bound, not
compute-bound. The [Manticore writeup](https://medium.com/@s_nikolaev/faster-knn-search-in-manticore-2-pass-hnsw-batched-distances-and-avx-512-b85604647aab)
is a clean tour of squeezing the same index harder without touching recall.

The core observation: textbook HNSW walks neighbors one at a time — visit, fetch
the vector, compute distance, update the candidate set — so the CPU stalls on
memory it can't prefetch in time. The fixes are all about feeding the cache and
the SIMD units, not changing the graph.

- 🔍 **Two-pass neighbors**: pass one collects unvisited neighbors and fires
  prefetch hints; pass two scores the batch once the data has landed in cache.
- ⚡ **Compile-time distance specialization**: C++ templates inline the distance
  function so the hot loop loses the indirect-call and branch-prediction tax.
- 📊 **Batched distances**: score two candidates at once, reusing the loaded
  query vector instead of refetching it.
- 🎯 **AVX-512 path** with runtime CPU detection: 16 floats per iteration versus
  8 on AVX2, picked automatically.
- 💡 **The results**: on 1M × 1536-dim vectors, +0.5% to +29% single-thread and
  +22–24% at 16 threads, concentrated at high k — no API change, no index rebuild.

That high-k detail is the part worth internalizing for RAG. You usually want a
wider candidate set before reranking for recall's sake, and high k is exactly
where distance computation dominates and these gains show up. The
[HN discussion](https://news.ycombinator.com/item?id=48682243) has the usual
"why not just use a GPU index" replies — but most production hybrid-search stacks
are still CPU-bound on exactly this loop.

When was the last time you profiled your ANN search as a memory-access problem
rather than reaching for a bigger box?
