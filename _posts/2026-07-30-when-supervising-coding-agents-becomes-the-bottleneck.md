---
layout: post
title: "When Supervising Coding Agents Becomes the Bottleneck"
date: 2026-07-30 14:06:49 +0000
categories: [agentic-ai, llm-ops]
hn_id: 49107749
hn_url: https://news.ycombinator.com/item?id=49107749
source_url: https://github.com/YoanWai/agent-manager
---

The interesting thing about [agent-manager](https://github.com/YoanWai/agent-manager) isn't the tmux TUI. It's what the tool's existence says about where the bottleneck moved. A year ago the open question was whether a coding agent could land a real change. Now people run Claude Code, Codex, OpenCode, and Grok Build side by side on the same repo, and the hard part is supervising all of them at once.

agent-manager puts every agent session in one list with live status — which one is done, which is stuck waiting on you, which one died. Each runs in its own tmux session, so it survives you quitting the manager, and a dead session revives where it left off. The detail I like most: `ctrl+r` opens a syntax-highlighted full-file diff of what an agent changed, and a comment you leave on a line goes straight back into that agent's pane. That's the review loop, collapsed into the terminal.

This tracks with what I see in production agentic work. Once orchestration, retries, and fallbacks are solid enough that you can fan out to N agents, the throughput limiter stops being the model and becomes the human in the loop. Nobody reviews five parallel diffs as fast as five agents can produce them. A multiplexer like this is really an admission that we've traded "wait for one agent" for "triage a queue of agents" — and triage is its own skill. The [HN discussion](https://news.ycombinator.com/item?id=49107749) is already asking the obvious next question: who reviews the reviewer when the manager starts suggesting which agent to check first?

My prediction: within a year the layer that matters isn't the multiplexer, it's the policy that decides which agent's output is worth a human's attention — and that policy will look a lot like an eval harness pointed at your own team's time.
