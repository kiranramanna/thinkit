---
layout: post
title: "Intercepting the Agent Action You Can't Take Back"
date: 2026-09-02 03:03:48 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.30147"
discussion_url: https://huggingface.co/papers/2608.30147
source_url: https://arxiv.org/abs/2608.30147
---

The interesting number in [CAST](https://arxiv.org/abs/2608.30147) isn't the pass rate, it's the `pass^4`. Measuring an agent over four independent trials instead of one is the honest way to talk about reliability, because the failures that sink production agents rarely show up on the first run. They surface on trial three, when a slightly different trajectory walks the model into refunding the wrong order. Anyone who has shipped a tool-calling agent against real, stateful backends knows the gap between "works in the demo" and "works across a thousand sessions" is exactly this.

CAST's bet is that the missing ingredient is critique as a *training* signal, not critique at inference. The common pattern today is a prompt-based critic agent watching the executor: another LLM call in the loop, hoping it can articulate why an action violates a domain policy. But frontier models are bad at that explanation on long, intertwined trajectories. So CAST converts sparse task outcomes into action-level rationales, trains a critique model on them, and uses that to build critique-aware data for the policy. Fine-tuned Qwen3 models beat GPT-OSS-120B by 10%+ on Retail and carry a 9% gain out-of-domain to Telehealth. The transfer is the part worth noticing.

What I'd actually do with this: treat the critique model as the thing you version and eval, not the policy. In production the interception-before-execution layer is where guardrails live anyway, and a trained critic that emits a rationale is far more debuggable than a reranked confidence score. The [HF paper page](https://huggingface.co/papers/2608.30147) has the ablations. So a question for anyone running agents on irreversible actions: is your reliability metric averaging over trials, or quietly reporting your best run?
