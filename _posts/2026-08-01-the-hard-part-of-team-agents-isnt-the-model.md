---
layout: post
title: "The Hard Part of Team Agents Isn't the Model"
date: 2026-08-01 03:08:03 +0000
categories: [agentic-ai, enterprise-ai, llm-ops]
hn_id: 49126604
hn_url: https://news.ycombinator.com/item?id=49126604
source_url: https://github.com/yc-software/qm
---

Most agent frameworks quietly assume a single user. [qm](https://github.com/yc-software/qm), a multiplayer agent harness that hit HN this week, assumes an org instead — and that one assumption reshapes the architecture more than the model choice does. The decision worth stealing: agents act *as the user*, with that user's own credentials, inside a per-scope sandbox, and every action is audited.

- 🎯 **Per-scope isolation** — each employee or room gets its own files, tools, and sessions instead of one shared monolith
- 🔍 **Audit by default** — the agent runs as a real identity, so "who did what" stays answerable during an incident
- ⚡ **Postgres for sessions, memory, and job queues** — boring, durable, debuggable infrastructure over anything clever
- ⚠️ **Graduated security postures** with command-approval policies — "dangerous" becomes a deliberate choice, not the default
- 💡 **Swappable harnesses and models** over an HTTP core — Slack and web are just clients of the same agent loop

This maps onto the problems I actually hit deploying multi-agent workflows in enterprise settings: identity, blast radius, and provenance are harder than orchestration. The [HN discussion](https://news.ycombinator.com/item?id=49126604) is mostly arguing about the model layer, which I think misses the point — the unsolved question isn't which model runs the loop, it's whether you can trust what that loop did with someone's credentials at 2am. Does agent-as-user actually scale to a thousand employees, or does the audit surface eventually become its own governance problem?
