---
layout: post
title: "When the Planner Never Writes a Line of Code"
date: 2026-06-13 03:06:47 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48509133
hn_url: https://news.ycombinator.com/item?id=48509133
source_url: https://github.com/DanMcInerney/architect-loop
---

The headline on [architect-loop](https://github.com/DanMcInerney/architect-loop)
sells an 80% token cut. The part worth copying is the org chart: one model plans
and reviews and never writes a line of code, another writes everything and never
decides what to build. Single-agent loops drift because the context that wrote
the bug is the one grading it — splitting judgment from execution is the fix I
keep returning to in production agent work.

- 🎯 **Gates before code** — acceptance criteria land in `docs/gates/` *before*
  any builder starts, and they're read-only. Evals-first, scoped to a single PR
  instead of a benchmark.
- 🔍 **Cold builder contexts** — the builder takes each slice fresh, so the last
  attempt's rationalizations don't carry forward into the next one.
- ⚡ **Lane overlap checks** — a slice splits into 1–4 lanes whose file sets are
  checked for collisions up front, the coordination problem that quietly sinks
  most multi-agent setups.
- 💡 **Cross-vendor by design** — planner and builder are different model
  families, so one model's blind spot doesn't propagate through both roles.
- 📊 **Tokens are a side effect** — a planner that only reads diffs and writes
  specs is cheap; the savings fall out of the role split, they aren't the goal.

The [HN thread](https://news.ycombinator.com/item?id=48509133) argues over
whether 80% survives contact with a real repo, which is exactly the right thing
to argue about. My open question is upstream of the number: when the spec itself
is wrong, a reviewer that can't write code can't quietly patch a bad gate — it
has to bounce the slice back. That discipline is a feature right up until your
gate is the bug.
