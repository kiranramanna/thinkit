---
layout: post
title: "Your Agent's Worst Habit Is the Silent Assumption"
date: 2026-09-08 03:03:44 +0000
categories: [agentic-ai, conversational-ai, research]
source: hf-papers
source_id: "2609.05258"
discussion_url: https://huggingface.co/papers/2609.05258
source_url: https://arxiv.org/abs/2609.05258
---

[OR-Clarify](https://arxiv.org/abs/2609.05258) benchmarks the one thing most agent evals quietly assume away: whether the agent knows its instructions are incomplete before it acts. The setup withholds formulation-critical slots from an optimization request and scores the agent on recovering them through bounded interaction with a simulated user — not on solving the problem it was handed. That's the right frame. In production the request is almost never complete.

- 🎯 **The failure mode is the silent assumption**, not the wrong answer — an agent that invents a missing constraint and proceeds looks confident and is wrong in a way no downstream check catches.
- 🔍 **Clarification is really two decisions**: diagnose what's actually missing, then decide whether the next question is worth its interaction cost. InterOPT splits those apart, and the split is what beats the baselines on exact slot recovery.
- ⚠️ **Knowing when to stop matters as much as knowing when to ask** — an agent that re-interrogates the user on every turn is as useless as one that never asks at all.
- ⚡ **Interaction cost belongs in the metric** — every clarifying question spends user patience, and an eval that ignores that quietly rewards the wrong behavior.
- 💡 **This generalizes well past OR** — swap the optimization program for a workflow, a retrieval query, or a tool call and the same selective-completeness decision separates a virtual agent people trust from one they route around.

The benchmark details live on [Hugging Face](https://huggingface.co/papers/2609.05258) if you want to run it. What I keep coming back to: we pour enormous effort into making agents answer, and almost none into teaching them to notice when they shouldn't answer yet.
