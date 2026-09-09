---
layout: post
title: "When Your Coding Agent Rewrites More Than the Bug"
date: 2026-09-09 03:09:23 +0000
categories: [research, agentic-ai, llm-ops]
source: hf-papers
source_id: "2609.04061"
discussion_url: https://huggingface.co/papers/2609.04061
source_url: https://arxiv.org/abs/2609.04061
---

Anyone who has shipped a coding agent knows the failure mode this paper names: the fix works, but the diff is three times larger than it needed to be. [When Models Edit Too Much](https://arxiv.org/abs/2609.04061) argues that edit fidelity — how minimal and faithful a repair is — is a distinct quality axis from correctness, and that most of us have been measuring only half the problem.

The setup is clean. Inject AST-level corruptions into 400 BigCodeBench solutions so every task has a known minimal patch, then measure how far each model strays from it. Over-editing shows up everywhere, including strong models like GPT-5.5: high Pass@1 coexists happily with bloated edits and added cognitive complexity. A single preservation instruction pulls average excess Levenshtein distance from 0.195 to 0.131, cuts added complexity by 26.6%, and nudges Pass@1 up 2.3 points. The [HF paper page](https://huggingface.co/papers/2609.04061) has the full breakdown.

For production agents this reframes what to log. If your eval harness tracks only pass rates, you're blind to the thing reviewers actually complain about — noisy diffs that turn a one-line fix into an un-reviewable rewrite. The finding I'd bet on is the training result: supervised fine-tuning overfit to the corruption patterns it had seen, while reinforcement learning generalized better on edit fidelity out of domain. So the cheap win is a preservation instruction in your system prompt today; the durable win is training for minimal edits rather than prompting for them. The open question is whether edit fidelity survives contact with real repositories, where "minimal" is a judgment call no AST diff can make for you.
