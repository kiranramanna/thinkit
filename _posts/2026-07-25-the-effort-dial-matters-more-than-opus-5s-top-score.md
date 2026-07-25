---
layout: post
title: "The Effort Dial Matters More Than Opus 5's Top Score"
date: 2026-07-25 03:05:36 +0000
categories: [llm-ops, agentic-ai, industry]
hn_id: 49038433
hn_url: https://news.ycombinator.com/item?id=49038433
source_url: https://www.anthropic.com/news/claude-opus-5
---

Everyone will quote the leaderboard line from the [Opus 5 announcement](https://www.anthropic.com/news/claude-opus-5) — near the frontier of the top-tier model at half the price. The number that actually changes how I'd run this in production is the *effort setting*: a dial that trades intelligence for token conservation on the same model, per request. That's not a marketing knob, it's the missing primitive for latency budgets and cost SLAs in an agent loop.

Most agent frameworks fake this today by routing between different models — a cheap one for tool-call plumbing, an expensive one for the hard reasoning hop. A single model with an explicit effort axis collapses that routing logic into one call and makes the cost curve legible instead of emergent.

- 🎯 **Effort is per-call**, so you can spend on the planning step and starve the 40 boilerplate tool calls around it
- 📊 **Frontier-Bench v0.1**: more than doubles the prior Opus at a *lower* cost per task — the cost-down, not just capability-up, is the story
- ⚡ **CursorBench 3.2 at max effort** lands within 0.5% of the top model at half the cost per task
- 🔍 **OSWorld 2.0 computer-use** wins at any given cost point — relevant if your agents drive real UIs
- ⚠️ **Honest boundary**: it's explicitly behind another model on cybersecurity tasks — a rare bit of capability-gap disclosure in a launch post

The [HN thread](https://news.ycombinator.com/item?id=49038433) is already litigating benchmark validity, which misses the operational point. A frontier score you can't afford at your QPS is a demo; a dial that lets you pick your point on the intelligence/cost curve per request is an ops feature.

If effort settings become standard across providers, does model routing as a discipline mostly evaporate — or just move up a layer into "how much effort does this sub-task deserve"?
