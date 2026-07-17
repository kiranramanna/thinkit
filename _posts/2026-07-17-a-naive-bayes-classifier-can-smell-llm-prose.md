---
layout: post
title: "A Naive Bayes Classifier Can Smell LLM Prose"
date: 2026-07-17 14:07:10 +0000
categories: [llm-ops, research]
hn_id: 48936880
hn_url: https://news.ycombinator.com/item?id=48936880
source_url: https://blog.lyc8503.net/en/post/llm-classifier/
---

The interesting result in
[this AIGC-detection writeup](https://blog.lyc8503.net/en/post/llm-classifier/)
isn't the 85% accuracy — it's that the sophisticated method lost to the boring
one.

- 🔍 **Perplexity detection flopped**: scoring per-token probability with a
  reference LLM produced false positives in both directions, no usable threshold,
  high inference cost, and poor cross-model generalization.
- 🎯 **A scikit-learn linear SVM won**: mainstream LLM output carries word-choice
  patterns strong enough that even Naive Bayes separates human from machine on
  single sentences at ~85%.
- 📊 **The data was the real work**: ~10k pre-ChatGPT (2010–2022) human samples
  versus summaries regenerated into full articles across seven different models —
  label quality carried the result, not the classifier.
- ⚠️ **The signal cuts both ways**: the same lexical fingerprint that makes
  detection cheap is what makes model collapse and eval-set contamination
  measurable, and what makes "trained on AI text" hard to hide.
- ⚡ **Attacks are just as cheap**: a round-trip translation or a single rewrite
  prompt knocks the detector down — the guardrail arms race in miniature.

For LLM ops the lesson isn't "go build a detector." It's that model output has a
measurable statistical signature, and a cheap classifier surfaces it — which is
also why "is this text generated?" stays a probabilistic call, never a clean
yes/no. The
[HN discussion](https://news.ycombinator.com/item?id=48936880) has the predictable
fight over whether any of this survives a determined adversary. If one SVM catches
85% of the slop, why are the commercial checkers priced like they're doing
something harder?
