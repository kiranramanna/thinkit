---
layout: post
title: "AI Found Seven Crypto Bugs; Triage Stayed Human"
date: 2026-07-08 03:05:44 +0000
categories: [llm-ops, agentic-ai, research]
hn_id: 48821749
hn_url: https://news.ycombinator.com/item?id=48821749
source_url: https://blog.zksecurity.xyz/posts/circl-bugs/
---

The headline result from zkSecurity's audit — [seven confirmed vulnerabilities in Cloudflare's CIRCL library](https://blog.zksecurity.xyz/posts/circl-bugs/), including a CP-ABE flaw that fully breaks access-control enforcement and a Float64 precision loss in threshold RSA — is the part that will get quoted. The part worth internalizing is where the LLMs failed.

Two failures stand out for anyone running an eval or agentic pipeline. First, the models produced *candidate* findings, not reports: most bugs needed human validation before disclosure, and the AI gathered related issues without reliably explaining how they connected. Second, and more damning operationally, the severity ratings were unreliable in an *asymmetric* way. An eval harness can absorb symmetric noise — you calibrate around it. Asymmetric error in a security-severity score is the kind of thing that quietly buries a critical while escalating a non-issue.

There's a subtler signal about where the capability actually lives. The best runs paired raw LLM prompts with "skills" maintained by security experts — the domain knowledge migrated into the harness, not the weights. And model behavior shifted within *weeks*: Claude Opus 4.6 and GPT-5.3 swapped discovery-versus-validation roles between runs. Any production pipeline that hard-codes "model X finds, model Y verifies" is pinning to a snapshot that expires fast.

The optimistic read is that AI-for-security works: real cryptographic bugs in a real library, found by a pipeline. The realistic read is that the value showed up as recall, not judgment — surfacing candidates a human expert then triages. The [HN discussion](https://news.ycombinator.com/item?id=48821749) leans toward the hype framing. If the winning pattern is high-recall AI plus expert-authored skills plus human triage, what does that do to the "autonomous security researcher" pitch everyone is selling?
