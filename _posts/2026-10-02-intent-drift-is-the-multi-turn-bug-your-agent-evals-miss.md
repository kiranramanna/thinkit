---
layout: post
title: "Intent Drift Is the Multi-Turn Bug Your Agent Evals Miss"
date: 2026-10-02 14:08:15 +0000
categories: [agentic-ai, conversational-ai, llm-ops, research]
source: hf-papers
source_id: "2609.32520"
discussion_url: https://huggingface.co/papers/2609.32520
source_url: https://arxiv.org/abs/2609.32520
---

Most agent eval harnesses test a clean, single-turn task: here's the request, did the agent do it. Real users don't work that way. They start down one path, change their minds, drop a constraint, add another — and the agent has to act on what's true *now*, not on everything that was ever said.

[IntentFlux](https://arxiv.org/abs/2609.32520) puts a number on how badly that breaks. The benchmark converts verifiable tasks into multi-turn dialogues with controlled intent changes — additions, deletions, replacements — while keeping the original graders intact. Mean task score falls from 0.476 to 0.384 as superseded and withdrawn information piles up, and across eight models the fully-correct rate is markedly lower when the final task has to be recovered from an evolving conversation instead of handed over in one turn. That's the gap between a demo and a deployed assistant.

The mitigation, StateForge, is the part worth stealing: maintain the active requirements explicitly before each generation step instead of trusting the model to re-derive intent from the whole transcript. It lifts mean score from 0.367 to 0.467 — real, not magic. And the honest result is that even feeding the ground-truth final state doesn't fully close the gap, so state-estimation errors only explain part of the problem.

In production terms, this says tracking a live requirements state alongside the conversation isn't optional scaffolding — it's the difference between an agent that honors "actually, cancel that" and one that quietly books the flight you just withdrew. The [HF paper page](https://huggingface.co/papers/2609.32520) has the full setup.

If your agent eval suite is still single-turn, what's your real coverage of the case where the user changes their mind halfway through?
