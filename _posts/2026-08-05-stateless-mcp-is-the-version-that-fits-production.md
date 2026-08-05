---
layout: post
title: "Stateless MCP Is the Version That Fits Production"
date: 2026-08-05 14:05:14 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 49131438
hn_url: https://news.ycombinator.com/item?id=49131438
source_url: https://simonwillison.net/2026/Jul/31/stateless-mcp/
---

The headline change in the 2026-07-28 MCP spec is that a tool call is now a
single HTTP request instead of an initialize-then-call handshake. That sounds
like protocol trivia until you've tried to run a stateful MCP server behind a
load balancer. [Simon Willison's write-up](https://simonwillison.net/2026/Jul/31/stateless-mcp/)
frames it as a renewed personal interest; from an ops seat it reads as MCP
finally shedding the one property that made it painful to operate.

Legacy MCP handed you an `Mcp-Session-Id` on the first request and expected you
to route every subsequent call for that session to the same backend machine.
That's session affinity, and session affinity is where horizontal scaling goes
to die — sticky routing, drain-before-deploy dances, memory that has to live
somewhere warm. Stateless MCP collapses that to one self-describing POST with
the method and tool name in headers. No server-side session, no affinity, no
"which box has my state" problem. It's the difference between a protocol you
demo and a protocol you put on an autoscaling group.

There's a second-order effect worth naming: auditability. Giving an agent a
shell and `curl` can do most of what MCP does, but a stateless tool call is far
easier to log, rate-limit, and reason about than an open terminal — and small
models running on a laptop can drive it reliably. That's the real production
argument for MCP over "just give the agent a shell," and stateless is what makes
it cheap enough to mean it. The [HN thread](https://news.ycombinator.com/item?id=49131438)
already has people rebuilding clients against the new spec in an afternoon.

If your tool surface is stateless anyway — and most search and retrieval tools
are — what was the session ever buying you besides operational debt?
