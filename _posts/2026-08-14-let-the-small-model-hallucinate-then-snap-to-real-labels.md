---
layout: post
title: "Let the Small Model Hallucinate, Then Snap to Real Labels"
date: 2026-08-14 14:05:56 +0000
categories: [rag, conversational-ai, llm-ops]
source: hn
source_id: "49249523"
discussion_url: https://news.ycombinator.com/item?id=49249523
source_url: https://softwaredoug.com/blog/2026/08/10/hypothetical-classifications
---

Doug Turnbull's [post](https://softwaredoug.com/blog/2026/08/10/hypothetical-classifications) flips classification inside out: stop asking the LLM to *be right*, and start asking it to *be fluent*.

Instead of stuffing a thousand-label taxonomy into the prompt and constraining the output, you ask a small, cheap model to invent plausible-but-fake categories for the query — then embed those hallucinations with something like MiniLM and nearest-neighbor them onto your real vocabulary.

- 🎯 **The reframe**: you don't need accuracy from the model, just close-enough language — and creativity is cheap
- ⚡ **Small models suffice**: no reason to pay frontier prices to pick from a fixed list
- 🔍 **HyDE, but for labels**: generate a hypothetical classification, then match by embedding instead of exact string
- 📊 **Sidesteps schema limits**: no giant constraint list per request, no structured-output ceiling from your provider
- ⚠️ **The catch**: your taxonomy embeddings carry the accuracy now, so their quality is the whole ballgame
- 💡 **Where it earns its keep**: intent and slot routing, product categorization, entity linking for grounding

The [HN discussion](https://news.ycombinator.com/item?id=49249523) is worth a scroll if you've ever fought a provider's structured-output ceiling. My take: this is the rare trick that gets *cheaper* and *more robust* at once. If a 22M-parameter embedder plus a throwaway generation can stand in for your classifier calls, what else in your pipeline is quietly over-modeled?