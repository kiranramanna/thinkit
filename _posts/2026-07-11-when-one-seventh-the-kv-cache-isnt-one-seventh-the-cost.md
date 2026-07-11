---
layout: post
title: "When One-Seventh the KV Cache Isn't One-Seventh the Cost"
date: 2026-07-11 03:07:45 +0000
categories: [llm-ops, ai-infrastructure]
hn_id: 48814170
hn_url: https://news.ycombinator.com/item?id=48814170
source_url: https://mimo.xiaomi.com/blog/mimo-v2-5-inference
---

The interesting number in Xiaomi's [MiMo-V2.5 inference writeup](https://mimo.xiaomi.com/blog/mimo-v2-5-inference) isn't 1/7 — it's the gap between that theoretical KV-cache reduction and what actually shows up in production. Hybrid Sliding Window Attention interleaves 60 local-window SWA layers with 10 full-attention layers, and on paper that collapses both attention compute and KV-cache storage to roughly a seventh of full attention. The honest part of the post is admitting the architecture doesn't ship itself.

What eats the win is everything around the attention math: SWA-aware prefix-cache trees, keeping full-attention and windowed layers semantically consistent, async prefetch that drifts out of sync with scheduling, and distributed cache state that won't stay coherent. None of that is in the architecture diagram. It's the lesson I keep relearning on production LLM serving — the model card tells you the FLOPs, and the serving stack tells you the bill. Decode is memory-bound, so the cache reduction only pays off once the cache system actually honors the sliding window instead of retaining the full sequence out of habit.

The part worth stealing is the framing: quantify the architectural ceiling first, then treat every optimization as closing the gap to it. Most teams skip step one and optimize toward a number they never defined. The [HN thread](https://news.ycombinator.com/item?id=48814170) has the usual "why not just run full attention" pushback, which misses that the 1/7 only matters at long context — at 4K tokens the whole thing barely moves.

So the real question for anyone running hybrid-attention models: does your eval harness measure cost at the context lengths where SWA actually wins, or are you benchmarking at 4K and shipping at 128K?
