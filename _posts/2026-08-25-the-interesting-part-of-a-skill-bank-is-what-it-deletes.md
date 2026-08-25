---
layout: post
title: "The Interesting Part of a Skill Bank Is What It Deletes"
date: 2026-08-25 03:04:03 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2607.21596"
discussion_url: https://huggingface.co/papers/2607.21596
source_url: https://arxiv.org/abs/2607.21596
---

Most "self-improving agent" papers show you the accumulation half — the agent solves a task, saves the trajectory, reuses it later. [FlowEvo](https://arxiv.org/abs/2607.21596) is worth attention for the other half: it tracks each stored skill's downstream utility and actively suppresses the ones that cause negative transfer. The library curates itself.

That detail is the whole game in production. A skill bank that only grows is a liability — every stale or overfit routine you keep becomes a distractor the retriever has to reject, and retrieval precision falls off a cliff as the pool grows. FlowEvo compiles successful workflows into callable skills, stores them in a persistent bank, and then treats "is this skill still earning its place" as an ongoing, first-class question. That governance loop is the part I'd actually want in a running system, more than the compile step.

The rest is cheap to adopt: training-free, all at inference time, no parameter updates. On ALFWorld it hits 85.6% — 26 points over the strongest baseline — at roughly a third of the tokens, and it beats ExpeL in 49 of 50 model-dataset comparisons from 7B to 671B. The token number matters as much as the accuracy: a skill you can replay directly is a workflow you don't re-plan and re-pay for. The [HF paper page](https://huggingface.co/papers/2607.21596) frames this as skill/workflow co-evolution, but the operational hook is that pruning policy.

If the durable value of a skill library is what it deletes rather than what it hoards, why do most agent frameworks ship the "save everything" half and leave "delete what hurts" as a TODO?
