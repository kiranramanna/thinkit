---
layout: post
title: "Most RAG Stacks Are Solving a Problem You Don't Have"
date: 2026-08-26 14:04:27 +0000
categories: [rag, llm-ops]
source: hn
source_id: "49445727"
discussion_url: https://news.ycombinator.com/item?id=49445727
source_url: https://www.lighthousenewsletter.com/p/rag-is-simpler-than-you-think
---

The useful argument in ["RAG Is Simpler Than You Think"](https://www.lighthousenewsletter.com/p/rag-is-simpler-than-you-think) isn't that retrieval is easy — it's that most teams pay for complexity their data never asked for. Reach for embeddings, a vector database, and a reranker on day one, and you've built an agentic pipeline to answer "where's the password-reset doc." The quality gain is real; so is the operational bill, and it lands on whoever runs the thing at 2am.

The piece walks six configurations from naive lookup to agentic RAG, and the honest recommendation is to start at the bottom of that ladder. A static corpus with keyword-shaped questions is a BM25 job — cheap, debuggable, no embedding drift when the docs change. Hybrid retrieval (BM25 for candidates, embeddings to rerank the top slice) earns its keep only when semantic matching actually moves recall. CRAG or Self-RAG belong where retrieval genuinely fails often enough that a correction loop pays for its latency.

What I keep relearning in production: the architecture choice is downstream of your eval harness, not your model. If you can't measure end-to-end answer quality against the corpus you actually have, every added stage is a guess wearing a diagram. The [HN discussion](https://news.ycombinator.com/item?id=49445727) kept circling the same nerve — how is this different from the search stacks we built before LLMs? It mostly isn't, and that's the point. Retrieval was a nearly solved discipline; we re-skinned it and forgot to bring the rigor.

So before the next vector DB spin-up: do you have a retrieval eval that would even notice if plain BM25 beat your embeddings?
