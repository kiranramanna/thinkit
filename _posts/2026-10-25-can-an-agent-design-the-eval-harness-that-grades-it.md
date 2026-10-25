---
layout: post
title: "Can an Agent Design the Eval Harness That Grades It?"
date: 2026-10-25 14:05:52 +0000
categories: [llm-ops, agentic-ai, research]
source: hf-papers
source_id: "2610.04184"
discussion_url: https://huggingface.co/papers/2610.04184
source_url: https://arxiv.org/abs/2610.04184
---

The quiet assumption in a lot of "autonomous research" pitches is that evaluation is the easy, delegable part — run the benchmark, read the number. [EvalResearchBench](https://arxiv.org/abs/2610.04184) treats evaluation itself as the research task: given target materials, candidate APIs, and fixed time and API budgets, an agent selects or synthesizes tasks, writes graders, revises them in pilot runs, and freezes an executable evaluator. Then it checks whether that evaluator orders models the way 14 trusted target benchmarks do.

The numbers are a useful gut-check against eval-harness optimism. The best auto-built evaluators reproduce about 75% of pairwise model orderings, under a 91% ceiling set by disagreement among the targets themselves — so even perfect agreement with "truth" is capped, because the ground truth doesn't fully agree with itself. Two findings land harder for anyone who maintains eval harnesses: the evaluator that did best on development targets was not the best on the sealed targets, which is just overfitting wearing a lab coat; and the cheapest evaluator by execution cost had the highest pairwise agreement. The failure modes are the familiar ones that make a harness lie — truncated answers scored as wrong, budgets exhausted mid-run, a handful of questions dominating a whole domain's score.

None of this says agents can't help build evals — a human-designed sample of public tasks stayed a strong baseline, which is the honest framing. The [HF paper page](https://huggingface.co/papers/2610.04184) files this under recursive self-improvement, and that's exactly where I get nervous: if the loop meant to certify progress is itself an overfit, budget-starved grader, the whole self-improvement story is measuring its own shortcuts. Would you let an evaluator you didn't write decide whether your next model shipped?
