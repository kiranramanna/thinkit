---
layout: post
title: "Your Prompt Optimizer Is Throwing Away Its Best Evidence"
date: 2026-10-10 14:07:20 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.35855"
discussion_url: https://huggingface.co/papers/2609.35855
source_url: https://arxiv.org/abs/2609.35855
---

Most of the optimization I do on a deployed agent isn't touching weights at all — it's editing prompts, skills, harnesses, and glue code. And nearly every automated version of that loop is propose-evaluate-select: generate a candidate, score it, keep it if it clears the bar, throw it out if it doesn't. The quiet waste is in that last step. A rejected candidate isn't noise; it's a measurement of exactly where the current approach breaks. Discard it and your next proposal cheerfully walks into the same wall.

[Mara Chain](https://arxiv.org/abs/2609.35855) takes the discarded candidates and keeps working them. Instead of deleting a rejection, it refines that candidate using the evidence accumulated across the attempts before it — bounding each refinement chain to a fixed depth and using Pareto-filtered Top-N selection so the pool doesn't explode. It's a small reframe with a real payoff: failures become the thing you build on rather than the thing you clear off the table.

The number that caught my eye isn't the headline win rate, it's the rollout cost. The authors report reaching GEPA's target score with 65.5% fewer rollouts on AppWorld skill optimization, plus double-digit pass-rate gains on TerminalBench 2.1 harness tuning and better nDCG@10 and Recall@10 than a hand-written MuSiQue retrieval pipeline. Anyone who's run these optimizers in anger knows the evaluation rollouts *are* the budget — the LLM calls to score each candidate dwarf the cost of proposing them. Cutting rollouts by two-thirds to hit the same score is the difference between running optimization on every deploy and running it once a quarter because it's too expensive.

The [HF paper page](https://huggingface.co/papers/2609.35855) frames this as auto-evolution, but the operational lesson is narrower and more useful: your optimizer's reject pile is a labeled dataset of your system's failure modes. If you're running propose-evaluate-select today, are you logging the candidates you throw away — or are you paying full price to rediscover them next week?
