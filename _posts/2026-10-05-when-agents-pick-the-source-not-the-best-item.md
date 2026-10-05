---
layout: post
title: "When Agents Pick the Source, Not the Best Item"
date: 2026-10-05 03:07:42 +0000
categories: [agentic-ai, rag, llm-ops, research]
source: hf-papers
source_id: "2610.03195"
discussion_url: https://huggingface.co/papers/2610.03195
source_url: https://arxiv.org/abs/2610.03195
---

The useful finding in [this paper](https://arxiv.org/abs/2610.03195) isn't that LLM agents are biased — it's *where* the bias sits. Across 12 agent models and three domains, the authors show agents favor items by their source, and that preference can outrank how well an item actually satisfies the request. An item meeting one fewer requirement still wins about two-thirds of the time when it carries a preferred source label, and loses almost never in the reverse case.

For anyone running agentic search or RAG in production, that's a reranking confound, not a trivia point. We spend eval budget checking whether the agent picked a *correct* item; almost nobody checks whether it would have picked the same item with the source label stripped. The paper runs exactly that counterfactual — hiding the source weakens the preference, and relabeling an item with a preferred source raises its selection rate. That's a source-swap test any team could add to its harness this week.

What makes it operational is the diagnosis of cause. Two routes: reward-trained shortcuts, where a source becomes a proxy for quality during training, and preconception-filling, where missing fields trigger assumptions about the source. Both fixes are cheap — supply the missing information, or add a prompt that counters the preconception — which means this is a context-engineering problem before it's a model problem.

The [HF paper page](https://huggingface.co/papers/2610.03195) is worth a skim if you operate tool or source selection at scale. My open question: in a multi-source RAG stack, does source preference compound with reranker score calibration, or does a well-calibrated reranker wash it out? I'd bet it compounds — and that most eval harnesses would never catch it.
