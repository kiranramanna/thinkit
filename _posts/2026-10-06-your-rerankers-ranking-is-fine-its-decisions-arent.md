---
layout: post
title: "Your Reranker's Ranking Is Fine; Its Decisions Aren't"
date: 2026-10-06 03:07:20 +0000
categories: [rag, llm-ops, research]
source: hf-papers
source_id: "2608.26762"
discussion_url: https://huggingface.co/papers/2608.26762
source_url: https://arxiv.org/abs/2608.26762
---

The useful finding in [this paper](https://arxiv.org/abs/2608.26762) isn't that LLM scorers have position bias — we knew that. It's the wedge they drive between *ranking quality* and *decisions*. Five trained scorers sitting within 0.010 nDCG@10 of each other retained passage sets that overlapped by only 0.66–0.84 once the candidates were reshuffled in the prompt. Same model, same query, same candidates, different kept set.

That matters because almost nobody ships nDCG. We ship a threshold: what a retriever keeps, what a RAG reader gets handed, which chosen/rejected pair lands in a preference dataset. If reordering the candidates flips which documents survive the cut, your eval harness is grading the one number that doesn't move while the number that actually drives behavior quietly drifts. I've watched this exact failure mode hide inside reranker A/B tests — the leaderboard says "no change," production retrieval says otherwise.

What I like is that the fix lives in the weights, not the prompt. The authors tried the obvious prompt-time tricks and none fixed decision stability; the one that improved ranking didn't move stability at all. Order-consistency SFT penalizes a candidate's score disagreement across orderings, and a single OC-SFT permutation beat ten averaged off-the-shelf permutations on retained-set overlap — cheaper at inference, too. The takeaway for anyone running hybrid search with an LLM reranker: report what your threshold keeps and what the reader answers, not reranker nDCG alone. The [arXiv page](https://arxiv.org/abs/2608.26762) has the OC-SFT details and the [HF paper page](https://huggingface.co/papers/2608.26762) collects the discussion.

So here's the uncomfortable question for your own stack: if you permuted the candidate order on your top reranked set tomorrow, how much of your retained context would actually survive?
