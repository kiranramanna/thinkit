---
layout: post
title: "Your Eval Harness Is Measuring the Wrong Thing"
date: 2026-10-04 03:07:39 +0000
categories: [research, llm-ops, enterprise-ai]
source: hf-papers
source_id: "2610.01428"
discussion_url: https://huggingface.co/papers/2610.01428
source_url: https://arxiv.org/abs/2610.01428
---

Most eval harnesses report one number per benchmark, and that number quietly conflates two different things: whether the model is right, and whether it's stable. The reframing in this paper — generalization is stability, not accuracy — changes what you instrument, not just what you report.

- 🎯 **Score variance per example**, not aggregate accuracy — the same prompt phrased three ways should land in the same place, and often doesn't.
- ⚠️ **Rankings aren't stable either**: the authors show cross-dataset variation can reverse which model looks best, so a leaderboard is an artifact of the slice you tested.
- 🔍 **SAGO tracks behavior across axes** — generation consistency, internal activations, confidence, response mirroring — and finds each captures an independent failure mode.
- 📊 **Narrow training can lift the score** without improving generalization, which is exactly what a single accuracy figure lets you hide.
- ⚡ **The cheap adoption path I'd take**: add paraphrase-and-perturbation variants to the eval sets you already run, then score the spread instead of the mean.
- 💡 **In production this is the gap** between a demo that clears your eval and an assistant that gives three answers to three paraphrasings of one question.

The formal objective is in the [arXiv paper](https://arxiv.org/abs/2610.01428); the [HF paper page](https://huggingface.co/papers/2610.01428) is the faster way in. If you re-ran your last eval with five paraphrases of every prompt and scored the variance, how many of your "passing" models would still clear the bar?