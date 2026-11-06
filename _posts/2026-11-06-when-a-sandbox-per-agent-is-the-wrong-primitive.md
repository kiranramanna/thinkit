---
layout: post
title: "When a Sandbox Per Agent Is the Wrong Primitive"
date: 2026-11-06 03:10:25 +0000
categories: [agentic-ai, ai-infrastructure, industry]
source: hn
source_id: "50381687"
discussion_url: https://news.ycombinator.com/item?id=50381687
source_url: https://github.com/rivet-dev/rivet
---

The argument buried in [Rivet's launch](https://github.com/rivet-dev/rivet) is about a primitive, not a product. Most agent infrastructure starts from "give each agent a sandbox," and a sandbox is a heavyweight thing — roughly 512 MB and a ~1.7s cold start, sitting mostly idle while the agent waits on a model or a tool. Their bet is that the actor model is the right unit for long, bursty agent turns, and the sandbox is a habit we never re-examined.

- 🎯 **The unit is the actor, not the sandbox** — a ~72 KB baseline against 512 MB, 4.9ms against 1.7s p99 to start. For agents that spend most of their life idle between turns, that density difference is the whole pitch.
- ⚡ **S3 as primary storage, kept off the write path** — writes ack once SSDs in two of three AZs have them, then batch to S3 in the background. They quote ~1ms durable writes, with S3 only in play on a cold read.
- 💡 **State travels with the agent** — in-memory context plus a durable SQLite database per actor, so a long turn keeps its working set without a round-trip to a shared Postgres that couldn't keep up anyway.
- 🔍 **Open-source Durable Objects** — the same long-lived-state and hibernation model as Cloudflare's, but a single self-hostable Rust binary with S3 as the only dependency.
- ⚠️ **It's early** — the current release is a preview and the tiered-storage scheme is doing a lot of load-bearing work. I'd put their 138ms S3 cold-read p99 against my own tail-latency budget before wiring a production agent loop through it.

The honest question this raises: how much of what we call agent "orchestration" is really just paying VM prices to keep idle processes warm? If the actor model holds up under real multi-tool workloads, a lot of today's sandbox spend is a default nobody argued for. The [HN discussion](https://news.ycombinator.com/item?id=50381687) is worth reading for the durability skeptics poking at the S3-on-the-read-path story.
