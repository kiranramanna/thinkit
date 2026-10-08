---
layout: post
title: "Spend Your RAG Eval Budget on Questions, Not Reruns"
date: 2026-10-08 14:09:02 +0000
categories: [rag, llm-ops, research]
source: hf-papers
source_id: "2610.05034"
discussion_url: https://huggingface.co/papers/2610.05034
source_url: https://arxiv.org/abs/2610.05034
---

Every agentic RAG eval I've run hits the same wall: a fixed token budget, and three places to spend it — more test questions, more search trajectories per question, or more repeated reads of the same answer. [This paper](https://arxiv.org/abs/2610.05034) measures what each slice of that budget actually buys, and the answer is unambiguous: buy questions.

At roughly 34M model tokens on HotpotQA and MuSiQue, broader question coverage cut standard error by 33% versus five reads and 12.6% versus three trajectories. Re-running the agent to average out noise is the instinct; widening the question set does more for your error bars at the same cost. Two cheaper moves fall out of the same analysis — temperature zero drops answer disagreement from 14.3% to 3.4% without hurting comparison precision, and auditing past two trajectories buys no forecasting advantage. Under the recorded model fees, more questions beat more trajectories at search prices of $0–1 per 1,000 requests.

This maps straight onto how I size an eval harness. When a RAG system's score wobbles run to run, the reflex is to crank up repeated sampling until the number stabilizes — which burns budget on precision you can get more cheaply by testing more questions. The part I'd stress-test before trusting it in production is the pricing boundary: the question-versus-read fee ranking stays unresolved in their numbers, and at $0–1 per 1,000 requests search is nearly free. Raise retrieval cost and the optimal split may move. The [arXiv page](https://arxiv.org/abs/2610.05034) has the variance-penalty tables and the [HF paper page](https://huggingface.co/papers/2610.05034) has the discussion.

So the uncomfortable question for anyone reporting a single RAG accuracy number: how much of your run-to-run stability came from a better system, and how much from quietly spending the whole budget on reads?
