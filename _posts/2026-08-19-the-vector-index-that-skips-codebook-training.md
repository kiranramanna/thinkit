---
layout: post
title: "The Vector Index That Skips Codebook Training"
date: 2026-08-19 03:08:20 +0000
categories: [rag, ai-infrastructure, llm-ops]
source: hn
source_id: "49349898"
discussion_url: https://news.ycombinator.com/item?id=49349898
source_url: https://github.com/RyanCodrai/turbovec
---

- 🎯 The quiet tax in production RAG is memory, and
  [Turbovec](https://github.com/RyanCodrai/turbovec) goes after it with
  Google's data-oblivious TurboQuant — a Rust index with Python bindings that
  needs no training step.
- 📊 It compresses a 1536-dim embedding 16× (6,144 → 384 bytes at 2-bit), so a
  10M-document corpus that eats 31GB as float32 fits in about 4GB of RAM.
- ⚡ Benchmarks land 3.4× faster than FAISS IndexPQFastScan at 4-bit and ~20%
  at 2-bit, on hand-written SIMD kernels (NEON on ARM, AVX-512 VNNI on x86).
- 💡 No codebook to train means vectors index on ingest with no rebuilds as the
  corpus grows, and deletes are O(1) (~1µs) instead of FAISS-style full
  repacking.
- ✅ It ships LangChain, LlamaIndex, and Haystack bindings, so it slots into an
  existing retrieval stack rather than asking you to rebuild one — the kind of
  drop-in that actually gets tried instead of admired from a distance.
- 🔍 The catch: this is a young, largely single-author project, not a
  battle-tested library — I'd run it against my own recall eval harness before
  trusting it in prod.

The [HN discussion](https://news.ycombinator.com/item?id=49349898) and the
early write-ups are running hot.
[MarkTechPost](https://www.marktechpost.com/2026/05/20/meet-turbovec-a-rust-vector-index-with-python-bindings-and-built-on-googles-turboquant-algorithm/)
frames it as a practical 16× win that beats FAISS on ARM with no codebook
training, [DuckDB Lab](https://duckdblab.org/en/post/turbovec-rust-vector-search/)
leads on the 1/8-the-RAM comparison, and
[Data Science in Your Pocket](https://medium.com/data-science-in-your-pocket/turbovec-googles-turboquant-makes-vector-search-smaller-faster-and-simpler-fdea72674aad)
keeps circling back to the training-free simplicity; even
[Search Engine Land](https://searchengineland.com/google-turboquant-algorithm-vector-search-472977)
covered the underlying TurboQuant as a genuine speed improvement. The reception
is near-uniformly positive — which, for a fresh quantization scheme, usually
means the recall-versus-compression tradeoff just hasn't been stress-tested
widely enough yet.
