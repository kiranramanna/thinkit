---
layout: post
title: "Designing Tool APIs the Agent Can Actually Use"
date: 2026-07-16 03:03:32 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48894874
hn_url: https://news.ycombinator.com/item?id=48894874
source_url: https://www.freestyle.sh/blog/opinion/designing-apis-for-agents
---

The [Freestyle post on designing APIs for agents](https://www.freestyle.sh/blog/opinion/designing-apis-for-agents) lands on something I keep hitting in production: the SDK a human finds elegant is often the one an agent fumbles. Agents don't skim your docs and reach for the next field through autocomplete. They pattern-match against what they saw in training, emit code in one shot, and pay tokens for every bit of surface area they have to reason about.

That inverts a lot of good human-API instinct. Clever defaults that hide configuration become a liability when the caller can't see what's hidden. Terse names save a human one keystroke and cost an agent a guess. The article's "pro long names, anti-utility" stance reads as heresy until you've watched an agent invent a method that doesn't exist because the real one was abbreviated past the point of prediction. For tool use inside an agent loop I'd push it harder: the tool schema should be self-describing, explicit beats magic because hidden state is context the model can't audit, and a handful of flat tools beat a deep utility hierarchy the model has to traverse. Every field the agent must reason about is both token cost and a fresh chance to hallucinate.

The uncomfortable part is that we spent a decade tuning developer ergonomics for humans, and the fastest-growing consumer of those APIs now reasons nothing like one. The [HN discussion](https://news.ycombinator.com/item?id=48894874) has fair pushback on whether this is a durable design shift or just current-model brittleness.

If models keep getting better at using bad APIs, does this design discipline survive — or is "design for agents" just a patch for today's context limits?
