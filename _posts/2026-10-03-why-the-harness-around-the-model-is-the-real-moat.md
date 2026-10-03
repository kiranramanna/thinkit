---
layout: post
title: "Why the Harness Around the Model Is the Real Moat"
date: 2026-10-03 03:08:12 +0000
categories: [agentic-ai, enterprise-ai, industry]
source: hn
source_id: "49938616"
discussion_url: https://news.ycombinator.com/item?id=49938616
source_url: https://blog.sshh.io/p/the-harness-is-the-company
---

[Shrivu Shankar's thesis](https://blog.sshh.io/p/the-harness-is-the-company) — that every SaaS business becomes a harness around a model — reads as obvious to anyone who has shipped an agent into production, and that's exactly why it's worth saying out loud. The model is the easy part. The hard part is everything wrapped around a stateless API call: the orchestration, the tool permissions, the retrieval and context plumbing, the eval harness, and the places where a human gets to say no before anything ships.

The framing of four stages — from engineers using agents, to humans triggering background agents, to the harness orchestrating the humans — tracks what I watch happen on real systems. The interesting inversion is the last one: the org chart stops being about who does the work and becomes about where you put people so the harness extracts the most judgment from them. People turn into taste-holders stationed at the review points that matter. That isn't dystopian; it's just where the leverage sits once an agent can produce the first draft of almost anything.

Where I'd push back is the word "company." The harness is the product, but the moat is narrower than the whole harness — routing, retries, tracing, and a skills library are all converging into open frameworks fast. What doesn't commoditize is the domain context, the proprietary data, and the review loops that encode what "correct" means in your business. That's the part worth guarding, and it's the question worth bringing to the [HN discussion](https://news.ycombinator.com/item?id=49938616): is the harness a durable moat, or a temporary head start before the labs absorb it? My bet is the plumbing commoditizes within a year and the context doesn't. Which half of your harness are you actually investing in?
