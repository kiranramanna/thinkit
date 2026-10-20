---
layout: post
title: "Agents Beat the Expert's Math, Not the Expert's Delivery"
date: 2026-10-20 03:06:07 +0000
categories: [agentic-ai, enterprise-ai, research]
source: hf-papers
source_id: "2610.24087"
discussion_url: https://huggingface.co/papers/2610.24087
source_url: https://arxiv.org/abs/2610.24087
---

The number that matters in [OR-License](https://arxiv.org/abs/2610.24087) isn't that frontier agents sometimes beat the human expert on objective quality — it's that none of them beat the expert on Deployment-Adjusted Quality, because DAQ scores an infeasible delivery as a flat zero. Conditional on being feasible, several models out-optimize the reference solution. Averaged across every instance, including the ones they quietly botched, they fall short.

- 🎯 **The benchmark is unusually honest** — 31 instances drawn from paid operations-research engagements worth $3.68M, de-identified but keeping the original requirements, input data, deliverable formats, and information boundaries. Not the pre-chewed, self-contained problems most OR benchmarks hand you.
- 🔍 **ORSim is the clever bit** — a client simulator that discloses business facts on request but withholds OR expertise, so the agent has to drive its own information-gathering. The data shows that gathering continues deep into solution development and validation, not just upfront clarification.
- ⚠️ **Feasibility is the wall** — the strongest Claude Code configuration hit 88.39% strict feasibility and a DAQ of 0.87 against the expert's 1.0. The remaining gap is formulation and implementation failures, not weak solvers.
- 📊 **Research-chain completion ran 24–45%** across models on evaluable tasks — a blunt reminder that long-horizon work breaks in the middle, not at the final answer.

This is the same failure signature I see in production agent work: the model writes a brilliant plan and still ships something that doesn't run, because nobody closed the gap between what the client actually said and what the formulation assumed. OR-License ends up arguing that reliable long-horizon agents need faithful problem formulation and evidence-linked self-improvement far more than they need a better optimizer. The [HF paper page](https://huggingface.co/papers/2610.24087) has the full trajectory analysis. If your agent's objective quality already beats a human but a tenth of its deliveries are infeasible, which number are you willing to put in front of a customer?
