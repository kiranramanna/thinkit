---
layout: post
title: "When Not Every Agent Decision Deserves an LLM"
date: 2026-09-20 03:03:55 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
source: hn
source_id: "49767564"
discussion_url: https://news.ycombinator.com/item?id=49767564
source_url: https://github.com/trycua/cua
---

The interesting thing in [Cua's CUA-S1 release](https://github.com/trycua/cua)
isn't the model — it's the architectural bet underneath it. The team asked how
many computer-use steps actually need a general-purpose agent burning tokens on
gpt-6-astra or claude-opus-5, and how many are just local decisions: put this
value in that box, check this one, skip that field. Their answer is a
706k-parameter option-scorer that doesn't generate tokens at all. It takes the
current context plus a fixed set of choices and returns a probability per
choice — something your code can inspect, trust, and act on.

That framing lands for anyone running agents in production. Most of my
orchestration pain isn't the model failing to reason; it's the general agent
loop being invoked for decisions that were never ambiguous, paying full latency
and cost to conclude the obvious. CUA-S1-FORMS scores a whole form in 7-9 ms
locally against ~260-280 ms per hosted call, and on their scoped form task it
beats the general baseline on exactly the boring cases — 100% vs 74% on "leave
the already-filled field alone." Scoped specialization on a narrow decision
space is doing the work here, not scale.

The honest caveats are all there: it's forms-only, trained on synthetic data,
ignores screenshots, and won't predict new text values. But the direction is
the part worth stealing — a general agent that hands well-understood decisions
to cheap, checkable specialists and keeps its expensive reasoning for genuine
novelty. That's a routing problem, not a model problem.

The [HN discussion](https://news.ycombinator.com/item?id=49767564) is worth
reading for where people think the specialist/generalist boundary actually
sits. Where in your agent stack are you paying for system-2 reasoning on
system-1 decisions?
