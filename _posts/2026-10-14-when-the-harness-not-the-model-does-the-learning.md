---
layout: post
title: "When the Harness, Not the Model, Does the Learning"
date: 2026-10-14 03:08:00 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.14224"
discussion_url: https://huggingface.co/papers/2610.14224
source_url: https://arxiv.org/abs/2610.14224
---

The interesting claim in [Harness^2](https://arxiv.org/abs/2610.14224) isn't the benchmark numbers — it's the framing. An agent's competence splits between the model you call and the harness around it: the orchestration, tool routing, retry logic, and prompt scaffolding. In production you rarely get to retrain the model. The harness is the part you actually own, and it's where most of the gains hide.

What this paper does is make the harness improve itself at test time, on tasks it never saw during design, without a ground-truth verifier to grade the edits. That last constraint is the real problem. Most self-improvement loops quietly assume a reward signal; open-world work doesn't hand you one. Their answer is a contrastive Propose-Probe-Compose step that guides harness edits from relative signal instead of absolute correctness, plus a second loop that banks what worked so the next task starts from a stronger baseline.

For anyone running agent frameworks, that two-level split maps onto a familiar pain point: per-task tuning that never generalizes. A single step lifting GLM-5 and Gemini 3.5 Flash by 4-12 points across three professional benchmarks matters less for the ceiling than for how it got there — improvement without a labeled eval set, which is exactly the situation you're in when an agent hits a workflow nobody wrote a test for. The [HF paper page](https://huggingface.co/papers/2610.14224) has the model-harness configs.

The question I'd want answered before trusting this in production: what stops harnessing-level recursion from compounding a bad edit across tasks? A verifier-free loop that banks experience can bank a regression just as easily. Where's the rollback?
