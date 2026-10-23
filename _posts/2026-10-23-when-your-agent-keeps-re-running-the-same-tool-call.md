---
layout: post
title: "When Your Agent Keeps Re-Running the Same Tool Call"
date: 2026-10-23 03:05:50 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.19376"
discussion_url: https://huggingface.co/papers/2610.19376
source_url: https://arxiv.org/abs/2610.19376
---

The failure mode in [DeLoop](https://arxiv.org/abs/2610.19376) is one I've watched eat real latency budgets: a long-running agent re-issues a tool call it already made, gets back the identical observation, and learns nothing — except that it's now one step closer to its step cap. The paper names this a loop, and the detail that matters for anyone running agents in production is *when* it gets worse. Once you compress the agent's history to fit the context window, loops go from occasional to dominant.

That's not an edge case. Context compression is the thing you reach for the moment a trajectory outgrows its window, which on any non-trivial task is early. So the paper is really describing a tax you pay precisely when the agent is doing the hard, multi-step work you deployed it for.

What I like about the fix is that it needs nothing you have to build a pipeline around. DeLoop treats the agent's own rollout as supervision: a looping action is the negative, the first later non-looping action in the same trajectory is the positive, and it learns from those pairs with DPO. No task rewards, no gold answers, no LLM judge sitting in the critical path. For teams who've tried to bolt loop detection onto an eval harness, skipping the judge is the interesting part.

The numbers are the kind you can act on. On CodeGym under compression, Qwen3-8B's share of looping tasks drops from 57.3% to 6.1%, at roughly a third of the steps per task with similar success. On Qwen3-32B, loops and steps fall *and* success climbs from 37.7% to 44.8%. Fewer steps at equal-or-better success hits both your latency SLA and your token bill at once.

Read the [arXiv paper](https://arxiv.org/abs/2610.19376); the [HF paper page](https://huggingface.co/papers/2610.19376) collects the discussion. The open question for me: loop suppression learned from a model's own rollouts sounds like it could overfit to "keep moving" and quietly kill a legitimate retry. Where's the line between a wasteful loop and a necessary second attempt?
