---
layout: post
title: "The Bottleneck Isn't the Agent, It's Watching Ten of Them"
date: 2026-06-29 14:07:49 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 48714802
hn_url: https://news.ycombinator.com/item?id=48714802
source_url: https://github.com/ogulcancelik/herdr
---

[Herdr](https://github.com/ogulcancelik/herdr) bills itself as "an agent multiplexer that lives in your terminal" — workspaces, tabs, panes, detach and reattach while the agents keep running. Read that as tmux for coding agents and you've half got it. The half that matters is the line "every agent at a glance: blocked, working, done." That's not a terminal feature. That's a fleet status board, and it's quietly the most interesting thing here.

Once you're running one agent, the loop is the product. Once you're running ten, the loop is a given and *supervision* is the product. The scarce resource stops being model throughput and becomes human attention: which of these ten is wedged on a failing test, which is mid-edit, which finished twenty minutes ago and is burning context waiting for me to look. A multiplexer that surfaces blocked-vs-working-vs-done is solving the actual operational problem of parallel agents — knowing where to point your one pair of eyes.

The detail I'd build on is the socket API buried in the docs. A status-at-a-glance TUI is a human control plane; a socket that exposes the same state machine-readably is the seed of an *orchestration* control plane. The moment "agent 3 is blocked" is a JSON event instead of a colored dot, you can write the supervisor that reassigns it, kills the runaway, or escalates to a human — which is exactly the layer production multi-agent systems need and mostly hand-roll today.

Herdr keeps its agents in real terminals rather than reinterpreting them through a GUI, which is the right call: the agent's own output is the ground truth, and a wrapper that paraphrases it just adds a place for bugs to hide. The [HN discussion](https://news.ycombinator.com/item?id=48714802) is mostly about ergonomics, but the harder question is upstream — when ten agents finish at once, who decides what merges?
