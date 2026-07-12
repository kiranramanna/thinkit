---
layout: post
title: "Running a Model No Single Machine Can Hold"
date: 2026-07-12 03:03:03 +0000
categories: [ai-infrastructure, llm-ops]
hn_id: 48876505
hn_url: https://news.ycombinator.com/item?id=48876505
source_url: https://www.iroh.computer/blog/mesh-llm
---

The interesting claim in Mesh LLM isn't the OpenAI-compatible endpoint on `localhost:9337` — every local-inference project ships one now. It's [Skippy mode](https://www.iroh.computer/blog/mesh-llm): partitioning a model by layer ranges across several machines so a 235B mixture-of-experts runs on hardware where no single node could hold the weights.

That's pipeline parallelism, except the "interconnect" is iroh — authenticated QUIC addressed by public key, with hole-punching, NAT traversal, and relay fallback instead of NVLink or InfiniBand. Activations for each pipeline stage cross the office LAN (or the public internet) over a `skippy-stage/2` protocol stream. Everything else — gossip, routing, HTTP tunnels, plugin RPC — is multiplexed over one connection by single-byte stream tags. It's a clean design, and the whole runtime is ~18 MB.

Here's what the writeup skips, and it's the part that decides whether this is usable in production: latency. Pipeline-parallel inference is only as fast as the slowest stage plus the activation-transport cost between every hop. On NVLink that transport is nanoseconds; over hole-punched QUIC between a laptop and a workstation two subnets away, it's a variable you have to measure per token. No benchmarks, no P99, no failure-mode analysis when a mid-pipeline node drops. For a chatbot demo that's fine. For anything with an SLA, the missing number is the whole story.

The pitch — "you don't control when the model updates or what hardware sits underneath" — is real, and the sovereignty argument for pooling idle office GPUs is a good one. But sovereignty and latency budgets are different axes. The [HN thread](https://news.ycombinator.com/item?id=48876505) has people asking the same question I am: what does a token cost, wall-clock, when the model is smeared across four machines that were never designed to be one?

Would you put a layer boundary on the far side of a NAT hole-punch if a reranker's P99 was already your tightest budget?
