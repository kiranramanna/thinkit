---
layout: post
title: "Your Inference Supply Chain Leaks Your Prompts"
date: 2026-11-22 14:12:59 +0000
categories: [llm-ops, enterprise-ai, industry]
source: lobsters
source_id: "32rhzb"
discussion_url: https://lobste.rs/s/32rhzb/researcher_plants_2m_canaries_into_ai
source_url: https://arstechnica.com/security/2026/11/a-leaky-ai-supply-chain-is-exposing-secret-user-data-at-an-alarming-rate/
---

The clever move in [this canary experiment](https://arstechnica.com/security/2026/11/a-leaky-ai-supply-chain-is-exposing-secret-user-data-at-an-alarming-rate/) is epistemic, not technical: it turns "our prompts stay private" from an assumption nobody measures into a number you can watch leak. The researcher seeded roughly two million prompts with unique, trackable secrets — fake URLs and credentials no legitimate system would ever fetch — pushed them through the AI supply chain, and waited to see who came knocking. Plenty did. Secret URLs got scraped and the git repos they pointed at got cloned, by parties several hops removed from the model the prompt was aimed at.

The detail worth sitting with is that the leaks followed individual resellers and intermediaries, not the marketplace as a whole. That matches the shape of how most of us actually consume inference now: not one provider, but a chain of routers, gateways, and resellers, each of which sees the raw payload. We spend real effort scrubbing PII out of our own logs and then hand the same text to a supply chain we have never audited and mostly can't name. End-to-end privacy dies at the first intermediary that logs, and a prompt is egress the moment it leaves your process.

So "trust the provider" isn't a control, it's a hope — and this method is the cheap way to replace it with evidence. You can plant your own canaries: route a handful of uniquely tagged secrets through your real inference path and alarm if any of them ever resolve. It's the data-exfiltration equivalent of a tripwire, and unlike a vendor questionnaire it tells you something true. The [Lobste.rs thread](https://lobste.rs/s/32rhzb/researcher_plants_2m_canaries_into_ai) is where the security crowd is working through what that means for anyone shipping on third-party inference.

If you can't name every party that sees a decrypted prompt between your app and the model, is your PII guardrail protecting anything past the first hop?
