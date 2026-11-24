---
layout: post
title: "What LLM Introspection Can and Can't Tell Your Guardrails"
date: 2026-11-24 03:05:05 +0000
categories: [llm-ops, research]
source: hn
source_id: "50620328"
discussion_url: https://news.ycombinator.com/item?id=50620328
source_url: https://arxiv.org/abs/2602.20031
---

Anthropic showed last year that a frontier model could sometimes notice when a concept vector was injected into its activations. This [follow-up on a Qwen 32B](https://arxiv.org/abs/2602.20031) is the more useful result for anyone building guardrails, because it's honest about how thin the signal actually is.

- 🔍 The detection signal lives in the **residual stream at middle layers** and attenuates toward the final layers — by the time you read the output, most of it is gone.
- ⚠️ In plain sampling the model **denies the injection**. The self-report is not where the information is.
- 💡 Sensitivity jumps from **0.3% to 39.9%** only when you prompt the model with accurate information about how introspection works — you have to coach it to surface what it already encodes.
- 📊 Mutual information between injected and recovered concepts rose from **0.61 to 1.05 bits**, which is the authors' case that this isn't generic noise.
- 🎯 The operational lesson: to know whether a prompt tampered with your model, **probe the activations** — don't ask the model "were you manipulated?"

For LLM ops this reframes a tempting shortcut. A model's self-report of injection or jailbreak feels like a cheap monitoring signal, but a 40%-at-best rate that only shows up under leading prompts is a detector you can't ship. The real takeaway sits with the logit-lens methodology, not the model's words.

The [HN discussion](https://news.ycombinator.com/item?id=50620328) is split on whether "introspection" is even the right frame for a middle-layer probe. If the signal is readable from activations but not from outputs, is this introspection — or interpretability we're just letting the model narrate for us?
