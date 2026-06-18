---
layout: post
title: "Agent Memory Is a Retrieval Problem, Not a Context Window"
date: 2026-06-18 14:05:25 +0000
categories: [agentic-ai, rag, llm-ops]
hn_id: 48583703
hn_url: https://news.ycombinator.com/item?id=48583703
source_url: https://www.elastic.co/search-labs/blog/agent-memory-elasticsearch
---

Most "agent memory" demos are really context-window stuffing with a nicer name: replay the last N turns and hope the model notices. That breaks on cost, on latency, and on the lost-in-the-middle effect, where a fact buried at position 4,000 may as well not exist. The [Elastic search-labs writeup](https://www.elastic.co/search-labs/blog/agent-memory-elasticsearch) is worth reading because it treats memory as a retrieval system with an eval attached, not a prompt trick — and that framing is the one that survives contact with production.

The architecture is the part to copy. Three indices, hybrid recall with RRF plus a reranker, and two operations the demos always skip: supersession and decay. Sarah reset her smart-home hub in March and again last week; neither worked. A memory layer that can't mark the old fact as superseded will keep suggesting that reset forever, and decay handles the inverse — stale context that should fade rather than compete for top-K. Crucially, recall here is measured, not asserted: R@10 of 0.89 across 168 questions, which means you can actually regress it when you change the retriever.

The detail I'd underline for anyone shipping multi-tenant agents is the per-user document-level security for zero tenant leaks. A memory bug in that setting isn't a wrong answer — it's user A's history surfacing in user B's session, which is the kind of thing that ends up in an incident review rather than a changelog.

What I haven't seen anyone publish yet is an eval harness for *forgetting*. We measure whether the right memory comes back; who's measuring whether the stale one stays gone? The [HN thread](https://news.ycombinator.com/item?id=48583703) has the usual vector-DB-versus-everything fight, but that recall number is what should anchor it.
