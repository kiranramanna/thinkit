---
layout: post
title: "Verifying Long-Horizon Agents Without an Answer Key"
date: 2026-10-05 14:08:26 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.00972"
discussion_url: https://huggingface.co/papers/2610.00972
source_url: https://arxiv.org/abs/2610.00972
---

The counterintuitive claim in [VeriHarness](https://arxiv.org/abs/2610.00972) is the one worth sitting with: when you sample an agent several times on a long task, consensus can hide errors and disagreement often points at the right answer. That inverts how most of us wire up self-consistency — majority vote, take the mode, move on.

Verifying long-horizon agent output is hard precisely because there's no answer key at test time. The paper's move is to stop treating verification as a scoring function and start treating it as its own agent: the same base model gets a workspace, evidence tools, and reusable verification skills. A disagreement resolver checks competing claims against environmental evidence; a consensus challenger goes hunting for the requirement everyone quietly skipped. Those findings then drive a revision of the final artifact, not just a thumbs up or down.

The gains are modest but honestly reported — around 6 points over a single rollout on both Gemini 3.5 Flash and Claude Opus 4.8 across five workspace benchmarks, with verification skills that self-improve from failure feedback. For anyone running agents on multi-step enterprise tasks, the operational lesson is bigger than the delta: your verifier needs the same tools and environment access as your generator, or it's grading essays it can't actually check. The [HF paper page](https://huggingface.co/papers/2610.00972) links the full release of roughly 26k rollouts if you want to probe the failure modes yourself.

If disagreement is the signal, how much eval budget are we burning by collapsing rollouts to a majority vote before anyone looks at where they diverged?
