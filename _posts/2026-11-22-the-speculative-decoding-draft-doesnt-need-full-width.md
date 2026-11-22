---
layout: post
title: "The Speculative Decoding Draft Doesn't Need Full Width"
date: 2026-11-22 03:05:29 +0000
categories: [llm-ops, ai-infrastructure, research]
source: hf-papers
source_id: "2611.23835"
discussion_url: https://huggingface.co/papers/2611.23835
source_url: https://arxiv.org/abs/2611.23835
---

The interesting part of [NarrowSpec](https://arxiv.org/abs/2611.23835) isn't the speedup — it's that the speedup is free. Speculative decoding leans on a small draft model to propose tokens the target verifies in one pass, and the drafts that actually read the target's hidden states (DFlash, EAGLE-3) have been quietly inheriting the target's full hidden width. The paper shows you can run that draft's residual stream at half or a quarter width and keep acceptance roughly intact. For DFlash the narrower output adapter folds back into the vocabulary projection, so the logits come out identical up to floating-point rounding. Nothing is traded away for the win.

End to end that's 1.06–1.12x on a B200 and 1.13–1.44x on a DGX Spark (GB10) at batch 1, holding up to 1.21x at the largest batches each GPU fits. Modest on paper. The detail worth sitting with is that the gain is larger on the GB10 than the B200 — the draft was never the headline cost on fat datacenter silicon, but on bandwidth-starved hardware the width you over-provisioned was eating your decode budget the whole time.

That lands for anyone serving inference against a latency SLA. We spend real effort tuning acceptance rate and draft depth and almost none asking whether the draft is simply bigger than the job needs. If you're running on constrained GPUs — and increasingly that's where agent workloads actually live — this is a config change, not a research project. The [HF paper page](https://huggingface.co/papers/2611.23835) lists the drafter and target combinations if you want to sanity-check it against your own stack.

What else in the draft model have we been copying from the target out of habit rather than measurement?
