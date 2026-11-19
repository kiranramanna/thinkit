---
layout: post
title: "Self-Improving Agents Stall at the Eval, Not the Idea"
date: 2026-11-19 14:06:53 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.23068"
discussion_url: https://huggingface.co/papers/2611.23068
source_url: https://arxiv.org/abs/2611.23068
---

Every agent self-improvement loop has the same two moving parts: a proposer that writes new prompts, skills, or memories, and a selector that keeps whatever scores higher. The [Resolution Hypothesis paper](https://arxiv.org/abs/2611.23068) argues the proposer is rarely where things break. Helpful candidates usually exist in the pool — but across seven evolution methods and six models (north of 10M LLM calls), selection was no better than random at separating them from the harmful ones, so errors compound every round.

That lines up with what I keep seeing when building eval harnesses for production agents: the judge *is* the system. If your scoring is noisy, a smarter proposer just gives the noise more surface area to hide in. The second finding is the one that should make anyone running method comparisons uncomfortable — the few-point margins between published approaches are smaller than the gap between two runs of the *same* method. A chunk of the leaderboard is measuring luck.

The shift the authors push for is away from "design a cleverer improvement engine" and toward making real improvements detectable and accumulable. In practice that means spending your compute budget on reducing evaluation variance — more seeds, tighter rubrics, judges calibrated against ground truth — before you spend it on a fancier mutation operator. The [HF paper page](https://huggingface.co/papers/2611.23068) has the full method and model breakdown.

If a genuine improvement can't be told apart from run-to-run noise, does it really matter that your agent proposed it?
