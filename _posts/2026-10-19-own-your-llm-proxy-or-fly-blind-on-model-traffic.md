---
layout: post
title: "Own Your LLM Proxy or Fly Blind on Model Traffic"
date: 2026-10-19 14:14:09 +0000
categories: [llm-ops, ai-infrastructure, agentic-ai]
source: hn
source_id: "50145507"
discussion_url: https://news.ycombinator.com/item?id=50145507
source_url: https://jrdsgl.com/if-you-dont-run-your-own-llm-proxy-how-the-fuck-do-you-even-know-whats-going-on/
---

Vendor dashboards are built to reassure you, not to let you operate. That's the real argument in [this piece on running your own LLM proxy](https://jrdsgl.com/if-you-dont-run-your-own-llm-proxy-how-the-fuck-do-you-even-know-whats-going-on/) — once your calls go through a hosted TUI or someone else's harness, the only telemetry you get is whatever the provider decided to surface, and that's rarely the view you need when something misbehaves in production.

- 🎯 **One endpoint in front of every provider and model** — you pivot between models without reconfiguring the five clients, agents, and harnesses that all point at it.
- 🔍 **Request logs become first-class**: which virtual key called which model, from which client, at what time, with what status. That's the table you actually query when a run goes sideways.
- 🔑 **Virtual keys keep your real key from scattering** across every tool and agent you've wired up — rotate or revoke one without taking the rest down.
- ⚡ **Debugging gets fast**: the author diagnoses a cache miss mid-coding-session in about 20 seconds by hand, and because the proxy exposes its own API, that check is automatable.
- ⚠️ **It isn't free**: a proxy in the hot path is a single point of failure and one more service to run — the reason some teams argue for async instrumentation over a gateway you have to keep up.

This maps onto something I keep relearning in enterprise AI work: observability you bolt on afterward only answers the questions you thought to ask, while a data path you own lets you answer the one you didn't. The [HN discussion](https://news.ycombinator.com/item?id=50145507) splits about where you'd expect — build-your-own purists against the "just buy a gateway" pragmatists. So where's your line: at what point does running your own LLM proxy stop being yak-shaving and start being table stakes?
