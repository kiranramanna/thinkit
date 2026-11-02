---
layout: post
title: "The Tool Interface Is Part of Your Agent's Decision Loop"
date: 2026-11-02 03:11:28 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.34298"
discussion_url: https://huggingface.co/papers/2610.34298
source_url: https://arxiv.org/abs/2610.34298
---

Most of us treat the choice between MCP and a CLI wrapper as plumbing — a packaging detail under the agent. This [arXiv paper](https://arxiv.org/abs/2610.34298) argues it sits inside the decision loop instead, and backs it with the control I keep wishing these comparisons had: hold the capability fixed and change only how it's presented.

Their harness (MICA) renders MCP and CLI from one shared semantic action contract and routes decoded actions through the same runtime. Same operations, same execution, only the model-facing representation differs. If the interface were neutral, behavior would be identical. It isn't.

- 🎯 **Matched capabilities, different behavior**: across six models and three environments, swapping only the presentation moved both task score and interaction cost — not a rounding error.
- 🔍 **Divergence compounds**: paired trajectories split in 94.3% of 2,004 episodes, and early interface-driven differences propagate downstream into action selection, failure paths, and recovery.
- ⚡ **DART repairs realization, not intent**: keep the validated semantic command, fix only the interface-specific rendering — up to +9.0 benchmark points in all six settings and up to 27.1k fewer MCP tokens per task.
- 💡 **It's a lever you own**: unlike the weights, interface realization is something you control at deploy time.

What I take from this: if you're A/B-ing agent quality, the interface is a confound you're probably not holding constant. The [HF paper page](https://huggingface.co/papers/2610.34298) has the per-environment breakdowns. When your agent's pass rate jumps after a "harmless" migration from CLI tools to an MCP server, was that the model getting better — or just the presentation it happened to prefer?
