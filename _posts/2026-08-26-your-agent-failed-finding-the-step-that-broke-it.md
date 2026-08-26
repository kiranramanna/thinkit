---
layout: post
title: "Your Agent Failed. Finding the Step That Broke It"
date: 2026-08-26 03:02:57 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.15242"
discussion_url: https://huggingface.co/papers/2608.15242
source_url: https://arxiv.org/abs/2608.15242
---

"The task failed" is the least useful sentence in agent ops. When a 145-step run goes sideways, outcome-level eval tells you it broke; it doesn't tell you the one handoff where the trajectory actually went wrong. [LongRCA Bench](https://arxiv.org/abs/2608.15242) goes straight at that gap.

It's 1,140 real failed trajectories across five domains — no injected bugs — with independent human labels for two distinct things: the responsible role and the earliest decisive root-cause step. That separation is the point. Knowing which sub-agent owns a failure isn't the same as knowing which of its steps started it, and scoring them apart exposes how differently hard the two problems are.

The humbling number: the strongest baseline reaches 13.2% exact root-step accuracy. Current models are close to useless at pinpointing where a long run derailed. The authors' training-free method, RCTA — retrieve candidate error steps from segment summaries, then trace them back to earlier handoff instructions — roughly doubles that to 24.1%, and lands 51.1% on responsible-role. Better, still not something you'd hand an on-call engineer at 3am.

For anyone running multi-agent orchestration in production, this is the observability hole we've been papering over. We instrument latency and token spend obsessively, then debug failed runs by reading transcripts by hand. Root-cause localization deserves to be a first-class metric in the eval harness, not a manual post-mortem. The [HF paper page](https://huggingface.co/papers/2608.15242) has the full protocol and baselines.

If the best method still misses three of every four root steps on real traces, what are our agent "reliability" dashboards actually measuring?
