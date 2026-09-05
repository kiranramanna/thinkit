---
layout: post
title: "Rewarding Long-Horizon Agents When There's No Checker"
date: 2026-09-05 14:03:56 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.04094"
discussion_url: https://huggingface.co/papers/2609.04094
source_url: https://arxiv.org/abs/2609.04094
---

Most writing about agent RL quietly assumes you have a checker — a unit test, a database assertion, something that returns pass or fail at the end. In real long-horizon agent work you usually don't. The task is "resolve this ticket" or "finish this workflow," and no programmatic oracle is waiting at the finish line. That gap is where reward design actually lives, and it's what [DRACO](https://arxiv.org/abs/2609.04094) goes after.

The setting is outcome-blind: no ground-truth success signal. Rubrics are the usual workaround — score a trajectory against a few criteria — but a rubric collapses a run of thirty steps into one scalar. Credit assignment across those steps is the hard part, and a single number smeared evenly over all of them teaches the policy almost nothing about which action mattered.

DRACO generates rubrics dynamically during training so they track what the policy can currently do, scores them once per completed trajectory, then redistributes that judgment onto the specific steps each rubric item covers, producing differentiated per-step advantages inside GRPO. The redistribution is closed-form — no separately trained attribution module to babysit, which is the part I care about operationally. On AppWorld it gains 15.9 points over the base model and 5.3 over GRPO trained with a real sparse ground-truth reward, without using a verifier itself; on out-of-domain Tau-Bench it holds a 5.3-point gain. The [HF paper page](https://huggingface.co/papers/2609.04094) has the ablations, and the code is on GitHub.

What makes this land for production is its honesty about not having verifiers. Most enterprise agent tasks will never get a clean checker, so the real question isn't "can we run RLVR" — it's how good a reward you can synthesize from rubrics you actually trust. If a closed-form redistribution can beat a genuine sparse reward, how much of your eval harness is scoring at the wrong granularity?
