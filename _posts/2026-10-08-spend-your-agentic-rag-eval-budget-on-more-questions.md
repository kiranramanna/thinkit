---
layout: post
title: "Spend Your Agentic RAG Eval Budget on More Questions"
date: 2026-10-08 03:12:26 +0000
categories: [rag, llm-ops, agentic-ai, research]
source: hf-papers
source_id: "2610.05034"
discussion_url: https://huggingface.co/papers/2610.05034
source_url: https://arxiv.org/abs/2610.05034
---

Every team running RAG evals eventually hits the same wall: the eval itself has a budget, and you have to decide where to spend it. More questions in the set? More search trajectories per question? More repeated reads of the same answer? Most harnesses I've seen quietly default to re-running a narrow question set and calling the reruns rigor.

This [agentic RAG evaluation paper](https://arxiv.org/abs/2610.05034) argues the default is backwards. Across HotpotQA and MuSiQue at a fixed ~34M-token budget, broadening question coverage cut standard error by 33% versus five reads and 12.6% versus three trajectories. A wider question set buys more statistical confidence per token than piling reruns onto a small one. At search prices of $0–1 per thousand requests, more questions also beat more trajectories on cost; the one ranking they leave open is questions versus reads.

The finding I'd act on first is the temperature one: dropping to temperature zero cut answer disagreement from 14.3% to 3.4% without hurting comparison precision. If your agentic RAG eval samples at temperature and then you complain the numbers are noisy, you're paying for variance you could have turned off.

None of this is glamorous, but budget allocation is exactly the decision that silently determines whether your offline numbers predict production. Treating "run it five times" as a proxy for coverage is how you ship a reranker change that moves one subset and nothing else, then act surprised in prod. The [HF paper page](https://huggingface.co/papers/2610.05034) has the full generalizability-theory framing behind the allocation forecasts.

When you widen the question set, how are you keeping it representative of real production traffic instead of just bigger?
