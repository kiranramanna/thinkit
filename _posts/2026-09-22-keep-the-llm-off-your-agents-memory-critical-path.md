---
layout: post
title: "Keep the LLM Off Your Agent's Memory Critical Path"
date: 2026-09-22 14:08:53 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.23986"
discussion_url: https://huggingface.co/papers/2609.23986
source_url: https://arxiv.org/abs/2609.23986
---

The pitch for [Jev-Mem](https://arxiv.org/abs/2609.23986) is one most agent-memory systems get backwards: the expensive model shouldn't be the thing deciding how to store and fetch memories. Most designs put an autoregressive LLM in charge of memory typing, retrieval routing, and when to stop searching — so every memory operation drags a full generation onto the critical path, and your latency budget disappears into bookkeeping the model was overqualified to do.

Jev-Mem takes the System-One/System-Two framing literally and turns it into an architecture. A System-One control plane handles the fast, frequent decisions — memory typing and relational organization on write; query routing, retrieval-budget allocation, graph traversal, candidate scoring, and adaptive stopping on read. System Two, the actual reasoning model, is invoked only for synthesis. The structured multi-relational memory plane in the middle is what makes the cheap controller viable: you can route and traverse a typed graph without asking a frontier model where to look next.

The numbers are where a production engineer starts paying attention. On LoCoMo they report a 0.777 LLM-as-a-Judge score, an 11% relative gain over the strongest baseline, alongside a 6.6x speedup in memory construction and average query latency cut 36.7% to 0.93s. That combination is rare — memory quality and speed usually trade against each other, because the thing that improves recall is more model calls. Pulling those calls out of the loop is what breaks the trade.

What I'd want to see before wiring this into a conversational agent is how the System-One controller degrades when the memory graph gets large or adversarial — adaptive stopping is a great idea right up until it stops early on the one turn that mattered, and a lightweight controller is exactly where that failure would hide. The [HF paper page](https://huggingface.co/papers/2609.23986) has the plane-by-plane breakdown. If your agent's p99 is being eaten by memory operations rather than reasoning, which of those decisions actually needs the big model?
