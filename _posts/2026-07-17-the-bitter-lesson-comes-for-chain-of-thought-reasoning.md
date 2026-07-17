---
layout: post
title: "The Bitter Lesson Comes for Chain-of-Thought Reasoning"
date: 2026-07-17 03:03:37 +0000
categories: [research, llm-ops]
hn_id: 48940603
hn_url: https://news.ycombinator.com/item?id=48940603
source_url: https://arxiv.org/abs/2607.12395
---

Most reasoning evals score the final answer and throw the chain of thought away. The most useful part of [Ring-Zero](https://arxiv.org/abs/2607.12395) is that it refuses to.

The paper scales "zero RL" — reinforcement learning from verifiable rewards, no human-annotated data — to a trillion parameters, territory almost every published zero-RL result has avoided for compute reasons. The finding I'd flag for anyone running reasoning models: naive scaling produces long, redundant, hard-to-read chains, and fixing that took real systems work — clipped importance sampling, training-inference ratio correction, mixed-precision control. "Just scale it" is not a plan; the pipeline is the plan.

Two claims are worth sitting with. First, training moves through a discovery phase and then a sharpening phase — the model finds behaviors, then compresses them. If that generalizes, your eval cadence during RL matters as much as your reward function, because the same checkpoint means different things at different phases. Second, the authors report emergent behaviors — self-verification, parallel reasoning, structured formatting, even something they call "context anxiety" — showing up on their own, which makes hand-written reasoning heuristics redundant.

The part I'll actually borrow is the CoT eval framework: comprehensibility, reproducibility, and efficiency, scored separately from final-answer correctness. In production, a reasoning trace that reaches the right answer via an unreadable 4,000-token detour is a liability — it's slower, costs more, and you can't audit it when it's wrong. Final-answer accuracy hides all of that. The [HN discussion](https://news.ycombinator.com/item?id=48940603) is mostly about the trillion-parameter headline, but the reusable idea here is smaller and more portable: measure the reasoning, not just the result.

If a model self-verifies without being told to, does your harness even have a column for that?
