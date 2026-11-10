---
layout: post
title: "Stop Running One Model for Every Stage of Your RAG"
date: 2026-11-10 14:13:03 +0000
categories: [rag, agentic-ai, research]
source: hf-papers
source_id: "2611.02810"
discussion_url: https://huggingface.co/papers/2611.02810
source_url: https://arxiv.org/abs/2611.02810
---

Most multi-agent RAG is one model wearing different hats — the same backbone prompted to retrieve, then refine, then generate. [TRIO](https://arxiv.org/abs/2611.02810), a Findings paper at EMNLP 2026, makes the more honest architectural bet: give each stage its own model and co-optimize the three against aligned-but-individual objectives, so the retriever is trained to fix *its* failure mode (inadequate retrieval) rather than to nudge the generator's loss down.

That framing matters in production because the failures in a RAG system aren't fungible. A missed document and a confident hallucination have different root causes and different owners, but a single shared backbone smears them together — you tune one thing and watch another regress. TRIO's query-refinement step, which rewrites ambiguous queries to go fetch the knowledge that's actually missing, is the piece I'd lift first: most retrieval misses I've chased were query-formulation misses, not index misses, and a stage trained specifically for that beats throwing a bigger reranker at the symptom.

The open question is operational cost. Three specialized agents mean three things to serve, evaluate, and keep from drifting apart, and the paper's win is measured on benchmarks, not against a latency budget or an on-call rotation. I'd want the eval harness that catches one agent silently degrading after the other two get retrained — that's the part that bites six months in. Skim the [arXiv abstract](https://arxiv.org/abs/2611.02810) and the [HF paper page](https://huggingface.co/papers/2611.02810), then ask the real question for anyone running retrieval at scale: does per-stage specialization pay for its own orchestration overhead, or are you better off with one well-tuned backbone and a sharper query rewriter in front of it?
