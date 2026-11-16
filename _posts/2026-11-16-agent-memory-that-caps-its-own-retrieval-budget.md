---
layout: post
title: "Agent Memory That Caps Its Own Retrieval Budget"
date: 2026-11-16 14:08:05 +0000
categories: [agentic-ai, rag, llm-ops, research]
source: hf-papers
source_id: "2611.12068"
discussion_url: https://huggingface.co/papers/2611.12068
source_url: https://arxiv.org/abs/2611.12068
---

The number that matters in [MIRIX-2.0](https://arxiv.org/abs/2611.12068) isn't the 91.4% on LoCoMo. It's the line saying retrieval runs under explicit budgets, so the evidence a question inspects doesn't grow with the conversation history. That's the failure mode nobody benchmarks: an agent that gets slower and more expensive every week it stays in production, because "remember everything" quietly turned into "search everything."

Most memory systems I've looked at bolt a vector store onto the agent and call it long-term memory. This one splits memory into six typed stores with their own agents, and indexes episodic and semantic records in a provenance hypergraph where n-ary frames cite the rows they came from. The provenance part is the operationally interesting bit — when a grounded answer is wrong, you can trace which stored record it leaned on instead of re-deriving the whole retrieval path by hand. Anyone who has debugged a RAG pipeline at 2am knows that trace is worth more than a few points of accuracy.

The efficiency claims are the ones I'd actually re-run on my own eval harness. "Answers faster than the baseline on all five timed benchmarks," no fine-tuning, closed or open models — those are the properties that decide whether something survives a latency SLA, and also the easiest to overstate. The [HF paper page](https://huggingface.co/papers/2611.12068) has the full breakdown, including the AutoDream step that merges duplicate anchors off the write path so dedup never blocks a write.

If your agent's memory gets slower the longer a user talks to it, you don't have a memory system — you have a growing liability with a nice API. Which part of your retrieval cost actually scales with history, and have you measured it?
