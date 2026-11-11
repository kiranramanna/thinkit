---
layout: post
title: "When Agent Orchestration Beats a Custom Model"
date: 2026-11-11 14:07:34 +0000
categories: [agentic-ai, industry]
source: hn
source_id: "50452455"
discussion_url: https://news.ycombinator.com/item?id=50452455
source_url: https://pietromiotti.com/latest/maya-site/?maya
---

The headline on this [write-up](https://pietromiotti.com/latest/maya-site/?maya) is the Maya pyramid. The part worth stealing is that there was no model. The author — not an archaeologist — pointed 48 agents at roughly 1,200 km² of public lidar, rendered as images, and had them flag pyramids, platforms, and plazas while rejecting natural hills and sinkholes. No classifier, no fine-tune. Just agents following a precise inspection guide, run in parallel.

- 🎯 **The orchestration was the product** — the real engineering was the spec and the parallel review, not a bespoke vision model
- 🔍 **Verification stayed grounded** — point-cloud slices separated canopy returns from ground returns to confirm the structures were real, not hallucinated edges
- ⚠️ **Confirmation bias scales with agent count** — 48 agents told to hunt for pyramids will find "pyramids"; the ground-return check is what keeps that honest
- 💡 **Frontier models only brainstormed the approach** (Gemini, ChatGPT, Claude, and Grok all pointed at lidar), but the pipeline itself was cheap agents plus a good guide
- ⚡ **Idea to an official reply in under 72 hours** — the loop stayed fast because the human sat in the verification seat, not outside it

This maps cleanly onto production agent work: the leverage is almost never a smarter single model, it's a crisp task spec, cheap parallel fan-out, and a verification step that can't be talked into a false positive. The [HN discussion](https://news.ycombinator.com/item?id=50452455) is appropriately skeptical about whether the site is genuinely unmapped — which is exactly the right instinct. When the agents get this cheap to run, does the whole bottleneck move to how well you can verify what they hand back?
