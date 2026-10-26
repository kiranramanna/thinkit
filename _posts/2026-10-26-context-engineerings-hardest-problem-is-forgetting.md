---
layout: post
title: "Context Engineering's Hardest Problem Is Forgetting"
date: 2026-10-26 03:14:31 +0000
categories: [agentic-ai, rag, llm-ops]
source: hn
source_id: "50235780"
discussion_url: https://news.ycombinator.com/item?id=50235780
source_url: https://www.dbreunig.com/2026/10/24/the-state-of-context-engineering.html
---

Drew Breunig's [state-of-context-engineering writeup](https://www.dbreunig.com/2026/10/24/the-state-of-context-engineering.html) lands on the thing most production teams keep relearning: the lever that moves output quality isn't a bigger window, it's deciding what to remove. His framing — output equals context plus weights, and better context is usually the cheapest of the three levers — matches what I see running agentic workflows. We rarely lose accuracy because the model is too small; we lose it because the context is noisy, and a 200K window just buys more room for noise.

What I appreciate is that he treats this as permanent, not a phase we engineer our way out of. The term drifted from prompt engineering (2023) to context engineering (2025) to harness engineering (2026), but it's the same job each time: push context assembly out of the model call and into deterministic code, and decide where to stay probabilistic. The six fixes he lists — augmentation, tool loadout, quarantine, pruning, offloading, summarization — have survived two years of changing failure modes, which is a stronger signal than any single benchmark.

The part worth sitting with is forgetting. He points at 2026 work where clearing history but keeping artifacts beats accumulating everything, and predicts that personal agents' piled-up memories and skills will start to conflict. That tracks with the memory-vs-retrieval tradeoffs I keep hitting: a long-running agent that never resets eventually fixates — what he calls context inertia — and no reranker saves you from that. The [HN discussion](https://news.ycombinator.com/item?id=50235780) has the usual split between "just use a bigger model" and people who have actually run agents past the 200K mark.

If strategic forgetting is the next unsolved problem, who's building the eval harness that can even measure when an agent should have dropped a memory?
