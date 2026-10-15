---
layout: post
title: "Your Agent Read the State Right and Still Chose Wrong"
date: 2026-10-15 03:07:22 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.18579"
discussion_url: https://huggingface.co/papers/2610.18579
source_url: https://arxiv.org/abs/2610.18579
---

When a fast action-selection model picks the wrong next step, the instinct is to blame perception: bad retrieval, a truncated observation, a tool result the model never actually saw. This [paper](https://arxiv.org/abs/2610.18579) says that instinct is usually wrong. The authors pair every next-action question with independent factual probes about the same state, run it across seventeen fast systems plus a reasoning model, and find that most wrong actions follow correct reading. The model saw the facts. It just didn't act on them.

The sharper result is that this failure mode gets worse as systems get more accurate — the better the model, the larger the share of its errors that are read-right, act-wrong. And the mistakes aren't random noise; they cluster on the same decision states across completely different systems. That's the part worth sitting with. It means the hard states are a property of the task, not of any one model, so you can find them once and reuse them as a fixed probe set.

This maps onto how I think about eval harnesses for agents. If you only score end-to-end task success, a read-right-act-wrong failure looks identical to a retrieval miss, and you'll burn a sprint tuning your reranker when the actual gap is in action selection. The repair the authors point at is almost embarrassingly cheap: where the probed facts provably determine the action, having the model answer the sub-questions and composing the final choice in code fixes it. On real states, what's missing is often not a fact but the next sub-goal — a planning problem wearing a retrieval costume.

Skim the [HF paper page](https://huggingface.co/papers/2610.18579) if you run agents in production. The uncomfortable question it left me with: how much of your "retrieval" budget is actually paying down a planning debt you've never measured?
