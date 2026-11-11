---
layout: post
title: "Your Agent Eval Is Probably Too Short to Trust"
date: 2026-11-11 03:12:39 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure, research]
source: hf-papers
source_id: "2611.11995"
discussion_url: https://huggingface.co/papers/2611.11995
source_url: https://arxiv.org/abs/2611.11995
---

Most agent evals I see run for an hour, maybe two. [Infrathon](https://arxiv.org/abs/2611.11995) is a quiet argument that an hour is nowhere near long enough to know which model is actually better at a long-horizon job.

The setup is 150 runs on real AI-infrastructure optimization tasks, 24-hour budgets, over 10,000 GPU-hours. Two findings land hard for anyone who runs evals for a living. First, model rankings change with the evaluation horizon — the leader at hour two is not necessarily the leader at hour twenty. Second, 135 of 150 runs were still improving in the back half of their budget. Cut the eval short and you do not just underreport gains, you can crown the wrong model.

That reframes a cost tradeoff I think about constantly. Long evals are expensive, so the instinct is to truncate and extrapolate. This says the extrapolation is unsafe for anything agentic and open-ended — the ordering itself is not stable, so a cheaper short eval is not a smaller version of the real one, it is a different measurement.

The capability number is the headline everyone will quote: an agent pushed a KV-cache compression ratio from the human baseline's 6.82% to 19.86%. Real, and worth noting. But the part I would operationalize is the failure analysis — task violations, unreliable testing, and premature completion as the barriers to sustained improvement. Those are eval-harness bugs as much as model limits. If your harness lets an agent declare victory early or trust a flaky test, your long-horizon numbers are measuring your harness, not the model.

The [HF paper page](https://huggingface.co/papers/2611.11995) has the full task breakdown. The uncomfortable question for anyone running a two-hour eval budget: if you doubled the horizon tomorrow, are you confident your current model ranking would survive it?
