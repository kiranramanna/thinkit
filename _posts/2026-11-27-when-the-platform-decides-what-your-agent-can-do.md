---
layout: post
title: "When the Platform Decides What Your Agent Can Do"
date: 2026-11-27 03:04:46 +0000
categories: [agentic-ai, enterprise-ai, industry]
source: hn
source_id: "50653477"
discussion_url: https://news.ycombinator.com/item?id=50653477
source_url: https://techstackups.com/articles/google-workspace-ai-agents-mcp/
---

The headline is that Gmail's new MCP server can't send email. The real story is that, from 1 February 2027, Google will require any tool that "is or is driven by an AI agent" to reach Workspace through its own MCP servers — so tool capability just became a governance decision Google makes, not one you make.

Per the [writeup](https://techstackups.com/articles/google-workspace-ai-agents-mcp/), the Gmail server can search, read, label, and create drafts, but send, reply, forward, and even editing a draft after the fact sit behind unnamed "partner access." Draft a reply, get feedback, and you can't revise it — you create a second draft and abandon the first. Agents that keep calling the REST API directly drop to Standard-tier quotas on that date and, Google says, breach the terms. Anthropic's own Workspace connector can send; an independent developer on the same OAuth scopes can't match it through the public servers.

For anyone shipping production agents, this is the part worth sitting with. The orchestration layer no longer decides what a tool can do — the platform does, and it can change the answer with a terms addendum. Google's stated reason has teeth: OAuth was built for human-paced apps, and a prompt-injected email agent quietly forwarding sensitive data is a real failure mode I'd design against too. But routing every agent through one gateway also hands Google a kill switch over which agents get to act and what data they may keep. The [HN discussion](https://news.ycombinator.com/item?id=50653477) splits along the obvious line between "sensible safety default" and "rent-seeking gatekeeper."

That split is exactly how the wider web is reading it. [PivotNews](https://pivotnews.ai/five/google-s-workspace-agent-mandate-leaves-gmail-mcp-server) frames the mandate as crippling the Gmail server, with send and forward reserved for partners nobody can name. A developer on [dev.to](https://dev.to/frankchu/23-or-30-tools-googles-gmail-mcp-cant-decide-59j3) is less exercised about send and more about the server reporting 23 or 30 tools depending on which backend answers — an agent can't plan against a catalog that won't hold still. [Drag](https://www.dragapp.com/blog/gmail-mcp-server/) takes the opposite side, calling draft-only "the security model" rather than a missing feature, since a human still approves anything that leaves the outbox. The disagreement tracks a fault line that isn't going away: whether keeping a human in the send path is a guardrail or a handcuff.
