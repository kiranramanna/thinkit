---
layout: post
title: "Routing Two Models Beats Both, If You Have an Oracle"
date: 2026-07-22 03:02:56 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48999291
hn_url: https://news.ycombinator.com/item?id=48999291
source_url: https://fireworks.ai/blog/kimik3-fable
---

Fireworks' [Kimi K3 write-up](https://fireworks.ai/blog/kimik3-fable) has one result worth sitting with: route each task to whichever model handles it best, and you don't land between an open model and a frontier one — you land above both. Across roughly 1,030 tasks, K3 and Fable 5 were nearly tied on SWE bug-fixes (92.4% vs 92.6%), split the wins on terminal ops, multi-language, and legal, and the routed system hit 93% while running up to ~50X cheaper than Fable alone on long agentic loops.

The economics track what I see in production: an open model that burns 1.3M tokens over 55 turns can still beat a frontier model's 130K tokens in 21 turns, because prompt caching makes cheap tokens nearly free. Cost per correct task, not cost per token, is the number that matters once you're running agents in a loop.

Here's the asterisk the post is honest about, and where production diverges from the benchmark: this is *oracle* routing. It picks the cheapest option that turns out to be correct — using knowledge of correctness it doesn't have at inference time. That's an upper bound, not a router you can ship. The entire hard problem is predicting, before you spend the tokens, which model will get this specific task right.

That predictor is the actual product. A cheap classifier that's wrong 15% of the time can erase the whole 50X edge by sending hard tasks to the cheap model and easy ones to the expensive one. The [HN discussion](https://news.ycombinator.com/item?id=48999291) mostly celebrates the routing number; I'd want the gap between oracle routing and a real learned router before I trusted the cost story in prod.

What's your routing signal when you can't peek at the answer?
