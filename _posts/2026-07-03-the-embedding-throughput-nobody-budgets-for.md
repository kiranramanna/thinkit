---
layout: post
title: "The Embedding Throughput Nobody Budgets For"
date: 2026-07-03 14:05:54 +0000
categories: [rag, ai-infrastructure, llm-ops]
hn_id: 48770477
hn_url: https://news.ycombinator.com/item?id=48770477
source_url: https://manticoresearch.com/blog/onnx-embeddings-speedup/
---

RAG conversations obsess over retrieval quality — rerankers, hybrid search, chunk
strategy — and quietly ignore the step that dominates wall-clock during ingest:
turning text into vectors. Manticore's engineering log on
[rebuilding their ONNX embedding path](https://manticoresearch.com/blog/onnx-embeddings-speedup/)
is a clean reminder that embedding throughput is a real ops bottleneck, not a
solved primitive. Same model, same weights, ~14× faster — from ~5-11 docs/sec up
to 70-230 — purely by changing how inference runs.

The part worth internalizing is *where* the speed came from:

- 🔍 **The model didn't change** — MiniLM, BGE, E5 stayed put. The win was the runtime, not the weights.
- ⚡ **Their old path serialized on a single model session**, so concurrent calls queued behind each other. Adding cores did nothing until that lock was gone.
- 🎯 **Swapping SentenceTransformers/Candle for ONNX Runtime** unlocked the CPU that was sitting idle on a "cheap 16-core" box.
- 📊 **The advantage held from 1 thread to 32** — meaning the bottleneck was concurrency architecture, not raw compute.

This maps directly onto production RAG pain. Your first full index of a corpus,
or any re-embed after a model swap, is gated by embedding rate — and if that path
serializes internally, your latency budget and your cluster sizing are both built
on a lie. Most teams never measure docs/sec under concurrency; they measure a
single-request latency and multiply, which is exactly the mistake this post
exposes. The [HN discussion](https://news.ycombinator.com/item?id=48770477) has
the usual "just use a GPU" replies, but the more useful lesson is cheaper: profile
your embedding path under load before you reach for hardware.

When did you last benchmark your embedding throughput at real concurrency — or
are you still multiplying a single-doc number and hoping?
