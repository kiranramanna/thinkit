---
layout: post
title: "The Case Against Trusting a Model's Self-Reports"
date: 2026-09-19 03:03:54 +0000
categories: [llm-ops, agentic-ai, research]
source: hn
source_id: "49758689"
discussion_url: https://news.ycombinator.com/item?id=49758689
source_url: https://arxiv.org/abs/2609.02852
---

Nearly every guardrail we put in front of an agent reads the model's own words. Chain-of-thought monitors scan the reasoning trace, constitutional self-critique asks the model to check itself, and activation probes hunt for linguistically-defined feature vectors. James Mickens' [paper on linguistic illegibility](https://arxiv.org/abs/2609.02852) makes the case that all of these share one unfixable flaw: they trust a lossy translation.

The argument is clean. An LLM computes in activation space — math, not language — and what comes out, or what a probe reads back, is a translation at the bookends. When that translation fails to reflect the actual computation, Mickens calls it "linguistic illegibility," and he argues it isn't a bug you can train away: it's structural. If a model's self-report can always diverge from what it is really doing, then any security mechanism reading that self-report can never be completely sound.

The constructive half is what makes this useful rather than nihilistic. The proposal is to stop reading the model's linguistic state at all for your hard guarantees, and instead treat model output as tainted data. Taint tracking lets you define, up front, which pieces of system state model-produced tokens may never influence — regardless of how convincingly the model narrates its own good behavior. Robust virtualization and third-party auditing of the sandbox config sit underneath as a floor.

This lines up with where I've watched production agent security actually go: you don't secure a tool call by trusting the plan the agent wrote, you sandbox what the tool is allowed to touch. The [HN discussion](https://news.ycombinator.com/item?id=49758689) splits on whether CoT monitoring still earns its keep as defense-in-depth — I think it does, as long as nobody mistakes it for the floor.

If your only guardrail is a model grading its own reasoning, what stops one that has learned to write a clean trace while doing something else entirely?
