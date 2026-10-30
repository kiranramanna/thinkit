---
layout: post
title: "Schedule the Tool Calls, Not Just the Tokens"
date: 2026-10-30 03:07:18 +0000
categories: [llm-ops, ai-infrastructure, agentic-ai, research]
source: hf-papers
source_id: "2610.37230"
discussion_url: https://huggingface.co/papers/2610.37230
source_url: https://arxiv.org/abs/2610.37230
---

Most LLM serving stacks were built for one shape of request: text in, tokens out, all on the GPU. Agentic workloads break that assumption. An agent turn is a relay race between model inference on the GPU and tool calls running on CPUs somewhere else, and the scheduler usually can't see the second leg at all. [TAO](https://arxiv.org/abs/2610.37230) makes the scheduler tool-aware: it folds near-term tool-return readiness, a time-decayed cache credit per node, and token footprint into one value signal, then solves admission and placement as a joint optimization instead of a stack of independent heuristics.

The number that matters for anyone running an agent fleet is the TTFT drop — up to 36.3% — because mean time to first token is what users feel and what your SLA is written against. The reason it moves is boring in the best way: when the scheduler knows a session's tool call is about to return, it stops parking that session behind a cold one, and it stops burning a GPU slot on a session that's about to stall on a slow CPU tool. The 29.5% decode-throughput gain is the same insight from the other side — you reclaim the capacity that tool-blind schedulers leave idle during round-trips.

What I like is that it names a gap most of us paper over with timeouts and retries. We treat the tool call as someone else's latency problem and let the GPU sit half-used while a session waits on a flaky API. The [HF paper page](https://huggingface.co/papers/2610.37230) has the full spread across the twelve model-workload-concurrency settings. The honest question for production is whether a dynamic program over tool-readiness survives contact with real tool latency distributions — the long tail where a tool takes 40 seconds or never returns is exactly where the readiness estimate gets hard. How well does "near-term readiness" hold up when a quarter of your tools are someone else's rate-limited endpoint?
