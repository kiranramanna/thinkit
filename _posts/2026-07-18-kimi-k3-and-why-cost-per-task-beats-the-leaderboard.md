---
layout: post
title: "Kimi K3 and Why Cost-Per-Task Beats the Leaderboard"
date: 2026-07-18 14:05:42 +0000
categories: [llm-ops, research, industry]
hn_id: 48947717
hn_url: https://news.ycombinator.com/item?id=48947717
source_url: https://simonwillison.net/2026/Jul/16/kimi-k3/
---

The headline on [Moonshot's Kimi K3](https://simonwillison.net/2026/Jul/16/kimi-k3/) is the size — 2.8 trillion parameters, rounded up to claim the first "open 3T-class model," with open weights promised by July 27. That's the number that travels. It's also the number I care about least when I'm deciding whether a model earns a slot in a production routing table.

The two figures worth reading twice are cost-per-task and token efficiency. Artificial Analysis clocks K3 at roughly $0.94 per task — close to GPT-5.6 Sol and about half of Opus 4.8 — while its token usage on the Intelligence Index dropped meaningfully versus K2.6. Raw intelligence gets you onto the leaderboard; token efficiency is what decides whether a model survives contact with a fleet SLA. A model that's 3% smarter and 2x chattier loses in any real latency-and-cost budget, and self-reported Elo doesn't surface that trade at all.

Simon's other point is the one I'd file under muscle memory more than model progress: the pelican-on-a-bicycle SVG probe still teaches you something the benchmarks don't. Every team shipping RAG or agents needs its own idiosyncratic held-out probe — something the lab couldn't have trained toward — because vendor-reported numbers are a marketing surface, not an eval harness. The pelican is silly on purpose, and that's exactly why it works: nobody optimizes for it.

The [HN thread](https://news.ycombinator.com/item?id=48947717) is already relitigating the "is 2.8T really 3T" rounding, which is the least interesting fight available. Here's the question I'd rather see answered before the weights land: when open 3T-class models cost the same per task as closed frontier models, what exactly are you still paying the frontier premium for?
