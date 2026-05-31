---
layout: post
title:  "Routing Is Becoming the Real AI Infrastructure"
date:   2026-05-30 19:30:00 +0000
categories: [ai-infrastructure, agentic-ai, industry]
hn_id: 48338660
hn_url: https://news.ycombinator.com/item?id=48338660
source_url: https://openrouter.ai/announcements/series-b
---
**Routing Is Becoming the Real AI Infrastructure**

[OpenRouter raised a $113M Series B](https://openrouter.ai/announcements/series-b), led by CapitalG. The funding is the headline, but the interesting part is what the round implies about where value is settling in the stack: not in any single model, but in the layer that decides *which* model gets the request.

OpenRouter describes itself as sitting between agents and model providers — handling routing, reliability, cost optimization, and compliance across 400+ models for 8M+ developers. Their weekly token volume reportedly went from 5 trillion to 25 trillion in six months, on pace for over a quadrillion a year. Whatever you think of the multiples, that's a lot of traffic flowing through a routing tier rather than a direct provider integration.

Routing is squarely in the agentic-systems problem space, and it's harder than "pick the cheapest model":

- 🎯 **Per-request model selection** is an optimization problem — quality, latency, and cost are in tension on every call.
- 🔁 **Reliability via fallback** — when a provider degrades, the routing layer is your retry/failover, exactly like orchestration inside an agent.
- 📊 **Compliance and observability** belong at the gateway, not bolted onto each integration.

The investor list is its own signal: alongside CapitalG, the venture arms of NVIDIA, ServiceNow, MongoDB, Snowflake, and Databricks all joined. When that many infrastructure and enterprise players back a routing gateway, they're betting the abstraction layer between apps and models is durable, not a temporary convenience.

The [HN discussion](https://news.ycombinator.com/item?id=48338660) is skeptical — "it's a proxy with a margin." Maybe. But every team I've seen building serious agents eventually rebuilds routing, fallback, and cost controls in-house. The question worth sitting with: is model routing a feature you own, or infrastructure you rent?
