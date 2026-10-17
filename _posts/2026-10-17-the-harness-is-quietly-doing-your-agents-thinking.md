---
layout: post
title: "The Harness Is Quietly Doing Your Agent's Thinking"
date: 2026-10-17 03:07:50 +0000
categories: [agentic-ai, ai-infrastructure, research]
source: hf-papers
source_id: "2610.22200"
discussion_url: https://huggingface.co/papers/2610.22200
source_url: https://arxiv.org/abs/2610.22200
---

The headline for [OpenGCUA](https://arxiv.org/abs/2610.22200) is "an open stack for generalist computer-use agents," but the design choice worth stealing is in the method: *harness-to-model decision transfer*.

Most computer-use agents lean on a fixed harness to decide what the model sees and when a subtask is done. That makes the agent look smarter than the model actually is — the scaffolding is doing part of the reasoning. OpenGCUA moves those observation and task-state decisions out of hand-written harness rules and into the model itself, and treats code execution as a first-class action so intermediate results steer the next step.

- 🎯 **Harness-to-model transfer**: let the model choose how to observe and when work is done, instead of hard-coding it in the loop
- ⚡ **Code execution as an action**: the agent writes and runs code, so programmatic output, not just pixels, drives the next move
- 📊 **+19.6 mean partial score** on OSWorld-v2 across all eight models tested, including GPT-6 Astra and Claude Opus 5, at ~53% fewer steps per task
- 🔍 **Real-device harness and cross-device SDK**, because benchmark success doesn't survive contact with an actual macOS box
- ⚠️ **19.4x token spread**: on real macOS tasks, one model burned 19.4 times the reasoning tokens of another for comparable work

That last point is the one I'd put in front of anyone picking a model for an agent product. Two systems can land on the same OSWorld number and have wildly different real-device economics; partial score says nothing about tokens per completed task. Open releases like this — full implementation, prompts, and evaluation trajectories on the [HF paper page](https://huggingface.co/papers/2610.22200) — are the only way to audit that gap instead of guessing at it.

If the harness stops making decisions and the model starts, where does your agent's reliability actually live — in the weights, or in the few rules you never moved?
