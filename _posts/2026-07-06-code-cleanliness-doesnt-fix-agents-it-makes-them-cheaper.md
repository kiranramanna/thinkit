---
layout: post
title: "Clean Code Doesn't Fix Coding Agents, It Makes Them Cheaper"
date: 2026-07-06 03:06:17 +0000
categories: [agentic-ai, llm-ops, research]
hn_id: 48798815
hn_url: https://news.ycombinator.com/item?id=48798815
source_url: https://arxiv.org/abs/2605.20049
---

The instinct on every team running coding agents is that messy repos will tank
the agent. This [minimal-pair study from SonarSource](https://arxiv.org/abs/2605.20049)
tests that directly, and the headline result is a shrug: across 660 trials, code
cleanliness didn't move the agent's pass rate at all. The tasks got done either way.

What did change is the part I actually budget for in production: the operational
footprint. On cleaner repositories the agent used 7-8% fewer tokens and revisited
files less. That's not a correctness story, it's a cost-and-latency story. When
you're paying per token and running agents at any real volume, a 7-8% swing on
every task is the difference between a workflow that pencils out and one that
doesn't. The agent finding the answer is table stakes; how much wandering it does
to get there is the operating expense.

The methodology is the interesting bit. Instead of comparing different codebases
and hoping the confounders wash out, they built matched pairs, same architecture,
dependencies, and external behavior, differing only in static-analysis violations
and cognitive complexity, then graded through hidden tests at the public surface.
That's how you isolate cleanliness from raw agent capability, and it's the kind of
controlled eval design most internal agent benchmarks skip. The
[HN thread](https://news.ycombinator.com/item?id=48798815) is already arguing about
whether pass rate is even the right metric, which is the right argument to have.

If cleanliness buys you efficiency but not accuracy, does the ROI on a big
refactor-for-the-agents project survive contact with that 7-8% number?
