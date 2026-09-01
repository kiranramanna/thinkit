---
layout: post
title: "When 'It Just Knows You' Is a Permissions Problem"
date: 2026-09-01 03:09:20 +0000
categories: [rag, enterprise-ai, agentic-ai]
source: hn
source_id: "49511007"
discussion_url: https://news.ycombinator.com/item?id=49511007
source_url: https://usealmanac.com/
---

The [Almanac launch](https://usealmanac.com/) pitches an agent that "just knows you," but strip the demo away and it's a bet on one specific RAG design choice: pre-compile the knowledge into wikis instead of retrieving it at query time. That's a real architectural axis — fast and coherent, but stale-prone — not marketing.

- 🎯 **The claimed moat is memory; the moat that matters is the permission boundary** between the personal wiki and the shared company one — one leak across it and enterprise adoption stops cold.
- ⚠️ **Pre-compiling doesn't kill the RAG problem, it relocates it** — freshness now lives in the wiki-refresh pipeline instead of the retriever, and stale context fails silently.
- 🔍 **Provenance back to source documents** is the right call; a compiled wiki with no citations is unauditable the moment someone asks where an answer came from.
- ⚡ **Long-horizon, session-spanning tasks** are the genuinely hard part — most agents are session-bound, and holding project state across days without drift is still unsolved.
- 📊 **Connector sprawl** (Gmail, Calendar, PostHog, and friends) is where these systems rot operationally, long before model quality is the bottleneck.

The [HN discussion](https://news.ycombinator.com/item?id=49511007) is already circling privacy and permission depth, which tells you where the real evaluation lives. My bet: the winner in company-brain agents won't have the best model or the biggest wiki — it'll have permission-aware retrieval a security team will actually approve.
