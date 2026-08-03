---
layout: post
title: "When Agent Tools Stop Being Thin API Wrappers"
date: 2026-08-03 03:05:35 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 49148899
hn_url: https://news.ycombinator.com/item?id=49148899
source_url: https://github.com/micro/mu
---

The interesting thing about [Mu](https://github.com/micro/mu) isn't the 67 tools it hands an agent — web search, mail, storage, calendars, image generation. It's that all 67 come from services that declare themselves once in an in-process registry and then surface as MCP endpoints, CLI commands, a web UI, and an embedded SDK with no extra wiring. Most "tools for agents" projects are thin wrappers around someone else's API. This one runs the services on the same box and treats MCP as one surface among several.

What caught my attention is the ops layer, not the tool count. Mu binds identity server-side from the call context instead of trusting the client to declare who it is, and it meters expensive operations — model calls, paid APIs — against a per-user credit balance. Those are exactly the two problems that turn a demo agent into a production one. In the agentic systems I work on, wiring a tool is an afternoon; giving each tool per-user identity, quota, and an audit trail is the quarter. A single Go binary that bakes those in from the start is a more honest starting point than a pile of stateless wrappers.

The AGPL license and the eclectic built-ins — a wallet, DKIM-signed SMTP, RSS aggregation, image generation — make it read more like one person's opinionated agent OS than a neutral framework, and the [HN thread](https://news.ycombinator.com/item?id=49148899) picks at exactly that. But the design bet is worth stealing regardless: declare a capability once, expose it everywhere, and put identity and cost at the registry layer instead of in each tool. If MCP servers keep multiplying, does per-tool auth and metering scale, or does it have to move down to the registry the way Mu is betting?
