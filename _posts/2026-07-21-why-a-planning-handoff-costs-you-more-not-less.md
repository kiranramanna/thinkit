---
layout: post
title: "Why a Planning Handoff Costs You More, Not Less"
date: 2026-07-21 03:03:40 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48916512
hn_url: https://news.ycombinator.com/item?id=48916512
source_url: https://stencil.so/blog/prewalk
---

Stencil ran the "senior architect, junior engineer" pitch to ground and it lost. In their [SWE-Bench Pro numbers](https://stencil.so/blog/prewalk), Opus planning read-only while a cheap model executes lands at $3.18 per task; Opus doing the whole thing alone is $2.78. The "cost-saving" handoff costs 14% more.

- 💡 **The bill is O(reads), not O(edits).** Across 1.81B tokens, actually writing files was ~9% of spend. Reading — files, dead ends, hypotheses tested — is what scales the cost, and every model pays full price for it.
- ⚠️ **A plan doc is a 2K-token postcard** distilled from 100K+ tokens of grounded context. The executor gets the postcard, not the understanding, then rebuilds the rest at its own price.
- 🔁 **`/plan` duplicates the expensive part.** The frontier model reads everything at frontier prices; the cheap model re-reads the same files at its prices. You didn't move the cost — you paid it twice.
- 🎯 **Hand off the trajectory, not the fairytale.** Their `/prewalk` keeps the frontier model running until the first edit lands — the moment it's confident enough to act — then swaps to the cheap model and prunes the planning instruction from context.
- 📉 **The cheap model never notices the swap.** It sees an explored plan, a todo list, and one valid move already made — a free in-context example — and just keeps going. Result: $1.46 per task at ~97% of frontier quality.

This matches what I see profiling agent cost: teams optimize the wrong turn. They cap the executor and leave the reader untouched. The [HN discussion](https://news.ycombinator.com/item?id=48916512) has people noting the split can still pay off when planner and executor share a warm cache — which is the same point from the other side: transfer context, not prose.

If reading is the real bill, why is every agent design still priced like the thinking is the expensive part?
