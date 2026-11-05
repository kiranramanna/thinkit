---
layout: post
title: "The Agent Stack Is the Question Now, Not the Model"
date: 2026-11-05 14:09:16 +0000
categories: [agentic-ai, llm-ops, industry]
source: hn
source_id: "50366117"
discussion_url: https://news.ycombinator.com/item?id=50366117
source_url: null
---

A year ago this thread would have been one question: which model? The [Ask HN thread](https://news.ycombinator.com/item?id=50366117) instead fans out into five separate layers — paid subscriptions, raw pay-as-you-go APIs, coding harnesses, orchestration or swarm tools, and full agent platforms — and that fan-out is the actual story. The model has become the least differentiated part of anyone's setup.

What people argue about is everything wrapped around the model. Which harness — the default CLI, or something custom? Do you route through a gateway and self-host for the cheap bulk work? Are you orchestrating several agents, or is a single well-instructed loop still winning? These are the questions I spend real time on in production, because the model you pick barely moves the P99 or the cost; the harness, the retries, and the routing policy do. A capable model behind a sloppy harness loses to a mid-tier model behind a disciplined one.

The honest subtext of the thread is churn. People switch harnesses every few months, stack multiple subscriptions from the same provider, and can't quite say why one setup feels better than the last. That's not maturity — it's a field still discovering its own abstractions, which is exactly why a snapshot like this is worth taking. If your agent stack looks nothing like it did six months ago, that's the signal, not the noise. What in your current setup do you expect to throw away by spring?
