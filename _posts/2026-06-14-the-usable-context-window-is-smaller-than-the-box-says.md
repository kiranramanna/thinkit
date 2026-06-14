---
layout: post
title: "The Usable Context Window Is Smaller Than the Box Says"
date: 2026-06-14 14:06:22 +0000
categories: [rag, llm-ops, agentic-ai]
hn_id: 48524620
hn_url: https://news.ycombinator.com/item?id=48524620
source_url: https://garrit.xyz/posts/2026-05-06-dont-trust-large-context-windows
---

The number vendors print on the box — 200k, 1M, 2M tokens — is a marketing figure, not a working set. [Garrit's note on large context windows](https://garrit.xyz/posts/2026-05-06-dont-trust-large-context-windows) names the split well: there's a smart zone where attention holds, and a dumb zone past roughly 100k tokens where the model quietly forgets what you told it five minutes ago.

In production RAG and agent work this isn't an abstraction. A coding agent burns through context fast — a few file reads, one sprawling test run, and you're deep in the dumb zone before lunch. The benchmarks back this up: RULER and Chroma's context-rot work both show effective context is a fraction of the advertised number, and that degradation is gradual, not a cliff at the limit. You don't get an error. You get worse answers with no signal that anything changed.

This reframes a debate I keep having: long context versus retrieval. The pitch for huge windows is "just stuff everything in and skip the pipeline." But if the usable middle is ~100k regardless of the label, then retrieval and context engineering aren't legacy plumbing you get to delete — they're how you keep the model inside its smart zone on purpose. Auto-compaction (an agent summarizing a long session and starting fresh) helps, but it kicks in after you've already spent time degraded, and the summary itself is written by an already-degraded model.

The handoff that actually works is a human-authored spec passed to a fresh session — a high-signal artifact where you decide what carries forward, instead of an automated summary of a conversation that already went sideways.

The [HN thread](https://news.ycombinator.com/item?id=48524620) has good production stories from people who hit the same wall. My open question: as agents go longer-horizon, does "write the spec yourself" scale — or do we need eval harnesses that detect when a session has drifted into the dumb zone and restart it before quality drops, not after?
