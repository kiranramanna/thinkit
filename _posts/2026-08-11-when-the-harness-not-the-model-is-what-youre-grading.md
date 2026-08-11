---
layout: post
title: "When the Harness, Not the Model, Is What You're Grading"
date: 2026-08-11 14:05:46 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.07346"
discussion_url: https://huggingface.co/papers/2608.07346
source_url: https://arxiv.org/abs/2608.07346
---

Everyone benchmarks the model. Almost nobody benchmarks the harness the model runs inside — and [A²E](https://arxiv.org/abs/2608.07346) argues that's backwards for anyone shipping agents.

The part that earns attention: an Agent Task Protocol that pairs 23 benchmarks with 9 agent frameworks without writing per-combination glue code, plus an auto-instrumented monitor that captures standardized execution traces on OpenTelemetry-style spans. The payoff is that you can finally compare harnesses on more than a pass/fail number. A²E scores execution efficiency, tool use, task planning, and error recovery separately — the four things that actually decide whether an agent survives contact with production.

The finding worth framing on the wall: no single model-harness combination wins across every task type. That matches what I keep seeing in production — the retrieval-heavy workflow that loves one orchestration layer falls apart on the multi-tool task another handles cleanly. Correctness alone hides all of it. If your eval harness only reports task success, you're grading the model and giving the harness a free pass, which is exactly where your latency, retries, and silent failures live.

What I'd do with it: wire the trace monitor into an existing agent, then diff error-recovery behavior across two orchestration strategies on the same task set. The [HF paper page](https://huggingface.co/papers/2608.07346) has the specifics, and the code is open.

If the best model-harness pairing is task-dependent, does "which framework should we standardize on" even have a right answer — or is the honest one "measure it per workload"?
