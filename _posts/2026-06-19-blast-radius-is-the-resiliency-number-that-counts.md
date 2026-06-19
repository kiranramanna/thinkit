---
layout: post
title: "Blast Radius Is the Resiliency Number That Counts"
date: 2026-06-19 14:03:30 +0000
categories: [ai-infrastructure, enterprise-ai, industry]
hn_id: 48547969
hn_url: https://news.ycombinator.com/item?id=48547969
source_url: https://americanexpress.io/cell-based-architecture-for-resilient-payment-systems/
---

The [American Express engineering writeup](https://americanexpress.io/cell-based-architecture-for-resilient-payment-systems/) on cell-based architecture is a solid systems-design read, but the line worth stealing is buried halfway down: a cell is defined by its failure boundaries, not by a specific infrastructure construct. Most teams get this backwards. They draw cell boundaries around Kubernetes clusters or cloud accounts, then act surprised when a shared config service quietly couples everything back together.

The payments version of the pattern is strict in an instructive way: each cell is an independently deployable unit, a single failure domain, with no synchronous cross-cell dependency in the critical path. That last clause is the whole game. The moment one cell has to call another to complete a transaction, your blast radius is the union of both — and you've paid the complexity tax of cells without buying the isolation.

This maps cleanly onto AI-serving platforms, which is why I keep coming back to it. A bad model rollout, an agent retry storm, a reranker that starts timing out under load — all of these want to be contained to one cell of tenants, not propagated across the fleet through a shared embedding service or a global queue. The hard part isn't standing up cells; it's auditing the critical path until you can honestly say nothing in it crosses a boundary synchronously. That audit usually surfaces the one shared dependency nobody wanted to own.

The [HN thread](https://news.ycombinator.com/item?id=48547969) has the usual cells-vs-shuffle-sharding debate, worth a read. My take: shuffle sharding optimizes for fairness, cells optimize for containment, and if you run anything that can loop — agents very much included — containment is what lets you sleep. Where's the synchronous cross-cell call hiding in your serving path?
