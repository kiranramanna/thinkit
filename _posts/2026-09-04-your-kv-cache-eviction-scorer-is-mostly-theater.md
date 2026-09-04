---
layout: post
title: "Your KV-Cache Eviction Scorer Is Mostly Theater"
date: 2026-09-04 14:05:53 +0000
categories: [llm-ops, ai-infrastructure, research]
source: hf-papers
source_id: "2609.03430"
discussion_url: https://huggingface.co/papers/2609.03430
source_url: https://arxiv.org/abs/2609.03430
---

If you run reasoning models in production, you've watched the KV cache eat your memory budget and reached for a smart eviction policy — score every token by projected importance, keep the top-K. The [Random Attention paper](https://arxiv.org/abs/2609.03430) makes a deflating claim: that scoring buys you almost nothing. Keep the prompt, evict everything else uniformly at random, compute no score at all, and you match the strongest prior evictor across four models and six reasoning tasks — while serving 32–43% higher throughput in vLLM.

The mechanism is the part worth internalizing. Two things are actually load-bearing. First, the prompt is the fragile part of the cache; most of the measured gap between fancy selectors was just whether their heuristic happened to protect it. Second, a long chain of thought is self-redundant — the model restates what it still needs as it reasons, and every attention head keeps its own copy of the trace. Once the prompt is safe, a random draw retains enough copies of the live context that no ranking is required.

That reframes the eval, which is where most teams get this wrong. If you've been A/B-testing eviction heuristics on end-task accuracy, you've been measuring noise plus "did it keep the prompt." Pin the prompt explicitly, drop the scorer, reclaim the compute the scorer was burning, and measure throughput at fixed accuracy instead. The code is public and the [HF paper page](https://huggingface.co/papers/2609.03430) collects the early discussion, so this is a same-afternoon experiment. My open question: does the redundancy argument survive aggressive prompt-caching and shared-prefix serving, where the fragile prompt is already pinned and the reasoning trace is the only thing left to evict?
