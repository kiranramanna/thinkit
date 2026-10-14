---
layout: post
title: "The Vector Index Pain Was Never Recall, It Was RAM"
date: 2026-10-14 14:08:46 +0000
categories: [rag, ai-infrastructure, llm-ops]
source: hn
source_id: "50086165"
discussion_url: https://news.ycombinator.com/item?id=50086165
source_url: https://github.com/timescale/pg_vectorsearch
---

Production RAG teams rarely struggle with HNSW's recall — they struggle with
what HNSW costs to keep resident in memory and to rebuild.
[pg_vectorsearch](https://github.com/timescale/pg_vectorsearch) is Timescale's
bet that an IVF-style partitioned index plus aggressive quantization buys you
the same recall for a fraction of the RAM.

- 🎯 **PRISM is IVFFlat-shaped, not a graph** — a hierarchical centroid tree
  partitions vectors and stays warm in the Postgres buffer cache, so a query
  scans posting lists instead of walking an HNSW graph.
- ⚡ **RaBitQ quantization does the heavy lifting** — vectors are bit-quantized
  with error bounds that let the search skip candidates that can't be nearest
  neighbors, reranking only the survivors against full-precision vectors.
- 📊 **The headline claim is memory, not just speed** — faster than HNSW at
  equivalent recall on a 100M-vector set, on an instance with a quarter of the
  memory. That ratio is the whole pitch.
- 🔍 **One knob to reason about** — `prism.nprobe` trades recall for speed, and
  the default auto-targets ~0.95 recall, which is a sane place to start an eval.
- 🔧 **It indexes your existing pgvector columns in place** — `vector` and
  `halfvec` work as-is, so you can benchmark it against your current
  IVFFlat/HNSW setup without reshaping the schema.
- ⚠️ **It's alpha** — "meant for testing, not production," PostgreSQL 18+ only,
  and prerelease upgrades may force a drop-and-recreate. Keep it off your prod
  retrieval path for now.

The [HN discussion](https://news.ycombinator.com/item?id=50086165) is already
circling the real question: does RaBitQ's recall hold on your embeddings, or
only on the benchmark's? That's exactly what I'd want a retrieval eval harness
to answer before I trust any quantized index in the loop.
