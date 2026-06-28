---
layout: post
title: "The Cheapest Router Is the One That Never Calls a Model"
date: 2026-06-28 14:06:51 +0000
categories: [llm-ops, ai-infrastructure]
hn_id: 48704373
hn_url: https://news.ycombinator.com/item?id=48704373
source_url: https://github.com/itsthelore/wayfinder-router
---

The interesting claim in [Wayfinder Router](https://github.com/itsthelore/wayfinder-router) isn't an accuracy number — it's that the routing decision costs nothing. Most cost routers (RouteLLM, NotDiamond, OpenRouter's Auto) decide which tier a prompt deserves by calling a trained classifier or an LLM judge. That adds latency, dollars, and nondeterminism to the exact step meant to save you money. Wayfinder reads a prompt's structure — length, headings, lists, code, a few optional lexical cues — scores it in microseconds, offline, and returns "local" or "cloud." No API key, no network, the same answer every time.

In production that reproducibility matters more than a leaderboard rank. A router you can't reproduce is a router you can't debug: when last week's "summarize this" suddenly starts going to the expensive tier, you want a deterministic score to point at, not a classifier checkpoint that quietly drifted.

The part I respect is that the repo documents where this breaks. "Prove √2 is irrational" is short and structurally trivial but semantically hard — Wayfinder scores it near zero, indistinguishable from "fix my typo," so no threshold sends it to the strong model without dragging every easy prompt along with it. They even shipped a double-blind eval showing the lexical cues don't generalize (≈20% of unseen hard prompts caught, losing to a plain word-count baseline), which is why those cues ship off by default. That's the honest version of an eval most projects bury.

So the trade is explicit: you give up catching semantic difficulty to get a free, offline, reproducible decision you can calibrate on your own traffic. For a fleet paying top-tier prices on "rephrase this email," that's a good trade. The [HN thread](https://news.ycombinator.com/item?id=48704373) is arguing the same line — is structural routing a stopgap until a tiny local classifier gets cheap enough, or is "no model call to decide" a property worth keeping permanently?
