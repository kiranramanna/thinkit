---
layout: post
title: "Your Coding Agents Can't Read Each Other's Memory"
date: 2026-11-08 14:05:51 +0000
categories: [agentic-ai, llm-ops, industry]
source: hn
source_id: "50411467"
discussion_url: https://news.ycombinator.com/item?id=50411467
source_url: https://www.lorekit.io/blog/open-agent-memory-format
---

Put three coding agents on the same repo and you get three memory silos that can't see each other. One writes an `AGENTS.md`, one keeps an Anthropic-style `/memories` directory, one logs a JSONL knowledge graph — and as [this post argues](https://www.lorekit.io/blog/open-agent-memory-format), none of them can read the others. The framing is the part worth sitting with: this is a missing *agreement*, not a missing tool. We don't need a smarter memory layer; we need the boring interop contract that lets one agent's hard-won project lessons survive a switch to a different agent.

The OpenTelemetry analogy earns its keep. OTel didn't win by shipping a better tracer — it won when OpenTracing and OpenCensus stopped competing and agreed on a shared data model, semantic conventions, and a wire protocol, which freed vendors to compete on storage and analysis instead of on the schema. The post sketches the agent-memory equivalent: a record envelope with fields like `address`, `written_by`, `content_type`, and `lifecycle`; a Markdown body that also serializes to JSON; namespaced attributes (`vcs.*`, `ci.*`); a minimal MCP contract — write, read, list, search, archive — and conformance tests for round-tripping and expiry. It also draws a distinction I hadn't made cleanly before: most existing efforts solve *export* between vendors, but live shared *addressing* — two running agents resolving the same memory key — is the harder, unspecified half. The [HN discussion](https://news.ycombinator.com/item?id=50411467) is worth it for the fair pushback on whether a spec can keep pace with how fast agent runtimes still churn.

The reason this matters at team scale is that memory is quietly becoming the stickiest lock-in surface we have. If an agent's accumulated context only lives in one vendor's format, switching cost stops being about the model and starts being about everything the agent learned about your codebase.

The wider web is converging on the premise while splitting on the spec. [HackerNoon](https://hackernoon.com/agent-memory-has-a-lock-in-problem-open-formats-are-how-we-fix-it) frames it identically — agent memory has a lock-in problem that only open, portable formats fix — but points at Google's Open Knowledge Format as the answer. A [DEV Community](https://dev.to/plur9/is-there-an-open-standard-for-ai-agent-memory-engrams-2ckj) writer agrees a standard is overdue and backs PLUR's Engram spec instead, while [RuntimeWire](https://runtimewire.com/article/mads-thines-lorekit-local-memory-ai-coding-agents)'s coverage leans on the same developer-owned, local-Markdown pitch. Everyone wants open memory; nobody yet agrees whose format it is — which is exactly the pre-merge moment OpenTelemetry had to grow out of.
