---
layout: post
title: "Same Solve Rate, Very Different Coding Agents"
date: 2026-11-17 03:05:10 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.17440"
discussion_url: https://huggingface.co/papers/2611.17440
source_url: https://arxiv.org/abs/2611.17440
---

Every coding-agent leaderboard I've seen reports one number: did it close the task or not. That number hides the part I actually care about when I'm operating these things in production — *how* the agent got there, and whether two agents with the same score are even doing the same job.

This paper [on arXiv](https://arxiv.org/abs/2611.17440) parses 143,209 execution trajectories across 125 agent configurations and 117 models into high-level actions — repository search, file editing, test execution — and the headline lands hard: agents with nearly identical solve rates explore, edit, and verify code in substantially different ways. The sharper result is that the behavioral profile alone, without task outcomes or token counts or even tool names, is distinctive enough to re-identify which agent stack produced a set of runs across repositories it has never touched. The *shape* of the work fingerprints the agent.

For anyone running an eval harness on tool use, that reframes what you should be logging. Pass/fail tells you whether to ship; the trajectory tells you why your P99 blew up, why one scaffold burns three times the tool calls for the same result, and which reasoning-effort setting quietly changed how aggressively the agent writes tests. The authors release a deterministic parser and annotation pipeline, which is the part I'd pull first — behavioral metrics are only worth trusting if the mapping from raw trace to action is reproducible. The [HF paper page](https://huggingface.co/papers/2611.17440) has the release details. If your agent eval still stops at the solve rate, you're grading the essay by whether it got turned in.
