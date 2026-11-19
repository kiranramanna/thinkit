---
layout: post
title: "When an Agent Designs Your Quantization Recipe"
date: 2026-11-19 14:06:53 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure, research]
source: hf-papers
source_id: "2611.23388"
discussion_url: https://huggingface.co/papers/2611.23388
source_url: https://arxiv.org/abs/2611.23388
---

Post-training quantization has a boring, expensive secret: the best recipe changes with every model and precision, so someone re-derives it by hand each time a new checkpoint lands. [QDA](https://arxiv.org/abs/2611.23388) hands that job to an LLM agent that builds and scores candidate recipes over rounds — but the agent is not the interesting part.

- 🎯 The real unlock is a cheap evaluator: each candidate is scored in minutes by KL divergence from the original model on reasoning traces the agent never sees, instead of the tens of GPU-hours a full benchmark run would cost.
- ⚡ Promising recipes then get a second pass with long generations to catch what a KL score misses — repetition loops and other degenerate output.
- 🔧 A library of interoperable PTQ methods lets the agent actually compose recipes, rather than hand-porting each technique to a new architecture.
- 📊 The wins are modest but real: +0.9 to +2.2 points over the strongest public recipe across W4A16, W4A8, and W3A16, at 64 GPU-hours per search.
- 💡 On a 320B MoE at 4-bit (NVFP4 W4A4) it recovers 98.3% of the FP8 model's accuracy — ahead of the best vendor checkpoint — and every output runs on existing serving kernels with no inference overhead.

The pattern underneath is familiar from any agentic loop I have run in production: the agent is only as good as the eval it can afford to run often. Make scoring cheap and composable, and the search does the rest. The [HF paper page](https://huggingface.co/papers/2611.23388) says the library, evaluator, and harness will all be released.

If that tooling ships as promised, the hand-tuned quantization recipe starts to look like the kind of expert step that quietly disappears into a nightly job.
