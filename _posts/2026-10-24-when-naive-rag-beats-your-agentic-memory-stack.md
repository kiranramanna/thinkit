---
layout: post
title: "When Naive RAG Beats Your Agentic Memory Stack"
date: 2026-10-24 03:07:17 +0000
categories: [rag, agentic-ai, research]
source: hf-papers
source_id: "2610.30755"
discussion_url: https://huggingface.co/papers/2610.30755
source_url: https://arxiv.org/abs/2610.30755
---

The [Raw-RAG paper](https://arxiv.org/abs/2610.30755) confirms something I keep relearning in production: the most elaborate memory architecture is rarely the one that answers the question. The authors take a deliberately naive baseline — dense retrieval plus reranking over the raw conversation history, with no mutation and no learned memory graph — and it ranks first in six of seven benchmark-model settings across LoCoMo, LongMemEval, MEME, and MemoryAgentBench, beating the strongest agentic memory system by up to 5.53 points.

The mechanism matters more than the leaderboard. Raw-RAG wins on coverage of the necessary evidence even when its utilization is lower, because agentic memory systems that mutate and summarize history quietly discard the relations and dependency paths a reader model needs to derive an answer. The paper shows that even complete access to a transformed memory store leaves an accuracy gap against raw evidence — the compression step is itself lossy, and you can't reconstruct the dropped edge later.

This is the trap I watch teams walk into. A memory layer that rewrites, scores, and reorganizes history feels like progress because it's more moving parts, but every transformation is a chance to lose the one dependency the next question hinges on. If your eval harness only measures single-hop answer accuracy, the complex system looks fine right up until a multi-hop query exposes the missing path. Treat raw-history retrieval as the baseline every memory design has to beat, not the thing you graduated from — reranking over raw turns is cheap, debuggable, and preserves evidence you can't get back. The [HF paper page](https://huggingface.co/papers/2610.30755) has the full per-benchmark breakdown.

So before you ship that memory graph: does your eval actually contain the multi-hop questions that would justify it, or are you paying for complexity your benchmark can't even see?
