---
layout: post
title: "Multi-Hop RAG That Stops Asking the LLM to Plan"
date: 2026-11-03 14:06:10 +0000
categories: [rag, knowledge-graphs, llm-ops, research]
source: hf-papers
source_id: "2610.37826"
discussion_url: https://huggingface.co/papers/2610.37826
source_url: https://arxiv.org/abs/2610.37826
---

The usual multi-hop RAG failure mode isn't retrieval — it's that iterative pipelines pile four jobs onto the LLM at once: plan the sub-questions, track their dependencies, rewrite them as answers land, and remember what's already known. [DeFT-RAG](https://arxiv.org/abs/2610.37826) wins on MuSiQue, 2WikiMultiHopQA and HotpotQA mostly by refusing to do all of that in one model.

- 🎯 **One self-contained sub-question at a time**: each one names every entity it asks about, so the model never has to resolve "it" or "that company" against a plan it's also supposed to be maintaining.
- 🧹 **Move the bookkeeping out of the model**: a rule-based QA table tracks what's known, and a fine-tuned lightweight decision model makes the yes/no "are we done?" calls instead of burning a frontier model on them.
- ⚡ **Fewer input tokens than any other iterative method**: the model sees one fine-grained task, not the whole evolving state — the thing that quietly bloats your prompt bill on multi-hop traffic.
- 💾 **A QA cache that reuses answers across questions**: shared across 1,000 MuSiQue questions, it answered 23.1% of sub-questions from cache and cut LLM calls 12.9% with no accuracy loss.

The contrarian read: those of us doing graph-enhanced retrieval have been treating the graph as the hard part. DeFT-RAG's results say the retrieval substrate matters less than how much orchestration you've handed to the LLM — and that a boring QA table plus a small classifier beats asking gpt-4o-mini to be its own scheduler.

What I'd actually test from the [HF paper page](https://huggingface.co/papers/2610.37826): whether that 23% cache hit rate survives production traffic, where questions don't come from one clean benchmark distribution. On real query logs the reuse could run far higher — or disappear into the long tail. Which way does it break for you?
