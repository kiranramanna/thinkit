---
layout: post
title: "Godot's AI Ban Is Really a Review-Capacity Problem"
date: 2026-07-01 14:08:11 +0000
categories: [agentic-ai, llm-ops, industry]
hn_id: 48743472
hn_url: https://news.ycombinator.com/item?id=48743472
source_url: https://godotengine.org/article/contribution-policy-2026/
---

The interesting part of Godot's decision to [tighten its policy on AI-authored code contributions](https://godotengine.org/article/contribution-policy-2026/) isn't the ban — it's the stated reason. The maintainers aren't primarily arguing that generated code is wrong. They're arguing that nobody attached to the pull request can be trusted to fix it when it breaks. That's a different failure mode than "the model writes bugs," and it's the one I keep running into in production too.

Generation got cheap; review didn't. Godot's own framing is that the effort to open a PR collapsed while the pool of qualified reviewers stayed flat, so the backlog exploded. Every agentic-coding workflow I've run hides the same asymmetry. The model drafts a change in seconds, then a human spends an hour deciding whether to trust it. If your throughput math only counts the generation half, you've mispriced the whole pipeline — and the review queue is where that mistake surfaces.

The sharper point is about ownership. Godot notes that reviewing is worth the effort partly because feedback mentors a future maintainer, and an LLM absorbs that feedback and learns nothing from it. In an enterprise setting the mentoring angle matters less, but the ownership question is identical: someone has to be able and willing to fix the code at 2am, and "the agent wrote it" is not an on-call answer. The [HN thread](https://news.ycombinator.com/item?id=48743472) is full of maintainers describing the same demoralization.

I don't think the answer is banning agents — it's building the review harness before you scale generation. Treat agent output as an untrusted contributor: gated, tested, owned by a named human. Godot reached for a blunt instrument because it doesn't have that harness and can't build one fast enough. What's your team's plan for the day PR volume 10x's but reviewer headcount doesn't?
