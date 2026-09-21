---
layout: post
title: "The Anti-MCP Argument Is a Bet on Model Capability"
date: 2026-09-21 14:05:03 +0000
categories: [agentic-ai, ai-infrastructure]
source: hn
source_id: "49779329"
discussion_url: https://news.ycombinator.com/item?id=49779329
source_url: https://maharship.com/blog/why-mcp-was-always-a-bad-idea/
---

The argument in [Maharshi Patel's "Why MCP Was Always a Bad Idea"](https://maharship.com/blog/why-mcp-was-always-a-bad-idea/) is easy to nod along to, and worth resisting for a second. The claim: MCP was built for models that couldn't write their own glue code; today's models can; so most MCP servers are token-heavy wrappers around APIs and CLIs the agent could hit directly. Delete them, standardize on HTTP and `--help`, let the model compose. It's a clean thesis. It's also a bet, not a fact.

The critique lands where it hurts. Every MCP server you wire in spends context — tool schemas the model reads on every turn whether or not it uses them — and a fleet of servers turns that into real budget pressure and real tool-selection errors. If the model can discover a CLI from `--help` and call a documented API it has never seen, a server that only re-describes that API is pure overhead. On that narrow point the post is right, and the [HN discussion](https://news.ycombinator.com/item?id=49779329) is full of people who have felt the schema bloat firsthand.

Where I'd push back is on what MCP actually buys you in production, which isn't discovery — it's the boring governance layer. A server is where auth, rate limits, audit logging, and a stable tool contract live, so the model isn't improvising raw credentialed HTTP calls against your systems. "The model is smart enough to call the API directly" and "I want the model calling that API directly" are different sentences. Capability going up doesn't make me want less of a control surface between an autonomous agent and a payment endpoint; it makes me want more.

My guess is the future isn't "delete MCP," it's a split: thin wrapper servers die, and the ones that survive stop pretending to be discovery layers and lean all the way into being policy layers. So the question the post really raises isn't whether models outgrew MCP — it's whether the protocol was ever mostly about capability, or whether we quietly needed it for control the whole time.
