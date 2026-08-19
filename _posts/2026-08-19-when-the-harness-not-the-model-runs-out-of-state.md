---
layout: post
title: "When the Harness, Not the Model, Runs Out of State"
date: 2026-08-19 03:08:20 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.15089"
discussion_url: https://huggingface.co/papers/2608.15089
source_url: https://arxiv.org/abs/2608.15089
---

Most long-horizon agent failures I've traced aren't reasoning failures. The
model could solve every step in isolation. What breaks is everything around
the step: the agent forgets a mutable value it set three tool calls ago,
re-runs a procedure it already finished, or stops before the task is actually
done. [StateM](https://arxiv.org/abs/2608.15089) makes exactly that its thesis
— scale the harness, not the weights.

The runtime organizes execution around durable states, phase-local context,
checked transitions, and recoverable runbooks, plus versioned procedural
practices that both the agent and a human can inspect. That last piece is the
tell. Treating the execution trace as a first-class, inspectable artifact is
precisely what you need when an agent run goes sideways in production and
someone has to reconstruct why after the fact. It reports 95.3% raw accuracy
on Terminal-Bench 2.1 for roughly $15 a run, but the number matters less than
the mechanism that produced it.

This lands where I keep landing on multi-agent orchestration: the leverage is
in state management and checked transitions, not in another point of raw model
capability. If your agent loses the thread on step 12 of 20, a smarter model
buys you step 13 — a better harness buys you all of them. The
[HF paper page](https://huggingface.co/papers/2608.15089) has the full
breakdown. The question I'd want answered before adopting any of this: how
much of that 95.3% survives when the runbook itself is wrong and the agent has
to recover from a bad procedure, not just a bad step?
