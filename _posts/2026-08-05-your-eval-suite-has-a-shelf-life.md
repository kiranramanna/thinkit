---
layout: post
title: "Your Eval Suite Has a Shelf Life, and Age Predicts It"
date: 2026-08-05 03:05:11 +0000
categories: [llm-ops, research]
hn_id: 49170915
hn_url: https://news.ycombinator.com/item?id=49170915
source_url: https://arxiv.org/abs/2602.16763
---

The uncomfortable finding in this [60-benchmark study of saturation](https://arxiv.org/abs/2602.16763) isn't that benchmarks saturate — everyone running evals already feels that. It's that saturation is *predictable* from design choices you make on day one. Age raises the odds. Expert curation lowers them. And public test data — the thing most teams reach for because it's cheap — does nothing to protect longevity. Nearly half the benchmarks they measured were already saturated.

That reframes eval maintenance from "swap in a harder set when scores flatten" to "budget for curation up front, or accept a short half-life." When I'm standing up an eval harness for a production agent, the tempting move is to scrape a public suite and call it grounded. This paper is a good argument for the opposite: the durable signal comes from a small, expert-built set that reflects the actual failure modes you care about, not from whatever the field has already trained against. Once your test data is public, it's a matter of time before it stops discriminating between models.

The operational consequence for anyone doing LLM ops: treat your internal benchmarks as depreciating assets. Track *when* each set was built and how much of it has leaked into training corpora, the same way you'd track model drift. A benchmark that ranked your candidates cleanly six months ago may be giving you noise now — and a flat leaderboard reads identically whether every model genuinely improved or your test just wore out.

The 14 saturation properties they analyze are worth reading against your own harness. The [HN thread](https://news.ycombinator.com/item?id=49170915) has the predictable "just use private evals" replies, which is right but understates the cost of curating them well.

So here's the question I keep coming back to: if expert curation is the only thing that reliably buys benchmark longevity, why does almost every eval budget still spend more on compute to run the suite than on the people who build it?
