---
layout: post
title: "Your Guardrail Threshold Was Tuned in English"
date: 2026-11-28 03:05:31 +0000
categories: [research, llm-ops, conversational-ai]
source: hf-papers
source_id: "2611.33307"
discussion_url: https://huggingface.co/papers/2611.33307
source_url: https://arxiv.org/abs/2611.33307
---

Most of us tune a guardrail or router threshold once, on an English eval set, and then ship it everywhere. [This paper](https://arxiv.org/abs/2611.33307) is a clean argument for why that's a latent bug: accuracy and confidence don't degrade together when you cross languages.

The authors evaluate 25 open-weight decision models — the small fine-tuned classifiers that routers and guardrails threshold directly — across 17 tasks in 14 languages. Every model loses accuracy in every non-English language, from about 2 points in high-resource languages to 8 in Tamil. The catch is that confidence only falls about half as much. So a threshold calibrated for 95% accuracy in English quietly delivers 90% in Tamil. Your guardrail isn't broken — it's silently looser, admitting more than you think, and nothing on your dashboard says so. The size of that gap tracks the language and the base model, not leaderboard rank, so reaching for the top-ranked decider buys you nothing here.

The part that should bother anyone running a multilingual eval harness: when the test items were translated by an LLM instead of a person, the models scored higher on all 23 pairs the authors checked. If your multilingual eval set is machine-translated — and most are — it understates the real production gap. You're grading the guardrail on an easier exam than the one it actually sits in front of.

The fixes aren't cheap either. Across 81 fine-tuning runs, English task skill does transfer, and a few thousand target-language items narrow the worst losses, but neither more data nor full-parameter tuning closes them. The honest read from the [HF paper page](https://huggingface.co/papers/2611.33307) is that one global threshold is the wrong primitive. Per-language calibration, measured on human-translated items, is the floor.

So the uncomfortable question for anyone with a multilingual deployment: do you actually know your guardrail's block rate in your lowest-resource language, or just your English number?
