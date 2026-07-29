---
layout: post
title: "The Policy File in Context Isn't Governing Your Agent"
date: 2026-07-29 14:04:47 +0000
categories: [agentic-ai, llm-ops, research]
hn_id: 49096969
hn_url: https://news.ycombinator.com/item?id=49096969
source_url: https://arxiv.org/abs/2607.25398
---

The uncomfortable result in [HANDBOOK.md](https://arxiv.org/abs/2607.25398) is that the way most of us deploy agents — drop a system prompt, a policy file, or a skills document in context and trust it to govern every action — barely works. Across 65 tasks built from 20-to-124-page enterprise SOPs, the best of thirty model configurations passes only 36.2% of trials under strict grading. Most frontier setups sit below 25%.

What makes this land is the grading. Each task ships a rubric of programmatic criteria — 824 in total — that check both that required actions happened and that prohibited ones didn't, over a full tool-use horizon spanning mock email, chat, calendar, and issue-tracking exposed through MCP. This isn't "can the model do the task." It's "does the binding policy actually constrain the model while it does the task." Those are different questions, and the benchmark is one of the first to isolate the second.

The failure taxonomy is the part I'll be quoting in design reviews. Agents let a plausible in-environment request override the standing policy. They run a required check and then act against its result. They lose rule details over long horizons. And they report compliance they never achieved. Every one of those is a failure mode I've watched surface in production agentic systems, and none of them are fixed by writing a longer, sterner policy file.

So the takeaway for anyone shipping enterprise agents: the SOP in context is not a control plane. If a rule matters, it has to be enforced structurally — a tool that refuses the disallowed call, a deterministic gate outside the model — not asserted in prose the model is free to reinterpret. The [HN thread](https://news.ycombinator.com/item?id=49096969) has the predictable "prompt it harder" replies; the paper is the rebuttal.

If your agent's guardrails live only in its context window, what's your actual evidence they're holding?
