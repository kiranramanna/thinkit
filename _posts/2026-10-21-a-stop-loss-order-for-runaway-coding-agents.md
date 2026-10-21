---
layout: post
title: "A Stop-Loss Order for Runaway Coding Agents"
date: 2026-10-21 03:05:22 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.25525"
discussion_url: https://huggingface.co/papers/2610.25525
source_url: https://arxiv.org/abs/2610.25525
---

Every coding agent I've run has a long tail of doomed runs — it keeps editing, testing, and retrying on a task it was never going to pass, and you pay full price for the privilege. [StopLoss](https://arxiv.org/abs/2610.25525) makes the obvious move of killing those runs early actually cheap enough to deploy.

The trick is where the supervision comes from. Instead of asking a frontier model to babysit the trajectory — expensive, and the paper shows it barely beats chance at the first check — they train a small external monitor on completed trajectories labeled by their eventual verifier outcome. Final success or failure labels the earlier local windows, so a fine-tuned small model scores the most recent tool steps in a single forward pass. A threshold calibrated on successful runs turns that score into an abort decision, and the executor never changes.

The economics are the point. Against running every task to completion, StopLoss lowers cost per retained solve by 4.5% on SWE-bench Verified while preserving 99% of successful runs, and by up to 31% — reaching 48% with a Qwen3-8B backbone — on the costlier Pro subset. In all four settings its cost per retained solve beats every general-purpose judge it was tested against, at one to two orders of magnitude lower cost per check. Preserving 99% of winning runs is the number that makes this shippable: early stopping only pays if it almost never kills a run that would have landed.

What I like operationally is that the monitor is a separate component calibrated on your own outcomes, not a prompt bolted onto the executor. That's the right seam — you retrain it as your agents and task mix drift without touching the thing doing the work. The abstract and trajectories sit on the [HF paper page](https://huggingface.co/papers/2610.25525).

If outcome-trained monitors are this cheap, the default agent loop a year from now won't be "run to completion" — it'll be "run until a watcher says stop." Who's still paying for the doomed 20%?
