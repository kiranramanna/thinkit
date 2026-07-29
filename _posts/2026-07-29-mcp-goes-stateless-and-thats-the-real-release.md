---
layout: post
title: "MCP Goes Stateless, and That's the Real Release"
date: 2026-07-29 03:05:17 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 49088058
hn_url: https://news.ycombinator.com/item?id=49088058
source_url: https://blog.modelcontextprotocol.io/posts/2026-07-28/
---

The headline features in the [2026-07-28 MCP spec](https://blog.modelcontextprotocol.io/posts/2026-07-28/) — MRTR, header-based routing, an extensions framework — are downstream of one decision: the protocol core is now stateless. MCP went from a bidirectional stateful session to plain request/response, and every request is self-describing. That's the change teams running MCP servers in production actually asked for.

Anyone who has tried to scale a stateful bidirectional protocol knows the tax. You need sticky sessions, connection affinity, and a load balancer that understands who's talking to whom. Kill a pod mid-conversation and you've dropped state that was never yours to hold. Making any request landable on any instance behind round-robin is the difference between a demo and a fleet.

Two details matter more than they look:

- 🎯 **Header-based routing** — method and tool names ride in `Mcp-Method` and `Mcp-Name`, so a gateway authorizes and routes without parsing the JSON body. That's real policy enforcement at the edge instead of deep in the app.
- 📊 **Cacheable list results with deterministic order** — tool catalogs cache, and upstream prompt caches stay stable across reconnects. In an agent loop where the tool manifest is re-sent every turn, prompt-cache stability is a direct latency and cost line item, not a nicety.

The tradeoff is honest: server-initiated sampling and elicitation now go through Multi Round-Trip Requests instead of an always-open stream, which is less elegant than true bidirectionality. The spec bet operability over interactivity, and for enterprise deployments that's the right call.

The [HN thread](https://news.ycombinator.com/item?id=49088058) is already arguing about whether stateless-by-default was overdue or a capitulation. My read: the stateful model was the part everyone quietly worked around. Which of your agent tools actually needs a persistent session — or have you been paying for connection affinity you never used?
