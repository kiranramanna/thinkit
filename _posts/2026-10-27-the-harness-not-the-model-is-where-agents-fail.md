---
layout: post
title: "The Harness, Not the Model, Is Where Agents Fail"
date: 2026-10-27 03:05:53 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.32285"
discussion_url: https://huggingface.co/papers/2610.32285
source_url: https://arxiv.org/abs/2610.32285
---

Most agent benchmarks measure the model. The thing that actually breaks in production is the harness — the context assembly, the tool layer, the retry and governance logic wrapped around the model — and almost nobody scores that directly. [Trial by Trace](https://arxiv.org/abs/2610.32285) finally points the measurement at it.

The setup (TraceTrial-Bench) splits harness reliability into seven components — context, execution, governance, lifecycle, observability, tools, and verification — and runs 95 mechanism-oriented tasks with executable ground truth across 4 harnesses and 9 models, 3,420 runs in total. Two numbers are worth sitting with: macro harness scores land between 59.8% and 72.0%, and 31.1% of runs succeed at the task while still failing at least one harness criterion. That second number is the one I'd pin to the wall. A green end-to-end eval can be sitting on top of a harness that silently mishandled a tool call or skipped a governance check — it just happened to get the right answer this time.

What makes this usable rather than academic is the failure-attribution module: explicit mechanism chains that attribute a run-level failure to a specific layer. That's the gap I hit constantly in production agent work — when a run goes wrong, was it the model's reasoning, a malformed tool schema, or context that got truncated three steps back? The two-layer design, scoring agent performance separately from harness reliability, matches how you actually have to debug these systems rather than how we pretend to.

The [HF paper page](https://huggingface.co/papers/2610.32285) has the full component breakdown if you want to map it onto your own stack. Here's my question: once you can score a harness independently of the model it wraps, does "which model is best" stop being the benchmark worth arguing about?
