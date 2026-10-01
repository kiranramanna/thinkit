---
layout: post
title: "More Agent Actions Only Help If You Can Judge Them"
date: 2026-10-01 14:07:59 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.39982"
discussion_url: https://huggingface.co/papers/2609.39982
source_url: https://arxiv.org/abs/2609.39982
---

Terminal agents fail in a way that's easy to underestimate: a single bad command doesn't just waste a turn, it changes the environment so the next turn starts from a worse place. A wrong package install, a clobbered file — the model might have had a better action in it, but it never gets the chance once the bad one executes. ["Mid-Harness"](https://arxiv.org/abs/2609.39982) asks where to spend test-time compute to stop that, and lands somewhere I didn't expect: the model-harness boundary, before anything runs.

The move is to sample several candidate actions and verify one before forwarding it to execution, leaving the generator and harness untouched. The finding that matters for anyone budgeting compute: sampling more actions does almost nothing under a weak verifier. On TerminalBench-Lite a 9B generator barely improves with eight sampled actions — until you put a strong verifier in front, which lifts Pass@1 from 50% to 68% on the very same generator. The bottleneck was never idea generation; it was judgment.

The economics are the interesting part. Distilling the strong verifier back into the 9B model keeps most of the gain without paying for an expensive judge at inference, and action-level scaling reaches higher success at lower token cost than just running more full trajectories. That's a real lever: most agent stacks I've seen scale the wrong axis, re-rolling whole trajectories when the cheaper win is catching the one destructive action per run.

The [HF paper page](https://huggingface.co/papers/2609.39982) frames this as test-time scaling, but operationally it's a guardrail argument — the harness is the natural place to gate irreversible actions, and most of ours don't. If you're running agents against a real shell, which costs you more: the actions your model can't generate, or the ones it shouldn't have been allowed to run?