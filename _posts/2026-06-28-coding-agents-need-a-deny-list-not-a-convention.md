---
layout: post
title: "Coding Agents Need a Deny-List, Not a Convention"
date: 2026-06-28 14:06:51 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48706714
hn_url: https://news.ycombinator.com/item?id=48706714
source_url: https://github.com/openai/codex/issues/2847
---

The Codex issue ["A way to exclude sensitive files"](https://github.com/openai/codex/issues/2847) has stayed open long enough to outlive a Rust rewrite, and it names the real problem cleanly: a coding agent will happily read `.env`, `*.pem`, `id_*`, `.aws/`, and `.ssh/` into the model's context unless something stops it — and right now that something is a paragraph in your README.

- 🔒 **Convention is not a control.** "Don't point the agent at secrets" is documentation; an over-eager retrieval step doesn't read documentation.
- 🎯 **The ask is a deny-list, not a flag** — a repo-local `.codexignore` plus a global ignore, deterministic and shareable, so the boundary lives in the repo instead of in each engineer's head.
- ⚠️ **Read-exclusion is not search-exclusion.** The request is sharp: keep `node_modules/` searchable for grounding, but never *send* `.env` to the model. Those are two scopes most ignore files collapse into one.
- 🔁 **This keeps regressing** — the earlier issue #205 was closed in favor of codex-rs, and the feature didn't survive the port. Security affordances that aren't tested tend to vanish in rewrites.
- 📊 **It's a context-engineering problem, not a policy memo.** The deny-list belongs in the same layer that decides what gets retrieved and packed into the prompt.

I've watched this exact gap in production agent work: the model is rarely the leak — the harness that decides what the model gets to see is. The [HN discussion](https://news.ycombinator.com/item?id=48706714) wants it solved upstream, and they're right that every team shouldn't reinvent a `.gitignore` for model context. We've had a deny-list for what git *commits* for two decades — why is the deny-list for what an agent *reads* still an afterthought?
