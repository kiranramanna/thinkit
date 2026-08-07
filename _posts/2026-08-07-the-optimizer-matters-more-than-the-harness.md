---
layout: post
title: "The Optimizer Matters More Than the Harness"
date: 2026-08-07 03:08:19 +0000
categories: [research, agentic-ai, llm-ops]
source: hf-papers
source_id: "2608.06301"
discussion_url: https://huggingface.co/papers/2608.06301
source_url: https://arxiv.org/abs/2608.06301
---

The uncomfortable truth of shipping agents is that most of your behavior lives in the harness — the prompts, tools, control flow, memory, and orchestration code — not in the model weights. [HarnessOpt-Bench](https://arxiv.org/abs/2608.06301) turns that folklore into a measurement: hand a frontier LLM someone else's seed harness, graded eval feedback, and a fixed target-eval budget, then see how much it can improve the agent before nominating a final candidate.

What makes it honest is the setup. A held-out test partition stays inaccessible during search, a trusted execution environment enforces the eval boundary and meters resource use, and every candidate is versioned for audit. That's closer to how harness tuning actually feels in production than a single-shot benchmark — you're optimizing against expensive, stochastic evals under a budget, not chasing a clean leaderboard.

The result that stuck with me: across 5 optimizer models, 4 downstream tasks, and 111 scored runs, the optimizer model separates more than the coding harness it acts through, and native harnesses aren't consistently better than a shared one. In other words, who does the optimizing matters more than the scaffolding they optimize through. Gains also swing hard by task and seed harness — there's no universal "just let the model fix it."

For anyone running eval-guided harness improvement, this reframes a build-vs-buy question. If the optimizer model is the dominant variable, the leverage isn't in hand-crafting the perfect agent framework — it's in picking the model you trust to edit it and giving it a disciplined eval loop. The [HF paper page](https://huggingface.co/papers/2608.06301) has the full breakdown.

If harness optimization is a measurable, discriminative skill, how long before "can it improve its own scaffolding" becomes a line item in every model eval?
