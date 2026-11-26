---
layout: post
title: "Where Do Your Prompts Go When Tokens Get Cheap?"
date: 2026-11-26 14:05:37 +0000
categories: [llm-ops, enterprise-ai, industry]
source: hn
source_id: "50652184"
discussion_url: https://news.ycombinator.com/item?id=50652184
source_url: https://commandcode.ai/moat
---

[Moat](https://commandcode.ai/moat) pitches itself as the Costco of AI: a $5/month membership that pools members' usage to buy tokens wholesale, 40–70% off list across roughly a hundred models, with no router fee stacked on top. As a consumer play for hobby projects, the pricing is genuinely interesting.

As production infrastructure, the [HN discussion](https://news.ycombinator.com/item?id=50652184) went straight to the question that actually matters: where does inference run? The top concern wasn't price — it was that the service doesn't disclose which providers serve your requests or where they sit. OpenRouter at least shows you the provider and lets you filter by data policy. A discount aggregator that won't say whether your prompts are logged, trained on, or served from a jurisdiction your compliance team hasn't cleared is a non-starter for enterprise workloads.

This is the quiet tension in the whole LLM-gateway category. Routing is nearly commoditized — anyone can fan requests out to the cheapest backend. The real moat (no pun intended) is everything around the routing: zero-data-retention guarantees, provider transparency, spend attribution, audit logs. The things that stay invisible until a security review asks about them.

I'd reach for something like this for throwaway experiments without hesitation. I wouldn't let it near a prompt I'd have to explain to a data governance board. The distance between those two uses is exactly the distance between "cheap tokens" and "production-ready," and you don't close it with a lower per-token price.

When the token itself is a commodity, does anyone win the gateway market on price — or does it come down to who can prove where your data went?
