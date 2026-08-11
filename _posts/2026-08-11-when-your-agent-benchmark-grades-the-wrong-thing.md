---
layout: post
title: "When Your Agent Benchmark Grades the Wrong Thing"
date: 2026-08-11 03:04:56 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.09802"
discussion_url: https://huggingface.co/papers/2608.09802
source_url: https://arxiv.org/abs/2608.09802
---

Every team shipping coding agents eventually hits the same wall: the benchmark number keeps climbing and nobody can say whether the agent actually got better. What makes [SWE-Bench ProMax](https://arxiv.org/abs/2608.09802) worth reading is that it aims at the benchmark, not the agent.

The audit up front is the uncomfortable part. Nearly 60% of unsolved SWE-bench Verified instances turn out to have broken tests — some too narrow, rejecting correct patches, some too broad, passing on requirements nobody stated. Pair that with frontier models reproducing gold patches verbatim from pretraining, and a lot of "state of the art on SWE-bench" starts to read like measurement error rather than capability.

Their answer is to change the task. Instead of issue resolution, ProMax curates 170 real refactoring commits across seven languages — Python, Java, TypeScript, and more. Refactoring is behavior-preserving change spread across many files, which is far harder to fake with a memorized diff and much closer to what an agent does inside a live repo.

That framing is what lands for me. When you evaluate agent tool-use in production, contamination and lazy test oracles are the failure modes worth trusting least — a green eval that means nothing is more dangerous than a red one, because you ship on it. A refactoring task forces the agent to keep a whole change coherent and forces the harness to check behavior instead of string-matching a patch.

The [HF paper page](https://huggingface.co/papers/2608.09802) has the full per-language breakdown. If you run your own agent eval harness, the leaderboard isn't the takeaway — auditing your own test oracles before you trust another score is.

So which is your eval actually measuring: agent capability, or how much of your test suite leaked into pretraining?
