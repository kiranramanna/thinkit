---
layout: post
title: "Monitoring Agents Need a Harness, Not a Loop"
date: 2026-10-20 03:06:07 +0000
categories: [llm-ops, agentic-ai, ai-infrastructure]
source: hn
source_id: "50153225"
discussion_url: https://news.ycombinator.com/item?id=50153225
source_url: https://benjamincongdon.me/blog/2026/10/19/Agentic-Monitoring/
---

The sharp claim in [Benjamin Congdon's piece on agentic monitoring](https://benjamincongdon.me/blog/2026/10/19/Agentic-Monitoring/) isn't that an agent can watch your systems — it's that a pure agent loop is the wrong shape for the job. The win comes from a harness where the agent *writes* a monitoring spec and a deterministic scaffold runs it: cleaner signals, a fraction of the tokens, and a model that isn't sitting in the hot path reading every log line.

- 🎯 **Spec-writing beats live-watching** — the agent reads the service code, proposes what to watch, then hands execution to a deterministic system. The expensive model does the thinking once, not on every evaluation.
- 🔍 **Change-point monitoring is the wedge** — roughly 70% of outages trace to a change, and an agent can write a per-release query on the fly instead of leaning on generic health metrics that drown teams in alert fatigue.
- ⚡ **Three moving parts** — a planner agent, a deterministic executor, and an investigator agent that triages fired monitors and escalates to humans. The prototype caught regressions in code the author didn't even know.
- 📊 **The moat is unglamorous** — noise-reduction heuristics, spec-writing prompts, and a labeled eval set to validate changes. Same lesson coding agents taught us: the harness is where the quality lives.
- 💡 **Cost reframes the whole thing** — ~$100/day of small models to cover a fleet turns "monitor only what crosses a human's attention threshold" into "monitor everything."

This matches what I keep relearning in production agent work: reliability rarely comes from a smarter model and almost always from the scaffolding around it — the eval set, the escalation path, the deterministic rails. The [HN discussion](https://news.ycombinator.com/item?id=50153225) is appropriately nervous about letting an agent take write actions like rollbacks or resizing, and that caution is earned. But the framing is right that monitoring hasn't had its "Claude Code moment" yet. What's the first monitoring task you'd trust an agent to own end to end — and the one you'd never let off the leash?
