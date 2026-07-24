---
layout: post
title: "Hetzner Renting Tokens Is a Hardware Bet, Not a Model One"
date: 2026-07-24 14:06:11 +0000
categories: [llm-ops, ai-infrastructure, industry]
hn_id: 49033087
hn_url: https://news.ycombinator.com/item?id=49033087
source_url: https://sliplane.io/blog/hetzner-inference
---

The headline is that Hetzner is experimenting with LLM inference. The part worth your attention is *who* is doing it. Hetzner rents bare metal by the hour; a bare-metal host standing up an OpenAI-compatible endpoint is a bet on GPU supply and utilization economics, not on shipping a better model.

The [first-look writeup](https://sliplane.io/blog/hetzner-inference) is refreshingly unhyped. No billing, no SLA, one model — `Qwen3.6-35B-A3B-FP8`, a 35B MoE with 3B active params, FP8 weights, 262K context. Point an OpenAI client at their base URL and it just works. The author clocked ~153 ms median time-to-first-token and ~224 output tokens/sec on a warm connection, then correctly refused to treat those numbers as anything but a single-client snapshot. That restraint matters: TTFT and throughput off an idle endpoint tell you nothing about behavior under concurrent load, which is the only regime that decides whether you can run production traffic on it.

One operational detail earned a note in my head: the `enable_thinking: false` flag, which stops the model from burning completion budget reasoning before it answers — and which isn't documented by Hetzner. Undocumented request-shape knobs that change your token bill are exactly the kind of thing that silently breaks when a provider iterates. Don't build a latency budget on an unpromised parameter.

The strategic read is compute economics. If a commodity host can serve open-weight MoE models at these latencies on their own hardware, the marginal cost of self-hostable inference keeps dropping, and the make-vs-rent line for mid-size models moves again. That's the calculus enterprise AI teams re-run every quarter — and OpenAI-compatibility means switching costs are close to a base-URL change. The [HN discussion](https://news.ycombinator.com/item?id=49033087) is split on whether an experiment without an SLA is worth wiring up at all.

If bare-metal hosts start treating inference as another rentable primitive, who still needs a dedicated inference startup for open-weight models?
