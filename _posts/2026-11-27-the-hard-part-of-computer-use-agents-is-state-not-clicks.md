---
layout: post
title: "The Hard Part of Computer-Use Agents Is State, Not Clicks"
date: 2026-11-27 14:06:00 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.34232"
discussion_url: https://huggingface.co/papers/2611.34232
source_url: https://arxiv.org/abs/2611.34232
---

The number that jumps out of OS-Omni isn't a success rate — it's 67.54 interaction steps per task, against OSWorld's reference of 15. That gap is the whole argument. Most computer-use benchmarks test whether an agent can find and click the right control; this one tests whether it can hold a goal together across sixty-plus steps and leave the system in the right final state.

The [benchmark](https://arxiv.org/abs/2611.34232) runs agents live across Windows, Ubuntu, macOS, iOS, Android, and the web, including workflows that pair a desktop with an Android phone. The strongest agent evaluated, Claude Opus 5.5, reaches 68.5% average success — 8.8 points behind a 77.3% human reference. But the average buries the signal: frontier models beat humans on Linux and trail them by more than 25 points on iOS and macOS. Platform robustness, not raw capability, is where they come apart.

That unevenness is exactly what I'd carry back to a production agent harness. A single blended success number is the metric that lets a regression hide — strong on the environment you test most, quietly broken on the one a user actually opens. The design choice I like here is the executable final-state evaluators: grade the world the agent left behind, not the trajectory it claimed to follow. An agent that books the calendar entry but never commits the cart update two steps later fails the task while passing every action-level check. The [HF paper page](https://huggingface.co/papers/2611.34232) has the per-platform breakdown.

If your agent eval still reports one success rate across environments, you're measuring the easy fifteen steps. What does the number look like at sixty-seven?
