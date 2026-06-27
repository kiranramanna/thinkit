---
layout: post
title: "A Model Router Is Only as Good as Your Eval Harness"
date: 2026-06-27 03:06:39 +0000
categories: [llm-ops, agentic-ai, ai-infrastructure]
hn_id: 48688700
hn_url: https://news.ycombinator.com/item?id=48688700
source_url: https://github.com/workweave/router
---

The pitch for [workweave/router](https://github.com/workweave/router) is the
kind of thing that sounds too easy: point Claude Code, Codex, or Cursor at
localhost, and a drop-in proxy picks the best model for every request — they
claim 40-70% cheaper, one endpoint change. What makes it more than a gimmick is
*how* it routes: a tiny on-box embedder and a cluster scorer (derived from the
Avengers-Pro paper), not an LLM prompted to guess which model to use. Routing on
embeddings instead of vibes is the right instinct — you don't want a model
round-trip just to decide which model to round-trip to.

But a router is only as trustworthy as your ability to measure what "best"
means. The cost number is easy to verify; the quality number is not. When the
router quietly sends a turn to a cheaper model and the answer degrades 5%,
nothing throws. You find out from a thumbs-down three weeks later, if at all.
This is the same wall that makes model migration hard in production — you can't
route on quality you don't measure, and most teams measure cost because cost is
the metric that bills you.

The detail I like is that it ships OTLP traces out of the box. That's what makes
a router operable instead of a black box: you can see which model served which
request and reconstruct a regression after the fact. Per-request routing turns
"which model wrote this" into a question your observability has to answer, and
without traces it's unanswerable.

The [HN discussion](https://news.ycombinator.com/item?id=48688700) leans on the
cost framing, but the harder problem is reproducibility. If two identical
prompts can hit two different models, your eval harness has to treat the router
as part of the system under test — not as infrastructure beneath it.

Would you let a router pick your model in production before your evals could
catch the turn where it picked wrong?
