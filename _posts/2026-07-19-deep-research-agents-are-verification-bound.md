---
layout: post
title: "Deep Research Agents Are Verification-Bound, Not Search-Bound"
date: 2026-07-19 14:06:21 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 48967355
hn_url: https://news.ycombinator.com/item?id=48967355
source_url: https://quesma.com/blog/custom-deep-research-pipeline/
---

The detail that matters in [this Quesma write-up](https://quesma.com/blog/custom-deep-research-pipeline/)
isn't that a deep-research run burned a whole Claude Max plan in 30 minutes. It's *where*
the budget went: the run launched 111 agents and queued 123 claims for verification, but
only 25 got verified before the limit hit — and the final synthesis never ran. That's the
real shape of these systems. The search is cheap; the checking is what bankrupts you.

Once you internalize that, the architecture the author landed on stops looking clever and
starts looking necessary. He split the work by role instead of throwing one expensive model
at everything: Sonnet 5 to find (cheap enough to run in bulk), Opus 4.8 to verify (accuracy
matters more on the check than the search), the priciest model reserved only to plan and
resolve disputes, Haiku for extraction and formatting. That's routing driven by where
correctness actually needs to live, which is exactly the calculus I keep hitting in
production agentic work — you don't pay for the smartest model per token, you pay for it
per *decision that would be expensive to get wrong*.

The part I hadn't seen before: he wired Codex and Antigravity in as headless subagents under
a Claude Code harness, sharing memory via an extended `claude-mem`, so tokens draw from three
separate subscription pools he already pays for. Cross-vendor subagents as a rate-limit
arbitrage. It's a hack, but it's the honest kind — a direct response to the fact that a single
plan's allowance can't sustain a verification-heavy pipeline.

The [HN thread](https://news.ycombinator.com/item?id=48967355) is arguing about whether this
counts as gaming the plans. I'd rather ask the design question: if verification is the cost
center, should deep-research harnesses be quoting you a confidence budget up front, the way a
query planner estimates rows before it scans?
