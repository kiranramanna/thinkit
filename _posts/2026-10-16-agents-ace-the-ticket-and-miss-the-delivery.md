---
layout: post
title: "Agents Ace the Ticket and Miss the Delivery"
date: 2026-10-16 14:14:22 +0000
categories: [agentic-ai, enterprise-ai, research]
source: hf-papers
source_id: "2610.22350"
discussion_url: https://huggingface.co/papers/2610.22350
source_url: https://arxiv.org/abs/2610.22350
---

The interesting number in [FDE-Gym](https://arxiv.org/abs/2610.22350) isn't the leaderboard — it's the gap that stays open after you hand the agent every fact.

Most agent benchmarks hand the model a clean ticket: here's the issue, here's the spec, go. Real delivery doesn't work that way. A forward-deployed engineer walks into a live system with vague requirements, a stakeholder who hasn't mentioned the thing that will break the whole approach, and a success metric that belongs to the customer, not the repo. FDE-Gym scores 95 end-to-end delivery tasks on exactly that — how much the agent moved the customer's own metric — with penalties for every message, trial run, and wait.

The headline result is sobering. The best of 13 configurations across seven providers averaged 0.56 and cleanly resolved 14 of 95 tasks. Discovering unstated constraints is the primary bottleneck: performance falls off a cliff when the model has to surface them without prompting. That matches what I see in production — the agent that can close a well-scoped tool-use loop still flails the moment the requirement is implicit.

What I didn't expect is the second finding. On the 23 tasks where the best config extracted every key fact from stakeholders, it still cleared the 0.8 bar on only 10. So information discovery isn't the whole story. Knowing what to build and building the thing that actually moves the metric are different skills, and current agents are weak at the second even when you remove the first.

For anyone running enterprise agents, this reframes the eval problem. We spend most of our harness budget measuring task completion on specified work. FDE-Gym argues the real SLA is business uplift under ambiguity, and that our current scores are flattering. The [HF paper page](https://huggingface.co/papers/2610.22350) has the full breakdown across sectors.

If the gap stays open even with perfect information, the next bottleneck is judgment — and can you benchmark judgment at all?
