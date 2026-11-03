---
layout: post
title: "Not Every Agent Failure Is a Lesson Worth Learning"
date: 2026-11-03 14:06:10 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.37651"
discussion_url: https://huggingface.co/papers/2610.37651
source_url: https://arxiv.org/abs/2610.37651
---

Self-improving agents have a signal-quality problem nobody wants to name: reflective prompt optimizers like GEPA learn from failed rollouts, but a lot of those failures have nothing to do with the prompt. The harness dropped a tool call. Execution was stochastic. The judge was simply wrong. Train on those and you're teaching the optimizer to fix things that were never broken. [GEPA-Curator](https://arxiv.org/abs/2610.37651) makes failure curation a first-class step instead of an afterthought.

Two moves do the work. Task curation filters out rollouts likely to carry noisy or unreliable signal before they ever reach the optimizer. Prior-success retrieval pulls a task's past successful trajectories back in as context, so the optimizer reasons against what good looked like, not just the latest crash. On GoBrowse, ALFWorld, AppWorld and τ-bench, with Gemini 3.1 Pro and Claude Opus 5 as optimizer models, that lands gains of up to 20.7% over GEPA and 21.2% over ACE.

This matches something I keep relearning while running eval-driven optimization in production: your automated judges are part of the training loop whether you admit it or not, and one noisy judge quietly poisons every decision downstream of it. What the [HF paper page](https://huggingface.co/papers/2610.37651) leaves open is who curates the curator — task curation is itself a classifier that can be wrong, and a filter tuned too aggressively starves the optimizer of exactly the hard cases that teach it something. Where would you rather err: training on noise, or never seeing your genuinely hard failures?
