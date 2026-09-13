---
layout: post
title: "The Rule Engine Already Does Most of Your Agent's Job"
date: 2026-09-13 14:03:58 +0000
categories: [agentic-ai, conversational-ai, llm-ops, research]
source: hf-papers
source_id: "2609.10016"
discussion_url: https://huggingface.co/papers/2609.10016
source_url: https://arxiv.org/abs/2609.10016
---

[MetroLLM-Bench](https://arxiv.org/abs/2609.10016) frames a language model as the policy layer of a transit kiosk — parse a scenario, call structured tools for routing and fare calculation, emit a machine-renderable terminal state — and the result I keep coming back to isn't the leaderboard. It's that a deterministic rule-based baseline already scores 84.6 on the Tier 1 checks. The entire language-model advantage sits in four places: policy adaptation, compound scenarios, accessibility, and temporal reasoning.

That should reshape how you scope an agent for any bounded, tool-mediated domain. If a lookup table gets you to 85%, the model isn't the runtime — it's the exception handler. The [paper](https://arxiv.org/abs/2609.10016) then sharpens the point: a 4B Qwen 3.5 student, parameter-efficient-fine-tuned and quantized to a 2.6 GB footprint, beats both GPT-5.6 tiers on Tier 1 and matches GPT-5.4 at maximum reasoning effort. Frontier reasoning is not what this task rewards.

The scaling curve is the part I'd pin to the wall. The PEFT gain over the base model shrinks from +7 points at 2B to −0.91 at 27B — same direction across every seed — and the 9B and 27B students add nothing over the 4B at this training scale. The ceiling is the training data, not parameters; throwing a bigger model at a narrow tool-calling task is spending in the wrong place. And serving configuration alone swings the Qwen 3.5-to-3.8 comparison by 2.7 Tier 1 points, a reminder that your deployment stack is a variable, not a constant.

This is the enterprise-agent lesson stated cleanly: measure the deterministic floor before you reach for a model, then size the model to the residual. The [HF paper page](https://huggingface.co/papers/2609.10016) has the full per-vendor breakdown. Once you know how much of your task a rule engine already covers, the real question is whether the model belongs on the hot path at all — or only on the 15% it actually earns.
