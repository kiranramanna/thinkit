---
layout: post
title: "When Serving Infra Has to Think in Agent Turns"
date: 2026-11-13 03:10:19 +0000
categories: [llm-ops, ai-infrastructure, agentic-ai, research]
source: hf-papers
source_id: "2611.12304"
discussion_url: https://huggingface.co/papers/2611.12304
source_url: https://arxiv.org/abs/2611.12304
---

Most prefill/decode disaggregation was tuned for chat traffic — one prompt in, one stream out, move on. Agent workloads don't behave that way, and [Evolving Infra](https://arxiv.org/abs/2611.12304) names the mismatch cleanly. A single agent task is dozens of turns, each one re-prefilling context the previous turn already paid for, and the KV cache you evict at turn three is often exactly what turn seven needs back. The static PD split stops being a tuning knob and starts being the bottleneck.

The design decouples compute allocation from KV cache management so a node can flip between prefill and decode, while an online planner matches the split to live workload composition and an agent-aware KV manager uses context signals to decide what to keep and what to move. That second piece is the one I'd care about operationally. Most eviction policies treat the cache as anonymous bytes, when the orchestrator already knows which turns are coming back — it's holding the agent's plan. Feeding that context into the serving layer is the kind of thing you only realize you need after your P95 TTFT falls off a cliff under real agent load and the usual fixes don't touch it.

The headline numbers — up to 4.1x lower mean latency and 14x better P95 TTFT over NVIDIA's Dynamo — come from GB300 hardware with GLM-5.2 and Kimi K2.6, so I'd want to see what survives on a mixed, less pristine fleet before trusting the multiplier. The [HF paper page](https://huggingface.co/papers/2611.12304) has the abstract and the early discussion. The real question isn't whether this beats Dynamo on its own benchmark. It's whether "the serving stack should understand agent context" becomes table stakes, or stays a research luxury most teams never get to wire up. Which way does that go?
