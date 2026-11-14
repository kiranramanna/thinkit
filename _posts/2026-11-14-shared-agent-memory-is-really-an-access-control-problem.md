---
layout: post
title: "Shared Agent Memory Is Really an Access-Control Problem"
date: 2026-11-14 14:05:51 +0000
categories: [agentic-ai, llm-ops, enterprise-ai, research]
source: hf-papers
source_id: "2611.10439"
discussion_url: https://huggingface.co/papers/2611.10439
source_url: https://arxiv.org/abs/2611.10439
---

Self-evolving agents that learn from their own runs are fine until you have more than one user. The moment several users share a pool of agents, "remember this lesson" quietly becomes "who is allowed to remember this lesson" — and that is a governance question wearing a memory-system costume. [MixUA](https://arxiv.org/abs/2611.10439) treats it as one.

- 🎯 Each user-agent trajectory is distilled into lessons, and every lesson gets a **scope** — pair, user, agent, or global — chosen by who it helps and what it might disclose.
- 🔍 Their benchmark, CrossLearnBench, pairs real agent tasks with **privacy probes** that check whether a private fact leaks into memory another user can read.
- 📊 With five users and seven agents, scoped memory lifted pass rates up to 16 points over no memory and 5 over a single global memory.
- ⚡ Lessons transferred to tasks a user had never attempted, as long as some other user-agent pair had — the actual payoff of cross-learning.
- ⚠️ At most 0.02% of privacy probes found a planted secret in a forbidden scope, which is the number that decides whether you can ship this at all.

The accuracy lift is pleasant; the privacy probe is the real contribution. Most memory systems I've seen treat "shared memory" as one bucket, and in a multi-tenant deployment a bucket that leaks one customer's preferences into another's context is a far worse incident than one that forgets. The [HF paper page](https://huggingface.co/papers/2611.10439) has the scope-assignment details. Worth a look — then ask how your own agent memory decides what's shareable. Right now, does it decide at all, or does it just append?
