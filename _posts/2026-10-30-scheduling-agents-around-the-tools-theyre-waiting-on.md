---
layout: post
title: "Scheduling Agents Around the Tools They're Waiting On"
date: 2026-10-30 14:09:40 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure, research]
source: hf-papers
source_id: "2610.37230"
discussion_url: https://huggingface.co/papers/2610.37230
source_url: https://arxiv.org/abs/2610.37230
---

Agentic serving has a scheduling problem most inference stacks were never built
for: a GPU sits idle while a session waits on a tool call out on some CPU, and
the scheduler has no idea when that tool is coming back.
[TAO](https://arxiv.org/abs/2610.37230) treats tool-return readiness as a
first-class scheduling signal instead of a blind spot.

- 🎯 **Tool readiness in the value function** — admission and GPU placement
  account for when a tool call will return, not just queue depth
- ⚡ **Up to 36.3% lower time-to-first-token** and 26.8% lower latency vs the
  best baseline per metric — the idle-GPU tax is bigger than most teams measure
- 📊 **~29.5% more decode throughput** from the same hardware, because a dynamic
  program places waiting sessions instead of a heuristic
- 🔍 **Cache credit with time-aware decay** — node-specific KV value that ages,
  so placement respects what's actually still warm
- 💡 **The lesson for multi-agent workflows**: tool latency is part of your
  serving SLA, not an external delay you get to wave away

This is the kind of systems work that only surfaces once you're running agents
at real concurrency — single-request benchmarks hide every bit of it. The
[HF paper page](https://huggingface.co/papers/2610.37230) lays out the 12
model-workload-concurrency settings behind those numbers. My bet: tool-aware
scheduling becomes table stakes for agent serving within a year, the same way
continuous batching did for plain LLM inference.
