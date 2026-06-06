---
layout: post
title: "When Your Agent's Retry Logic Belongs in Postgres"
date: 2026-06-06 14:08:22 +0000
categories: [agentic-ai, ai-infrastructure, rag]
hn_id: 48414367
hn_url: https://news.ycombinator.com/item?id=48414367
source_url: https://github.com/microsoft/pg_durable
---

The interesting part of [Microsoft open-sourcing pg_durable](https://github.com/microsoft/pg_durable) isn't that durable execution exists — Temporal, Step Functions, and DBOS have been around for a while. It's where it now lives: inside Postgres, checkpointing each step so a workflow resumes from the last durable point after a crash instead of replaying from scratch.

That matters for anyone running agentic workflows. The reliability problem in production agents is rarely the model call — it's everything around it: the retry that re-runs a side effect, the fallback that loses state, the orchestration glue spread across a queue, a worker, and three status tables. Durable execution is the primitive that collapses that glue into one place. Doing it in the database your state already lives in removes a whole tier of infrastructure most teams bolt on reluctantly.

The README's own example workloads are telling — chunk, call an embedding API, upsert into pgvector. That's a RAG ingest pipeline described as a durable function. The same checkpoint-and-resume semantics that make a batch job safe are exactly what you want when an embedding API rate-limits you halfway through a 200k-document reindex. The [HN thread](https://news.ycombinator.com/item?id=48414367) is mostly the classic "smart database vs. dumb pipe" fight over whether orchestration belongs in the DB at all.

My bet: the next agent frameworks stop shipping a bespoke durability layer and lean on whatever the data tier already guarantees. If your agent's retries and your documents live in the same transactional store, you get exactly-once semantics for free instead of reconciling two systems that disagree after a crash. The open question is latency — do you really want a long-running agent loop holding a database session open?
