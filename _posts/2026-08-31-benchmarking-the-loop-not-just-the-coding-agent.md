---
layout: post
title: "Benchmarking the Loop, Not Just the Coding Agent"
date: 2026-08-31 14:05:20 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.28281"
discussion_url: https://huggingface.co/papers/2608.28281
source_url: https://arxiv.org/abs/2608.28281
---

Most agent evals score the whole run and call it a day. [LoopArena](https://arxiv.org/abs/2608.28281) makes a sharper cut: it separates the *Controller* — the model deciding what the coding agent does next — from a fixed *Worker* that does the actual coding. That decomposition is the contribution, more than any single number. If you only measure end-to-end success, you can't tell whether a failed task came from a weak coding agent or a controller that trusted a stale progress note, skipped verification, or spent its budget in the wrong direction.

Anyone running multi-agent orchestration in production knows this ambiguity intimately. When an agentic workflow fails, was it the tool-executing worker or the routing-and-planning layer that decides retries, verification, and when to stop? LoopArena's three tiers — a cheap next-step-selection test that never runs the Worker, a mid-cost sliced-control test, and the full paired task — are a practical answer. The reported Spearman ρ of 0.9747 between the sliced test and full runs is the part I'd act on: it means you can rank controllers with the cheap tier and spend real compute only to confirm the ordering. That's the difference between an eval harness you run nightly and one you run quarterly because it's too expensive.

The headline number is humbling — a 24.69% strict success rate on full tasks. Long-horizon loop control is nowhere near solved, which tracks with what production teams see once a task runs past a handful of steps. The [HF paper page](https://huggingface.co/papers/2608.28281) and the [arXiv abstract](https://arxiv.org/abs/2608.28281) have the full setup, and the authors released code.

The framing I'd steal: treat the orchestration loop as a separately-evaluated component with its own regression suite, not an emergent property of "using a good model." How many teams shipping agents today can actually tell you their controller's success rate in isolation?
