---
layout: post
title: "Agentic Retrieval Is Better, and 160x Slower"
date: 2026-10-07 03:07:56 +0000
categories: [rag, agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.05750"
discussion_url: https://huggingface.co/papers/2610.05750
source_url: https://arxiv.org/abs/2610.05750
---

Everyone selling "agentic RAG" leads with the accuracy delta and goes quiet on the invoice. What I appreciate about [this study](https://arxiv.org/abs/2610.05750) is that it puts both numbers on the same table. Wrapping a retriever in a ReAct loop — let the LLM reason, search, read partial evidence, revise, search again — buys +8.7 nDCG@10 over standard dense retrieval using the *same* embedding model. No new encoder, no fine-tuning. The gain comes entirely from turning a single top-k lookup into a reasoning loop over the corpus.

The generalization result is the part I'd actually build on. Specialized retrieval methods tend to crater out of domain; here the same agentic pipeline stays competitive on both the ViDoRe v3 and BRIGHT leaderboards without retuning. For an enterprise retrieval stack that has to serve finance, support, and engineering content from one pipeline, "it transfers across domains" is worth more than two points of in-domain nDCG. Dense retrieval leans on surface-level semantic similarity, and that's exactly where messy, multi-constraint enterprise queries fall apart.

Then the invoice: 107.4 seconds per query on average, against 0.67 seconds for standard retrieval — roughly 160x — and 764.1K input plus 5.8K output tokens every time someone searches. That is not a default retrieval path. That is a tool you reach for on the hard 5% of queries where a wrong answer is expensive and a two-minute wait is acceptable, with a cheap dense pass fronting everything else. Anyone who has watched a token bill scale with QPS can do the math on 764K input tokens per query at production traffic. The [arXiv page](https://arxiv.org/abs/2610.05750) has the per-benchmark breakdown and the [HF paper page](https://huggingface.co/papers/2610.05750) has the discussion.

The real open problem the authors name is the one that matters: cost-efficient retrieval agents. Until the latency and token cost drop an order of magnitude, agentic retrieval is a router decision, not a retrieval default. So the question for your own stack isn't whether it's more accurate — it clearly is — it's which queries are worth 160x the latency to get right.
