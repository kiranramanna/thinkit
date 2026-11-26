---
layout: post
title: "Who Manages the Agent's Context — Model or Harness"
date: 2026-11-26 14:05:37 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure, research]
source: hf-papers
source_id: "2611.34147"
discussion_url: https://huggingface.co/papers/2611.34147
source_url: https://arxiv.org/abs/2611.34147
---

Most agent harnesses treat context like garbage collection: when the window fills, the harness summarizes the history and moves on. The model never gets a vote. The [arXiv paper](https://arxiv.org/abs/2611.34147) flips that — it hands the model a context API inside NVIDIA's open-source agent harness and lets it decide when and what to compact, then measures whether that beats harness-driven compaction.

The interesting result isn't that model-driven management wins. It's where. At a 32K budget, GPT 6.1 nearly triples its accuracy on one research benchmark (21% to 56%), and another model reaches the same quality with 41% fewer input tokens. The gains concentrate at tight budgets — which is exactly where production agents live once you're paying for every token in a multi-step tool loop.

What I'd actually use is the KV-cache finding. The authors show inference engines can reuse the cache of the unchanged suffix after a context edit, cutting prefill compute up to 15% with no measurable accuracy hit. That reframes context management as a co-design problem between the model and the serving stack, not a harness trick. If your agent edits its own context but your inference engine re-prefills the whole prompt every time, you're paying for the edit twice.

The messy part: models disagree wildly on strategy — how often they compact, how aggressively, when they start — and prompt changes shift all of it. You've traded a deterministic harness policy for a non-deterministic one baked into weights you can't easily audit. The [HF paper page](https://huggingface.co/papers/2611.34147) has the full breakdown.

For production agents, would you trust a model to decide when to forget — or is harness-controlled compaction the one thing you want to keep deterministic?
