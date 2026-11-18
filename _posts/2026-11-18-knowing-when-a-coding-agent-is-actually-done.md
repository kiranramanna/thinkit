---
layout: post
title: "Knowing When a Coding Agent Is Actually Done"
date: 2026-11-18 03:05:05 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.14960"
discussion_url: https://huggingface.co/papers/2611.14960
source_url: https://arxiv.org/abs/2611.14960
---

The quietly alarming number in this [termination-lag paper](https://arxiv.org/abs/2611.14960) isn't how often coding agents succeed — it's how long they keep running after they already have. Across five models, two frameworks, and three SWE-bench datasets, 38–82% of successful runs land a correct patch on the *first* source edit. Then the agent keeps going anyway.

That gap between "solved" and "stopped" is where the budget goes. The authors clock post-solution steps at a median of 35–37% for one model and 54–60% for another — half the run spent re-verifying and re-exploring a repo that was already fixed. Most of that is harmless waste. The part that isn't: in 1–8% of cases, the extra activity *undoes* the correct patch and ships something broken.

- 🎯 **The hard problem is stopping, not solving** — a correct first patch is common; recognizing it is not
- 💸 **Half the token bill can be post-solution** — verification loops that change nothing but still cost
- ⚠️ **Over-verification has a failure mode** — continued edits can regress a working fix
- 🔍 **"Keep exploring" is a weak default** — agents rarely carry a confident termination signal
- 📊 **Instrument the trajectory, not the final diff** — log every distinct patch the run produces

In production this reframes a chunk of agent-reliability work. We pour effort into teaching agents to try harder, when the data says a disciplined stop — snapshot the first passing patch, gate further edits behind a real confidence check — buys both latency and correctness at once. The per-model and per-framework breakdown is on the [HF paper page](https://huggingface.co/papers/2611.14960).

If an agent is right on its first edit most of the time, is your orchestrator even built to notice — or does it only know how to keep going?
