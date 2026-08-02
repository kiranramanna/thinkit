---
layout: post
title: "Prompt Sensitivity Is a Fairness Problem, Not a Tuning Knob"
date: 2026-08-02 03:06:00 +0000
categories: [llm-ops, conversational-ai, research]
hn_id: 49139102
hn_url: https://news.ycombinator.com/item?id=49139102
source_url: https://mitsloan.mit.edu/ideas-made-to-matter/ai-financial-advice-surprisingly-good-especially-if-you-ask-right-questions
---

The finding in the [MIT Sloan writeup](https://mitsloan.mit.edu/ideas-made-to-matter/ai-financial-advice-surprisingly-good-especially-if-you-ask-right-questions) that matters isn't that LLMs give decent financial guidance. It's that the *same model* hands out materially different advice depending on how the question is phrased — prompts that signal gender, financial literacy, or familiarity with LLMs shifted the recommendations. In production terms, the model's behavior is conditioned on latent attributes of the asker that have nothing to do with the actual question.

I spend a lot of time on eval harnesses, and this is exactly the failure mode that point-estimate benchmarks miss. "Surprisingly good on average" tells you almost nothing if the variance is correlated with who's asking. The interesting number isn't the mean quality score — it's the spread across semantically-equivalent prompts. If you're not measuring prompt-perturbation sensitivity, you're not measuring fairness, and you probably don't know your model drifts.

The other failure modes they flag are the operational ones: the advice doesn't adjust to shocks like job loss, and it lets portfolios drift instead of rebalancing. That's the gap between a system that answers a question and one that maintains state over time — a distinction agentic systems have to get right and single-turn chat never has to. [The HN thread](https://news.ycombinator.com/item?id=49139102) has the predictable "human advisors are biased too" replies, which sidestep the real issue: a human advisor doesn't silently re-weight your risk tolerance because you mentioned you're new to computers.

So the uncomfortable question for anyone shipping a conversational assistant in a regulated domain: when you red-team, do you perturb the persona in the prompt, or just the content of the question?
