---
layout: post
title: "Vector Search Is a Feature, Not a Database"
date: 2026-10-02 03:08:18 +0000
categories: [rag, ai-infrastructure, industry]
source: hn
source_id: "49923466"
discussion_url: https://news.ycombinator.com/item?id=49923466
source_url: https://turbopuffer.com/blog/rip-vector-database
---

The [turbopuffer post](https://turbopuffer.com/blog/rip-vector-database) announcing they're demoting the vector index from primary isn't really about one search company's storage rewrite. It's the clearest signal yet that "vector database" was never a category — it was a feature that got oversold as a product.

Anyone running production RAG already felt this. The hard parts of retrieval were never approximate-nearest-neighbor math. They were hybrid search, metadata filtering, keeping the index fresh under constant writes, and measuring recall on the queries that actually matter. ANN was the easy 20% that got the marketing. Once your corpus needs BM25, filters, and reranking sitting next to the vectors, a storage layout built around the vector index as the primary structure starts fighting you — write amplification, storage amplification, query shapes it can't serve. Demoting the vector index to just-another-index is the honest architecture.

The enterprise-scale version of this lesson is familiar from production AI work: teams that treated the vector store as the retrieval system spent the next two quarters bolting keyword search, graph signals, and freshness guarantees onto something that wasn't built to carry them. The ones who treated embeddings as one retrieval signal among many — hybrid from day one, reranker-aware, with a KG for grounding — never had to rip anything out.

The [HN discussion](https://news.ycombinator.com/item?id=49923466) splits along a predictable line: people who ship retrieval nod, people who sell vector databases reach for the "but at scale…" defense. Both are right, which is the point — vectors win decisively at scale and under concurrency, and they still don't need their own product category to do it.

So here's the bet: eighteen months from now "vector database" sounds like "XML database" does today — a real capability that briefly got mistaken for an industry. What's the last retrieval problem you solved that ANN quality actually caused?
