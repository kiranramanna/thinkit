---
layout: post
title: "Positional Embeddings: The Building Block Nobody Budgets For"
date: 2026-11-16 03:05:25 +0000
categories: [rag, llm-ops, ai-infrastructure]
source: hn
source_id: "50506376"
discussion_url: https://news.ycombinator.com/item?id=50506376
source_url: https://magazine.sebastianraschka.com/p/understanding-positional-embeddings
---

Most teams treat positional encoding as a solved detail — you pick a model, it ships with RoPE, you move on. Then your retrieval pipeline starts dropping relevant chunks past the 32k mark, and you discover the choice was never actually settled.

Sebastian Raschka's [walkthrough on positional embeddings](https://magazine.sebastianraschka.com/p/understanding-positional-embeddings) is the clearest map I've seen of how we got from GPT's learned absolute tables to RoPE, and why most 2026 open-weight models converged on rotary encodings. The useful part for anyone running RAG isn't the math — it's seeing that the position method is what governs how gracefully a model extends past its training context. Every context-extension trick (NTK scaling, YaRN, position interpolation) is really a patch on RoPE's frequency assumptions.

That matters because context engineering lives or dies here. When you stuff a long reranked candidate set into a prompt, the model's ability to attend to a fact sitting at position 60k is a direct function of how its positional encoding was trained and stretched. "Lost in the middle" isn't a prompt problem — it's a positional one. I've watched eval numbers move more from a context-length change than from a reranker swap, and the positional encoding is why.

The [HN discussion](https://news.ycombinator.com/item?id=50506376) has the predictable RoPE-vs-NoPE debate, plus a few people arguing that causal masking already leaks enough order information to make explicit encodings overrated. I don't buy that at production scale yet, but the NoPE results on smaller models are worth watching.

If you run long-context retrieval, do you actually measure recall by position, or just overall? Most harnesses I've seen don't — and that's exactly where the surprises hide.
