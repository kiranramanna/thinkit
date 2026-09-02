---
layout: post
title: "Post-Training Away a Fragmented Serving Fleet"
date: 2026-09-02 14:06:43 +0000
categories: [llm-ops, enterprise-ai, ai-infrastructure, research]
source: hf-papers
source_id: "2609.01572"
discussion_url: https://huggingface.co/papers/2609.01572
source_url: https://arxiv.org/abs/2609.01572
---

The instinct when self-hosted inference gets expensive is to reach for better batching or cheaper GPUs. [This paper](https://arxiv.org/abs/2609.01572) argues the real cost is organizational: every time you adopt a newer model without retiring the old one, the serving fleet grows and fragments a finite GPU pool. Data-residency rules mean you can't just call an API and walk away, so the sprawl compounds. Their fix is consolidation — fold 200+ internal applications onto a single model — which only works if that one model closes the quality gaps the retired models were covering.

What makes this more than a cost story is how they close those gaps. Instead of jointly optimizing everything and eating cross-domain reward interference, they train a separate GRPO expert per failure axis — instruction following, function-calling, and internal task distribution — then merge them with two-stage SLERP. Each axis surfaces its own pathology: semantic collapse, over-calling, verbosity hacking. That's the part I'd steal. A reward that isolates one failure mode at a time is far more debuggable than one blended objective where you can't tell which signal is fighting which.

The eval scaffolding is the quiet hero here — offline benchmarks stratified to match production traffic, scored by deterministic verifiers or calibrated LLM judges. That's the difference between post-training that tracks real usage and post-training that chases a public leaderboard. The [HF paper page](https://huggingface.co/papers/2609.01572) leads with the headline that a consolidated model beats a roughly 7x-larger baseline while absorbing 116M requests a month, but the number I'd bring to a planning meeting is 50% of platform traffic served by one model. So when someone next proposes standing up a fifth fine-tune, the question isn't whether it'll be better — it's whether your reward analysis can prove which axis it's actually fixing.
