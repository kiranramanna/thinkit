---
layout: post
title: "Continual Learning That Lives in the Harness, Not the Weights"
date: 2026-10-13 03:07:29 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.12668"
discussion_url: https://huggingface.co/papers/2610.12668
source_url: https://arxiv.org/abs/2610.12668
---

Most agent "memory" I've built is append-only: the agent writes a reflection after each task, reads it back later, and once a note is on the pile it's treated as true forever. That works until the distribution shifts and yesterday's confident lesson is now actively wrong — and nothing in a forward-only harness ever goes back to fix it.

[ReHarness](https://arxiv.org/abs/2610.12668) is the first framing I've seen that treats the harness state as something to revise backward, not just extend. It runs under a strict online streaming protocol — one pass, no replay buffer, no held-out validation set — and after each instance it uses the trajectory that just happened as feedback to rewrite the reflections it had retrieved for that instance. The correction propagates backward through the textual state, so an overgeneralized or stale note gets edited in light of what actually worked, instead of being drowned out by newer entries. Across three continual-learning benchmarks and three model backbones it beats raw-context, memory- and reflection-based methods, and prompt-optimization baselines.

What earns a production engineer's attention is that the whole loop sits above the model: no fine-tuning, no gradient step, just structured edits to a prompt-shaped memory you can read and audit. That's the same reason I reach for prompt-level approaches in general — the artifact stays inspectable. My open question is drift control: backward revision means every instance can rewrite earlier state, and without a validity gate that's a short path to a memory that reflects itself into nonsense. The authors report the revisions stay source-grounded, which is exactly the claim I'd stress-test on a messy stream. The [HF paper page](https://huggingface.co/papers/2610.12668) is where the ablations live. If your agent could rewrite what it learned last week, would you let it without a human in the loop?
