---
layout: post
title: "Agent Memory Without a Single Extra LLM Call"
date: 2026-08-05 14:05:14 +0000
categories: [agentic-ai, rag, llm-ops, knowledge-graphs]
hn_id: 49178608
hn_url: https://news.ycombinator.com/item?id=49178608
source_url: https://arxiv.org/abs/2607.29377
---

Most agent memory systems have a tax nobody puts on the invoice: the write path.
Every time the agent summarizes a turn, merges a fact, or decides what to store,
that's another LLM call — recurring token cost, added latency, and a lossy
compression step where the original evidence quietly gets paraphrased away. The
[Zero-Mem paper](https://arxiv.org/abs/2607.29377) asks the question I keep
coming back to in production: does structured memory access need generation at
all?

Their answer is no. Zero-Mem keeps the raw interaction traces as the record and
never calls an LLM to manage them. It indexes those traces two ways — an
entity–context graph for cross-interaction connections, and a temporal hierarchy
that preserves session locality — then, per query, weighs both views and
retrieves from each. A deterministic calibration step drops conflicting evidence
before the answer is composed. Only the final question-answering reader touches
an LLM. Everything upstream is encoder computation and graph traversal.

The result that matters operationally: competitive QA accuracy on long-memory
and long-context benchmarks while cutting memory-operation time by 57.6% against
the fastest baseline, with zero LLM tokens spent on memory. That lines up with
what I see running retrieval at scale — the entity graph plus recency structure
does most of the grounding work, and the extra "let the model tidy up its
memories" pass is where the budget and the hallucinated summaries both leak in.
The [HN discussion](https://news.ycombinator.com/item?id=49178608) is already
poking at whether the encoder cost just moves the bill rather than removing it.

If your agent's memory layer is making LLM calls to remember things, that's a
line item worth auditing — how much of it survives being replaced by a graph and
a clock?
