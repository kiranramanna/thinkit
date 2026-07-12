---
layout: post
title: "The Agent Log Tells You What It Did, Not What It Saw"
date: 2026-07-12 14:07:30 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48878682
hn_url: https://news.ycombinator.com/item?id=48878682
source_url: https://github.com/cosmtrek/mindwalk
---

The sharpest line in [Mindwalk's README](https://github.com/cosmtrek/mindwalk) is a diagnosis of what agent observability actually lacks: "a session log records what an agent did, but not how it understood the task." Every JSONL trace I've read has this gap. You can reconstruct the edits. You cannot easily see which parts of the repo the agent decided mattered, where it wandered, or whether its footprint matched the scope you intended.

Mindwalk's move is to render a coding-agent session as light moving across a 3D map of the codebase. It's a small idea with a real payoff — turning replay from line-by-line log reading into pattern recognition.

- 🔍 **Attention, not just actions** — file glow encodes how deep and how often the agent touched each area, so over-exploration and blind spots are visible at a glance.
- 🎯 **Touch states carry intent** — unseen, viewed, read, edited. The gap between "read a lot" and "edited little" is where you catch an agent thrashing.
- ⚡ **Deterministic layout** — identical codebases produce comparable maps, so you can diff two sessions instead of eyeballing two log dumps.
- 📊 **Timeline markers** — context compactions, subagent launches, and user interrupts are annotated, which is where most agent runs quietly go sideways.
- ✅ **Local-only** — the trace layer normalizes Claude Code and Codex formats and nothing leaves the machine.

The reason this matters for LLM ops: when an agent produces a bad diff, the failure usually isn't the edit — it's the retrieval and attention that led there. We instrument the output and starve the reasoning path of telemetry.

The [Show HN discussion](https://news.ycombinator.com/item?id=48878682) leans on the visualization's polish. I'd rather ask: once you can see where an agent looked, what's the first eval you'd build on top of that signal?
