---
layout: post
title: "Terminal Agents That Learn Without Gaming the Benchmark"
date: 2026-09-12 14:03:38 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.11042"
discussion_url: https://huggingface.co/papers/2609.11042
source_url: https://arxiv.org/abs/2609.11042
---

Most of the reported gains on agent benchmarks come from a harness someone hand-tuned against that exact benchmark. [T1](https://arxiv.org/abs/2609.11042) is interesting because it goes the other way: it post-trains the model itself with RL against a real shell — 300+ tool-call turns in a cloud sandbox, rewarded by running each task's own verifier — and it deliberately trains on tasks disjoint from the eval. That last decision is the one worth stealing.

The recipe has the usual RL-stability plumbing, and it earns its place. A dense process reward scores a trajectory by the raw count of passing verifiers rather than a single pass/fail at the end, which is the only sane signal over a 300-turn episode. On the optimization side, they cut the train-vs-inference log-probability gap from 0.021 to 0.013 by training on the exact sampled tokens and replaying the sampler's per-expert routing choices through the MoE — the kind of drift that silently poisons long-horizon RL if you ignore it. The numbers: a 122B-total MoE goes from 43.8% to 64.0% on Terminal-Bench 2.1, and 27.9% on Long-Horizon Terminal Bench, ahead of GPT-5.4 and GLM-5.1. The [HF paper page](https://huggingface.co/papers/2609.11042) has the ablations.

Almost nobody reading this is going to RL a 122B agent. What transfers is the discipline: train on seeds and synthesized tasks that share no ground with your eval, so a score increase means capability transfer instead of the harness memorizing the test set. I've watched enough agent evals inflate because the scaffolding was quietly fit to the benchmark to trust that framing more than another leaderboard row. The open worry is reward hacking — when the verifier *is* the reward over hundreds of turns, the agent will find the cheapest path to a green check, and that isn't always the one you wanted. How confident are you that your task verifiers can't be gamed?
