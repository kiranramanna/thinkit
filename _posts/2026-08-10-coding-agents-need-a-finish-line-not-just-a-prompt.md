---
layout: post
title: "Coding Agents Need a Finish Line, Not Just a Prompt"
date: 2026-08-10 03:07:32 +0000
categories: [agentic-ai, llm-ops, industry]
source: hn
source_id: "49233448"
discussion_url: https://news.ycombinator.com/item?id=49233448
source_url: https://openchamber.dev/
---

The interesting thing about OpenChamber isn't that it wraps a coding agent in a nicer UI — it's that it treats "watching the agent" as the actual job. [OpenChamber](https://openchamber.dev/) is a desktop, browser, and VS Code front-end for the OpenCode agent that leans into the parts most CLI agents leave implicit: multiple agents running in parallel on isolated git worktrees from one prompt, diffs you review before they land, and sessions you can branch like experiments.

The feature I'd actually use is Session Goals. Instead of prompting an agent and babysitting the loop, you hand it a finish line; after every turn it checks whether the goal is met and keeps going until it's done, blocked, or hits a limit you set — even after you close the app. That's the quiet shift from "agent as autocomplete" to "agent as a long-running job with a termination condition," which is exactly the boundary where orchestration and observability stop being optional.

That's also where I'd push back. A goal-checker that runs after every turn is itself an LLM-as-judge deciding "done or not done," and we already know those judges drift lenient. Give an agent a long leash and a self-graded finish line, and the failure mode isn't a crash — it's a confident "goal complete" on work that quietly missed half the requirements.

The [HN discussion](https://news.ycombinator.com/item?id=49233448) is mostly about whether a GUI belongs on top of a terminal-native agent at all. I think that misses it: the UI is incidental, and the durable idea is the finish line. So here's what I'd want to know before wiring one into my own workflow — when the agent declares victory after I've closed the laptop, who checks its work?
