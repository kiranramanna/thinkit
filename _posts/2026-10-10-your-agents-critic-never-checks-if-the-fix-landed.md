---
layout: post
title: "Your Agent's Critic Never Checks If the Fix Landed"
date: 2026-10-10 03:07:57 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.33987"
discussion_url: https://huggingface.co/papers/2609.33987
source_url: https://arxiv.org/abs/2609.33987
---

The critics we bolt onto coding agents are mostly fire-and-forget. They watch a trajectory, flag what looks wrong, hand over a note, and move on. Nobody checks whether the agent actually fixed the thing or just acknowledged it and kept drifting. That gap — between the agent complying with feedback and the problem actually being resolved — is where long-horizon runs quietly go sideways.

[Opera](https://arxiv.org/abs/2609.33987) treats a correction as a persistent note rather than a one-shot message. It decides when to review on periodic and event-driven triggers, diagnoses with typed operators, audits its own feedback against visible evidence before delivering it, and — the part I care about — keeps tracking the agent's next actions to tell mere compliance apart from actual resolution. A critic that follows up is a different object than a critic that comments.

The numbers are the kind I'd run against my own harness: up to 12.4, 15.0, and 8.9 points of resolve-rate improvement on Terminal-Bench 2.1, a SWE-Bench Pro subset, and DeepSWE, across four policy models, as a pure test-time critic. But the result that matters operationally is the transfer one: fine-tuning a 9B model on Opera-guided rollouts lifted held-out resolve rate by 10.2 points with no critic at inference, and the gain survived switching the agent from Openhands to Terminus-2 — a harness swap that otherwise degrades the model. On-policy-ish training data that doesn't rot when you change scaffolding is rare.

The [HF paper page](https://huggingface.co/papers/2609.33987) frames this as a critic design, but the reusable idea is the audit-before-deliver step. Most of our guardrails emit feedback they never verify and never reconcile. If the critic has to check its own diagnosis against evidence and then confirm the fix landed, half the noisy interventions never get sent.

So here's the question I'm sitting with: if your agent's critic had to prove the last fix resolved before it was allowed to speak again, how many of its corrections would it still make?
