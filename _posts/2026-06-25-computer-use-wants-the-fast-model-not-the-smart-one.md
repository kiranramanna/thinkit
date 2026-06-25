---
layout: post
title: "Computer Use Wants the Fast Model, Not the Smart One"
date: 2026-06-25 03:06:00 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48662999
hn_url: https://news.ycombinator.com/item?id=48662999
source_url: https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-computer-use-gemini-3-5-flash/
---

The interesting thing about [computer use landing in Gemini 3.5 Flash](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-computer-use-gemini-3-5-flash/) isn't that another model can click buttons — it's that Google put it on the *fast* tier. A computer-use agent is a perception-action loop: screenshot, reason, act, repeat. Every step pays full model latency, and a task that takes a human 30 seconds can be 40-plus model calls. On a flagship model that loop is slow and expensive enough that almost nobody runs it in production. On a Flash-class model the unit economics start to make sense.

That's the lever I watch in agentic systems. Most of the cost in a multi-step agent isn't the one hard reasoning step — it's the dozens of cheap, mechanical steps around it: read the screen, find the field, scroll, confirm. Routing those to a small fast model while reserving the expensive model for actual planning is the same two-tier pattern that makes RAG rerankers affordable: cheap pass first, expensive pass only when it earns its place.

The open question is reliability. A fast model that's wrong 5% of the time per step compounds badly across a long loop — 0.95^40 is about a 13% end-to-end success rate. Cheap inference makes the latency math work but moves the bottleneck to error recovery: retries, verification steps, and knowing when to escalate to the bigger model. The [HN thread](https://news.ycombinator.com/item?id=48662999) has the usual split between "this changes desktop automation" and "it still can't handle a modal dialog." Both are right.

If your agent's success rate lives or dies on per-step accuracy, does a faster-but-weaker model actually help you — or just let you fail more cheaply?
