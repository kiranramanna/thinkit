---
layout: post
title: "The Coding Agent That Writes 637 TB a Year"
date: 2026-06-22 14:07:28 +0000
categories: [llm-ops, agentic-ai, ai-infrastructure]
hn_id: 48626930
hn_url: https://news.ycombinator.com/item?id=48626930
source_url: https://github.com/openai/codex/issues/28224
---

A logging default doesn't sound like a reliability incident until it's writing [637 TB a year to your SSD](https://github.com/openai/codex/issues/28224). That's the extrapolation in a Codex issue: 37 TB written in 21 days, roughly 640 full-drive rewrites annually on a 1 TB disk, against consumer SSDs rated for ~600 TBW total. The agent doesn't crash — it quietly spends your drive's endurance budget.

- 🔍 **Root cause is a one-liner**: the SQLite feedback sink ships with `with_default(Level::TRACE)`, so every dependency and protocol payload gets persisted.
- 📊 **TRACE is 70.7% of retained bytes**, with OpenTelemetry mirrors adding another 25.3% — the agent logs its own telemetry twice.
- ⚡ **36,211 rows inserted per 15 seconds** with flat retention means insert-and-prune write amplification, not just raw volume.
- ⚠️ **The expensive bytes are websocket/SSE payloads** — exactly the large model-protocol traffic an agent generates constantly.
- 💡 **The fix is boring on purpose**: selective filters, store payload summaries instead of raw content, drop mirrored telemetry, cap database size.

This is the unglamorous side of LLM ops. We spend eval cycles on whether the agent picked the right tool, then ship a default that treats local disk as infinite. Observability for agents has a cost function, and TRACE-everything is the lazy answer that moves the cost off the dashboard and onto the user's hardware. The [HN discussion](https://news.ycombinator.com/item?id=48626930) runs the usual split between "who runs an agent for 21 days straight" and "this is exactly why local-first tooling needs write budgets."

My take: as more of us run long-lived background agents, every persistent sink needs a byte budget the same way we give them a latency budget and a token budget. When did you last check what your coding agent writes to disk per hour?
