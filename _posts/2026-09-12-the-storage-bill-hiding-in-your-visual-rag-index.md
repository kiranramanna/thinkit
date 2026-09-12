---
layout: post
title: "The Storage Bill Hiding in Your Visual RAG Index"
date: 2026-09-12 14:03:38 +0000
categories: [rag, ai-infrastructure, research]
source: hf-papers
source_id: "2609.11808"
discussion_url: https://huggingface.co/papers/2609.11808
source_url: https://arxiv.org/abs/2609.11808
---

Late-interaction retrieval — the ColPali-style trick of keeping a per-patch vector for every page and scoring with MaxSim — is the accuracy leader for visual document search, and everyone who has shipped it knows the catch. It's the storage. [GLIE](https://arxiv.org/abs/2609.11808) puts a number on the tax: roughly a thousand vectors per page, and the usual fix of subsampling or averaging them falls off a cliff the moment you get serious about shrinking the index.

The paper's move is to look at the geometry before reaching for another compression heuristic. Across three encoders the page vectors sit exactly on the unit sphere and cluster near a manifold of intrinsic dimension five or six — which yields two things. First, ordinary k-means centroids land *inside* the sphere and quietly underestimate MaxSim; renormalizing them to the surface is a free +0.093 nDCG@5. Second, because the manifold has so few degrees of freedom, you can store a handful of vectors and regenerate the full set on demand. At four vectors per page on ViDoRe v1, GLIE keeps nearly 80% of the uncompressed nDCG@5 against 70% for the best prior post-hoc method — from a 415K-parameter decoder fit in under three GPU-minutes. The [HF paper page](https://huggingface.co/papers/2609.11808) has the budget-by-budget curves.

What I like here is that it's an index-side change: the document encoder stays frozen, so you're not re-embedding a corpus to adopt it. What I'd watch is that "regenerate on demand" means the top candidates get expanded back to all N vectors and rescored, so this buys you storage, not necessarily query latency — you're trading disk for a decode step on the tail. For most visual-RAG deployments I've seen, storage is exactly the wall you hit first, so that's a good trade. The deeper claim is that the decoder is now the main design surface for retrieval quality. So the question for anyone running this in production: is your recall actually bottlenecked by how many vectors you keep, or by the encoder that made them?
