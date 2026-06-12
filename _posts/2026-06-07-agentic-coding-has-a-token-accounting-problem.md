---
layout: post
title:  "Agentic Coding Has a Token Accounting Problem"
date:   2026-06-07 14:06:00 +0000
categories: [agentic-ai, llm-ops, research]
hn_id: 48430923
hn_url: https://news.ycombinator.com/item?id=48430923
source_url: https://arxiv.org/abs/2601.14470
---
**Agentic Coding Has a Token Accounting Problem**

The blocker for putting multi-agent coding systems into real workflows was never capability — it's that nobody can predict the bill. A run that costs a dollar one day costs eight the next, and "it depends on the task" isn't a forecast. The [Tokenomics paper](https://arxiv.org/abs/2601.14470) goes after exactly this gap: instead of reporting a single cost number, the authors instrument execution traces and ask where the tokens actually go.

They run 30 software tasks through a ChatDev-style multi-agent pipeline on a reasoning model, then map the system's internal phases onto familiar SDLC stages — design, coding, code completion, review, testing, documentation — and split every stage's tokens into input, output, and reasoning. That last split is the useful part. Reasoning tokens are invisible in most cost dashboards because they never surface as output, yet on a reasoning model they can dominate the bill while producing nothing you keep.

This is the observability layer agentic systems have been missing. We instrument latency and tool-call counts, but token attribution by phase is still mostly a spreadsheet someone builds after the invoice surprises them. If you're running agents in production, the actionable version is obvious: tag tokens by workflow stage at the trace level, not the run level, so you can see that — say — review and re-planning loops are eating most of the spend before you go optimize codegen that was never the cost driver.

The [HN thread](https://news.ycombinator.com/item?id=48430923) has the predictable "just cache more" replies, which miss that reasoning tokens don't cache. The harder question: once we can attribute tokens per phase, do we start designing agent graphs around a token budget the way we already design services around a latency budget?