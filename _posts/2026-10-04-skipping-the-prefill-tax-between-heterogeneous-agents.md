---
layout: post
title: "Skipping the Prefill Tax Between Heterogeneous Agents"
date: 2026-10-04 14:08:55 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.32259"
discussion_url: https://huggingface.co/papers/2609.32259
source_url: https://arxiv.org/abs/2609.32259
---

Most multi-agent systems pay a tax nobody budgets for: every time one agent hands context to another, the receiver re-reads the entire shared prompt from scratch. If your planner, retriever, and coder are different models, that prefill happens again at every hop — pure duplicated compute, because the sender already encoded those exact tokens. [HeteroFold](https://arxiv.org/abs/2609.32259) asks the obvious-in-hindsight question: why ship the text when you could ship the sender's KV cache?

The reason nobody does this across model families is that it's genuinely hard — different tokenizers, different depths, different KV representations. Reusing a cache inside one model family is a linear-algebra parlor trick; doing it from Llama-3.1-8B into Ministral-3-14B means aligning structure, mapping the cache into the receiver's space, and calibrating so the receiver still behaves like itself. HeteroFold folds those corrections into fixed affine maps and keeps both models frozen, which is the part that makes it deployable — no retraining, no extra inference module sitting on the hot path.

The numbers are where I'd temper the excitement. 10.7x faster than native prefill at 32K context is a real win for long-context handoffs, but it's only 1.18–1.47x over existing prefill-free baselines, and the quality claim is "matches text-based communication," not beats it. So the honest pitch is: same answers, far less prefill — which, for a latency- and cost-bound multi-agent pipeline, is exactly the trade you want. The six transfer directions and benchmark breakdown are on the [HF paper page](https://huggingface.co/papers/2609.32259).

What I'm not sure about yet: calibration that preserves receiver behavior on benchmarks is one thing, but in an agent loop where small context errors compound across turns, does a transferred cache stay faithful at hop five — or do you eventually pay the prefill anyway to resync?
