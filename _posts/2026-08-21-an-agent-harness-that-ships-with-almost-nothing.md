---
layout: post
title: "An Agent Harness That Ships With Almost Nothing"
date: 2026-08-21 14:05:09 +0000
categories: [agentic-ai, llm-ops]
source: hn
source_id: "49384113"
discussion_url: https://news.ycombinator.com/item?id=49384113
source_url: https://github.com/vivekhaldar/seed
---

Every agent framework I've evaluated is a race toward more: more built-in tools, more memory abstractions, more orchestration scaffolding you didn't write and can't fully see. [Seed](https://github.com/vivekhaldar/seed) runs the opposite experiment — it ships with almost nothing and dares the agent to grow the rest.

The frozen core is one file, `seed.py`: a loop wiring a model to a single tool (bash `exec`), with its system prompt loaded from a file the agent is allowed to rewrite. Everything else — tools, skills, memory, conventions — has to be grown, session by session, into a `self/` directory that is the only thing surviving between runs.

- 🎯 **One tool, not fifty** — bash `exec` is the entire action space; the agent builds up from there or it doesn't build at all
- 🧬 **The prompt is mutable state** — the agent owns and rewrites its own system prompt, which is either the whole point or the whole risk
- 📼 **Sessions as a flight recorder** — every run is dumped to `self/sessions/*.json`, available for introspection but never auto-loaded
- 🌱 **Git as the memory substrate** — each agent is its own repo, so its evolution is a commit history you can actually diff
- ⚠️ **The caveat is the thesis** — the authors admit it trusts the agent with capability expansion; that's the experiment, not a bug

In production I do the exact reverse of this: fixed tool registries, hard guardrails, and observability precisely because I don't want the agent rewriting its own contract. But the flight-recorder-plus-git pattern is quietly the most interesting part — it's a cleaner audit trail than most enterprise agent platforms ship. The [HN discussion](https://news.ycombinator.com/item?id=49384113) splits between "elegant" and "loaded footgun," which is usually where the good ideas live.

My bet: almost nobody runs this in production, and almost everybody borrows the git-tracked `self/` directory as an agent-memory pattern within a year.
