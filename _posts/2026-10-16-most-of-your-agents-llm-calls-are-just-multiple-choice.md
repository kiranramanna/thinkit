---
layout: post
title: "Most of Your Agent's LLM Calls Are Just Multiple Choice"
date: 2026-10-16 03:07:37 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.21412"
discussion_url: https://huggingface.co/papers/2610.21412
source_url: https://arxiv.org/abs/2610.21412
---

The expensive part of running an agent in production isn't the reasoning — it's that the harness wakes a frontier model for every *which tool next?* when that decision is really just classification. [This benchmark and harness](https://arxiv.org/abs/2610.21412) put a number on how much of your bill is exactly that.

Most steps in a long trajectory end in a multiple-choice call, and a small decision model can answer those directly at a fraction of the cost. The catch is that naive delegation backfires: handing tool choices to even the most accurate decision model, without a fitted confidence threshold, dropped task success by 19 points, and the best model solved only 69.5% of full agent tasks on its own. The fix is two parts — fit a per-choice confidence threshold on the agent's *own* trajectories and let the LLM take over below it, then train the decision model (an open 4B) on the broken states an agent actually reaches after its earlier mistakes. That combination made agents 81–89% cheaper and up to 2.5x faster with no meaningful drop in success.

The 19-point cliff is the part worth sitting with. A decision model that looks sharp on isolated questions falls apart once it inherits the agent's own compounding errors — the states it never saw during training. So the real work isn't the cheaper model, it's the threshold deciding when *not* to trust it. The [HF paper page](https://huggingface.co/papers/2610.21412) has the full breakdown, and the models and harness are promised as open source.

If routing, retries, and tool selection are classification problems, how much of your latency budget is just the big model rubber-stamping decisions a 4B could make?
