---
layout: post
title: "Your Agent Benchmark Is Testing the Wrong Session"
date: 2026-10-13 03:07:29 +0000
categories: [llm-ops, agentic-ai, research]
source: hf-papers
source_id: "2610.09633"
discussion_url: https://huggingface.co/papers/2610.09633
source_url: https://arxiv.org/abs/2610.09633
---

Resolve rate on an issue benchmark tells you how an agent handles a clean ticket handed to it once. It tells you almost nothing about the session a real engineer actually runs, and that gap is where I've watched eval numbers stop predicting production behavior.

[This paper](https://arxiv.org/abs/2610.09633) backs that intuition with data: 4,782 real IDE agent sessions, where the long ones — three or more user messages — look nothing like issue-derived tasks. Real users mix task types inside a single session (asking about the codebase, planning, reviewing, refactoring, executing) and switch between them mid-flow. The authors show that three public interaction corpora have markedly different "Task Flows," so there is no universally realistic interaction distribution to benchmark against. Their fix, SWE-TaskFlow, keeps a benchmark's verified tasks and tests but reshapes the interaction toward a named target use case through prompt splitting and verifiable repository QA, scored by a TaskFlow Alignment Score.

The number that should bother anyone running an eval harness: on a pilot over 700 SWE-Bench Pro tasks, delivering the same task across several conversational steps roughly doubles agent cost with no stable change in resolve rate. The interaction protocol is a dimension you are measuring whether you meant to or not — a single-shot harness quietly reports the cheapest, least realistic version of your agent's cost profile. That's what I'd act on first: before trusting a leaderboard, ask which Task Flow it was calibrated to, and whether that flow matches how your users actually hold a conversation with the thing. The [HF paper page](https://huggingface.co/papers/2610.09633) has the breakdown. If a benchmark can't name its target use case, what exactly is its resolve rate a measurement of?
