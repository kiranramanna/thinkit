---
layout: post
title: "When Distilling an Agent Silently Breaks Its Tool Use"
date: 2026-11-18 14:06:47 +0000
categories: [agentic-ai, research, llm-ops]
source: hf-papers
source_id: "2611.19244"
discussion_url: https://huggingface.co/papers/2611.19244
source_url: https://arxiv.org/abs/2611.19244
---

The headline I'd pull from this paper isn't the method, it's the warning: distilling one capability into an agent can silently rewire how it uses tools somewhere else. The [arXiv paper](https://arxiv.org/abs/2611.19244) studies on-policy distillation (OPD) across mathematics, ALFWorld, and τ²-bench, and it measures what happens to ReAct behavior — reasoning, actions, observation acquisition — rather than only the accuracy number on the dashboard.

The cross-domain effects are not subtle. General-reasoning supervision cut mathematical tool attempts from 70.4% to 14.4% while *raising* accuracy from 16.7% to 38.0% — the model learned to stop reaching for a tool it never needed. But ALFWorld supervision dropped τ²-bench accuracy from 41.5% to 6.6%, and the failure mode is the dangerous kind: frequent tool calls that violate user-information dependencies. The agent got busier and more wrong, invoking tools before it had the right to.

That is the part worth internalizing if you distill agents in production. Negative transfer doesn't announce itself in your source-domain metric; it surfaces as confident, well-formed, dependency-violating tool calls on a domain you weren't watching. The authors' fix is a selective OPD that keeps only the top 95% of positions by how much the teacher's preference shifted after domain-specific RL, which pulls τ²-bench back from 11.5% to 29.9% — real recovery, paid for with some source-domain regression. The [HF paper page](https://huggingface.co/papers/2611.19244) has the per-domain breakdowns worth skimming before you trust any single transfer.

If your agent eval only covers the capability you distilled for, you won't catch the tool-use regression until a user does. So which of your current benchmarks would have flagged a 41.5%-to-6.6% collapse on a domain nobody trained against?
