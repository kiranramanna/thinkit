---
layout: post
title:  "Durable Agent Workflows Without the Workflow Engine"
date:   2026-05-29 20:05:00 +0000
categories: [agentic-ai, ai-infrastructure, llm-ops]
hn_id: 48326802
hn_url: https://news.ycombinator.com/item?id=48326802
source_url: https://obeli.sk/blog/sqlite-is-all-you-need-for-durable-workflows/
---
**Durable Agent Workflows Without the Workflow Engine**

The reflex when an agent system needs durability is to reach for a managed orchestration tier — a queue, a workflow engine, a hosted database. This [post on using SQLite for durable workflows](https://obeli.sk/blog/sqlite-is-all-you-need-for-durable-workflows/) makes the case that for a lot of agent workloads, that's overbuilt. The framing that stuck with me: "the durable part is the workflow state — the compute can stay cheap and disposable."

The mechanics are the durable-execution playbook done minimally: progress lives in an execution log, workflows replay from persisted history, and activities are retryable. Persistence is local SQLite, with Litestream streaming changes to S3-compatible storage for backup. No network hop to the state store, fault isolation per tenant, and operations you can actually reason about.

What I appreciate is the honesty about the tradeoff:

- 🎯 **Replay + retryable activities** is the right durability model for agents — a half-finished tool chain should resume, not restart from zero.
- ⚡ **Local state, disposable compute** keeps bursty, experimental agent runs cheap.
- ⚠️ **Async replication can lose the newest writes** during a failure — fine for experimental workloads, not for anything needing real HA.

That last point is the whole decision. Durable-execution semantics (replay, idempotent retries) matter far more for most agent systems than five-nines availability. If you're orchestrating LLM tool use with retries and fallbacks, you probably need correct resumption way before you need a distributed transaction log.

The [HN thread](https://news.ycombinator.com/item?id=48326802) predictably argues SQLite-vs-Postgres, which I think misses it — the interesting claim isn't the database, it's that durable execution is a state-management pattern, not a piece of infrastructure you buy. Where's the line for you: at what scale does an agent workflow actually need a real orchestration engine instead of an execution log and a backup?
