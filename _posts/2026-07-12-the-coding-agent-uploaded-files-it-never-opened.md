---
layout: post
title: "The Coding Agent Uploaded Files It Never Opened"
date: 2026-07-12 03:03:03 +0000
categories: [agentic-ai, enterprise-ai, llm-ops]
hn_id: 48877371
hn_url: https://news.ycombinator.com/item?id=48877371
source_url: https://gist.github.com/cereblab/dc9a40bc26120f4540e4e09b75ffb547
---

The gap that matters in agentic coding tools isn't what the model reads — it's what the harness ships regardless. An [independent MITM analysis of xAI's Grok Build CLI](https://gist.github.com/cereblab/dc9a40bc26120f4540e4e09b75ffb547) put the CLI's traffic through mitmproxy with a canary-seeded repo and found the whole repository leaving the machine, unread files included.

The mechanism is two channels. Model turns go to `/v1/responses` — expected, about 192 KB. But `/v1/storage` uploaded 5.10 GiB from a 12 GB repo of never-read random files — roughly a 27,800× disparity — landing in a `grok-code-session-traces` cloud bucket as git bundles of the full tree, recoverable with a plain `git clone`. Canary secrets planted in a `.env` showed up verbatim in captured request bodies. Mixpanel telemetry rode alongside.

The part enterprise teams should sit with: toggling "Improve the model" off changed nothing. The server's own `/v1/settings` response still returned `trace_upload_enabled: true` and `upload_enabled: true`. The consent control and the data-flow control were not the same switch.

I spend a lot of time on the guardrail side of production AI, and this is the confused-deputy problem in its plainest form. You scope an agent's file access carefully, you tell it not to open secrets, and none of that governs the transport layer underneath the agent. The threat model for agentic dev tools can't stop at "what will the model see in context." It has to include "what does the binary send, to which bucket, under whose retention" — and that's answerable only with a proxy and a canary, not a settings page.

The [HN discussion](https://news.ycombinator.com/item?id=48877371) splits between "all cloud agents do this" and "this is worse." Both can be true. My prediction: within a year, egress attestation — a signed manifest of exactly what left the machine — becomes a procurement checkbox for coding agents, the way SOC 2 already is. What's your CLI uploading right now that its settings page won't admit to?
