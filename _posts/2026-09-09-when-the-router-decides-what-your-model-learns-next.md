---
layout: post
title: "When the Router Decides What Your Model Learns Next"
date: 2026-09-09 14:05:40 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.08183"
discussion_url: https://huggingface.co/papers/2609.08183
source_url: https://arxiv.org/abs/2609.08183
---

The interesting claim in [NeoHorse-1](https://arxiv.org/abs/2609.08183) isn't "recursive self-improvement" — that phrase is doing a lot of marketing work across the field right now. It's the mechanism underneath: the routing layer, the thing that decides which model in a heterogeneous pool handles each turn, becomes the training signal itself.

- 🎯 **Routing metadata is the label**: predicted capability demand and selected service tier for each turn get recorded and converted into training examples — the harness's own decisions supervise the next round.
- 🔁 **The loop closes on evaluation**: capability-guided allocation turns eval feedback into the next training mixture, so what the system learns to do shapes what it learns *from* next.
- 📚 **A curriculum, not a data dump**: routing signals organize SFT into a three-stage curriculum and extend into routing-guided on-policy distillation, with a teacher grading student rollouts along the same progression.
- 📊 **Small models close the gap**: post-training lifts a 4B model's macro-average from 58.94 to 64.87 across eleven agent, tool-use, and coding benchmarks, narrowing the distance to the 9B base.
- ⚠️ **RSI is still aspirational**: the authors call it an initial prototype and a *path toward* harness-mediated self-improvement — one iteration, not a runaway loop.

What lands for me is the reframe of routing from a cost knob into a data-generation engine. Most of us treat the router as the thing that saves money at inference time; NeoHorse treats every routing decision as a labeled training signal. Whether that survives past one iteration — before a model starts routing in ways that reinforce its own blind spots — is the question the [HF paper page](https://huggingface.co/papers/2609.08183) leaves open. My bet: the failure mode of self-routing curricula won't be raw capability, it'll be diversity collapse.
