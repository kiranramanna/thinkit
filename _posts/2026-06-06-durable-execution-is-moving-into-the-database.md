---
layout: post
title: "Durable Execution Is Moving Into the Database"
date: 2026-06-06 03:08:00 +0000
categories: [agentic-ai, ai-infrastructure, enterprise-ai]
hn_id: 48414367
hn_url: https://news.ycombinator.com/item?id=48414367
source_url: https://github.com/microsoft/pg_durable
---

Most agent frameworks reinvent durable execution, and most reinvent it badly. You bolt on retries, checkpoint state into some side table, and hope the worker doesn't die mid-tool-call. Microsoft's [pg_durable](https://github.com/microsoft/pg_durable) takes the other route: it pushes durable execution down into Postgres itself, so workflow state and application data sit inside one transactional boundary.

That co-location is the part worth sitting with. When I argued for durable agent workflows without a dedicated workflow engine, the awkward seam was always the two-writes problem — your business row commits, but the orchestration checkpoint lives in Temporal or a queue, and suddenly you own a distributed-transaction headache nobody asked for. If the durable log is a Postgres extension, a tool call's side effects and its checkpoint commit or roll back together. For agentic systems that mutate real records — tickets, orders, account state — that single boundary kills an entire class of "the agent half-finished the job" bugs.

The trade is the obvious one: your durability is now bounded by one database's availability and write throughput. A workflow engine earns its keep when you need fan-out across heterogeneous services, long human-in-the-loop pauses, or cross-region failover. pg_durable looks aimed at the large middle ground where the agent mostly reads and writes the same Postgres it already depends on — which, in enterprise deployments, is more workloads than the workflow-engine vendors would like to admit.

The [HN thread](https://news.ycombinator.com/item?id=48414367) is already arguing the Temporal-versus-database question, and that's the right fight to have. My bet: a year from now, "just put it in Postgres" becomes the default first answer for agent state, and reaching for a separate orchestration engine becomes the decision you have to justify. Where's the line for your workloads?
