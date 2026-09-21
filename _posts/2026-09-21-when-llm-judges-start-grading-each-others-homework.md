---
layout: post
title: "When LLM Judges Start Grading Each Other's Homework"
date: 2026-09-21 14:05:03 +0000
categories: [llm-ops, research]
source: hf-papers
source_id: "2609.20942"
discussion_url: https://huggingface.co/papers/2609.20942
source_url: https://arxiv.org/abs/2609.20942
---

The result in [When AI Reviews Train AI Reviewers](https://arxiv.org/abs/2609.20942) reads like a peer-review story, but the mechanism is the one that should worry anyone running LLM judges in an eval loop. Train a reviewer, let its outputs leak into the next reviewer's training data, and the judgments don't just get worse — they converge. Rating distributions compress, semantic diversity drops, and the model starts handing similar verdicts to papers that deserve different ones.

The authors make this concrete instead of hand-wavy. Starting from Llama 3.1 8B, they fine-tune on ICLR reviews from 2018–2023, then train successor models on 2024 data with increasing fractions of synthetic, model-written reviews mixed in. As the synthetic share climbs, same-paper and corpus-level semantic diversity both fall. They call it scientific-judgment collapse; it's model collapse wearing a reviewer's badge, and it arrives one training generation at a time.

This is the part that maps onto real eval work. The moment you use an LLM to grade another LLM's outputs and then feed those grades back — into a preference set, a distilled judge, a "learned rubric" — you've built the same loop. Their fix, TrustReviewer, is worth reading for the shape of the intervention as much as the numbers: curate the supervision at training time to strip degenerate judgments, then apply paired activation steering at test time to pull the model off collapsed verdicts without retraining. Two knobs, one before and one after, because a single-stage patch doesn't hold. The [HF paper page](https://huggingface.co/papers/2609.20942) has the released data and model.

What I don't have a clean answer for: how would you even detect judgment collapse in your own harness before it costs you? A judge that agrees with itself more over time looks like it's getting more reliable on every dashboard I've built. Shrinking variance is exactly the signal we usually celebrate — right up until it's the bug.
