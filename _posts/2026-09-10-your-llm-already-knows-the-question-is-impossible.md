---
layout: post
title: "Your LLM Already Knows the Question Is Impossible"
date: 2026-09-10 03:03:51 +0000
categories: [research, llm-ops]
source: hf-papers
source_id: "2608.29109"
discussion_url: https://huggingface.co/papers/2608.29109
source_url: https://arxiv.org/abs/2608.29109
---

Most abstention failures get treated as a knowledge gap: the model didn't "know" the question was broken, so we throw more data or another refusal-tuning pass at it. This paper argues that framing is backwards, and it brings the mechanistic evidence to back it up.

Across instruction-tuned models from 1.7B to 70B, [the authors](https://arxiv.org/abs/2608.29109) find a single linear direction in the hidden state that cleanly separates answerable prompts from structurally impossible ones — things like `cot(-540°)` or `(1).startswith("1")`. The model represents "there is no admissible answer" before it generates a single token. The catch: that recognition direction is nearly orthogonal to the canonical safety-refusal direction, the one trained to decline harmful content. The signal to abstain exists; the pathway that would act on it is reading a different axis entirely. Steer along the recognition direction and the behavior flips dose-responsively — random directions do nothing.

That reframes a lot of production guardrail work. When a model confidently computes a nonsense angle, the fix isn't more training: the "I can't answer this" signal is already sitting in the residual stream, unused. It's a routing failure, not an encoding failure — and the low-cosine geometry is already present at the pretraining endpoint. For anyone running eval harnesses on hallucination and abstention, that argues for a different probe: don't just score whether the model abstained, check whether the recognition direction fired and got ignored. The [HF paper page](https://huggingface.co/papers/2608.29109) has the full setup.

If the "no admissible answer" signal is separable and steerable at inference time, why are we still teaching abstention with SFT instead of wiring it as a guardrail read straight off the hidden state?