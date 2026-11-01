---
layout: post
title: "When Research Capability Doesn't Become a Forecast"
date: 2026-11-01 14:07:05 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.38342"
discussion_url: https://huggingface.co/papers/2610.38342
source_url: https://arxiv.org/abs/2610.38342
---

The headline finding in [Investor's Last Exam](https://arxiv.org/abs/2610.38342) is that frontier models — GPT-6 Astra and Claude Opus 5.5 — land at 68 and 67 out of 100 overall but collapse to roughly 52 on the forecast-and-model component. Strong research capability doesn't translate into predictive judgment. That gap is the whole point, and it's a pattern that shows up well outside finance: an agent that retrieves, summarizes, and reasons beautifully still can't reliably commit to a decision that gets graded against what actually happened next.

The part worth stealing is the eval architecture, not the leaderboard. ILE runs on a strictly frozen, versioned information set — 3.43 million document versions with validated timestamps that govern what the agent may retrieve at decision time. That's the discipline most harnesses skip: without a hard temporal boundary you can't tell whether an agent forecasted or just remembered. Anyone who has tried to evaluate a research agent on real market data knows how fast look-ahead leakage and test-set contamination creep in. Versioned retrieval with timestamp governance is a concrete answer, and it generalizes to any domain where the job is to reach a judgment from evidence available only up to a point in time.

The other move I like: ILE scores the evidence-to-assumption-to-judgment chain through dependency graphs instead of isolated capabilities. That reframes "did the agent get it right" into "where in the chain did the analytical advantage fail to convert into a forecast" — exactly the diagnostic signal you need to improve an agent rather than just rank it. The [HF paper page](https://huggingface.co/papers/2610.38342) lays out the task taxonomy built around real analyst deliverables.

The uncomfortable implication: most agent evals reward the parts of the pipeline that are already strong — retrieval, synthesis — and barely test the hard part, which is committing to a judgment under uncertainty and being wrong in a measurable way. If your eval harness can't locate where capability stops converting into correct decisions, what exactly is it optimizing?
