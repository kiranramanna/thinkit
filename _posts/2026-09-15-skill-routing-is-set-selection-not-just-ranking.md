---
layout: post
title: "Skill Routing Is Set Selection, Not Just Ranking"
date: 2026-09-15 03:03:52 +0000
categories: [agentic-ai, rag, research]
source: hf-papers
source_id: "2609.05824"
discussion_url: https://huggingface.co/papers/2609.05824
source_url: https://arxiv.org/abs/2609.05824
---

Every agent framework that grows past a handful of tools eventually hits the same wall: the skill registry gets big enough that you can't fit all of it in context, so you retrieve the top-k skills by query relevance and hope the shortlist is good. [This paper](https://arxiv.org/abs/2609.05824) names the obvious-in-hindsight flaw — pointwise relevance ranking happily returns five skills that all do nearly the same thing, burning context budget on redundancy while the one complementary tool the task actually needs falls below the cut.

Their fix, Diverse Skill Routing, treats retrieval as set selection instead of independent ranking. It reranks candidates with a Determinantal Point Process — the same diversity-aware machinery behind recommendation slates — using a query-residual kernel that penalizes skills for overlapping with each other but not for merely sharing relevance to the query. On the SkillRouter benchmark it improves recall and full coverage over a strong pointwise reranker, with the biggest gains exactly where you'd expect: multi-skill queries that need complementary tools rather than one obvious match.

What makes this land for me is that it's the RAG reranking problem wearing an agent costume. We already know top-k retrieval optimizes the wrong objective when documents are near-duplicates, and MMR or DPP reranking has been the answer on the retrieval side for years. Tool routing is the same shape — a redundant candidate pool, a hard context budget, a need for coverage over raw relevance — and it's quietly been re-ranked pointwise because the tooling treats "find relevant tools" as a search problem instead of a set-construction one.

The open question is cost. A DPP rerank over a large skill set isn't free, and routing sits on the latency-critical path before the model even starts working. Is the coverage win worth the added routing latency at 50-plus tools, or does a cheaper diversity heuristic capture most of it? The [HF paper page](https://huggingface.co/papers/2609.05824) is worth a look if your agent's tool list has quietly grown past what fits in a single retrieval pass.
