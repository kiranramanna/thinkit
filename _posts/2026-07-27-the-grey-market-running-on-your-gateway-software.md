---
layout: post
title: "The Grey Market Running on Your Gateway Software"
date: 2026-07-27 03:03:49 +0000
categories: [llm-ops, ai-infrastructure, industry]
hn_id: 49058993
hn_url: https://news.ycombinator.com/item?id=49058993
source_url: https://vectoral.com/blog/token-relay-market
---

The detail that stuck with me from [this teardown of the API "relay" market](https://vectoral.com/blog/token-relay-market) isn't the 97%-off pricing. It's that the fraud pipeline runs on the same open-source gateways plenty of us self-host for legitimate multi-provider routing — one-api and new-api. The abuse layer and the ops layer are the same binary.

A relay (a "transfer station") proxies traffic to frontier models at a deep discount — one listing offered $3,333 of Anthropic credit for about 425 RMB. That price only works because of the stack underneath it: card merchants supplying stolen billing credentials upstream, account pools aggregating keys behind a unified OpenAI-compatible endpoint in the middle, and reseller relays with local-language billing downstream. The ten busiest relays pull roughly 3.6M visits a month; one site raffles fifty $100 keys a day. The same "channels plus key pool plus single endpoint" abstraction that makes new-api convenient for a platform team is what makes it convenient for an account-pool operator.

For anyone running LLM infra, this reframes key management. A leaked key isn't a billing incident — it's inventory for a market with its own gateways, quotas, and usage multipliers. Per-key spend anomaly detection, aggressive rotation, and provider-side geo/velocity limits stop being hygiene and become fraud defense. The [HN discussion](https://news.ycombinator.com/item?id=49058993) leans on distillation demand as the driver, but the stolen-card upstream is the part that should worry provider security teams. When does a frontier lab start treating key issuance as a payments-fraud problem instead of a rate-limit one?
