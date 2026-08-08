---
layout: post
title: "Why Your Coding-Agent Bill Is a Harness Problem"
date: 2026-08-08 03:04:14 +0000
categories: [llm-ops, agentic-ai, enterprise-ai]
source: hn
source_id: "49214468"
discussion_url: https://news.ycombinator.com/item?id=49214468
source_url: https://www.databricks.com/blog/managing-ai-coding-costs-scale
---

The reframe worth stealing from [Databricks' writeup](https://www.databricks.com/blog/managing-ai-coding-costs-scale) is that runaway coding-agent spend is an ops problem, not a model-selection problem. Most teams stop at "pick a cheaper model." The bigger lever is the harness — context hygiene, caching, tool orchestration — which they tuned for a ~50% cut in generated tokens with no measured quality drop.

- 💡 **The harness owns the bill.** Same model, same codebase, wildly different cost depending on how the harness manages context and cache. Model choice is one line item, not the whole invoice.
- ⚡ **Cache tuning is free money.** Hand-tuning default cache settings to raise the hit rate cut token cost hard — the least glamorous optimization with the best return.
- 🎯 **Route, don't standardize.** Their Unity AI Gateway smart router shaved 30%+ off average task cost by sending easy requests to cheaper models and keeping quality flat.
- ⚠️ **Downshift instead of capping.** When a developer crosses a spend threshold, drop them to a cheaper model rather than blocking them — progressive friction beats a hard wall, the same way graceful degradation beats a hard failure under a latency budget.
- 🔍 **Guard against harness lock-in.** Harnesses are increasingly co-designed for one model family; a meta-harness (they open-sourced Omnigent) keeps you able to swap models without rewriting your workflow.

None of this is exotic — it's the same routing, fallback, and budget-guard discipline that agentic systems already need in production. The [HN discussion](https://news.ycombinator.com/item?id=49214468) is worth a skim for teams weighing the same tradeoffs.

Here's the part I'd push on: "no quality degradation" is only as trustworthy as the eval harness measuring it. If you can't prove a leaner harness or a cheaper model didn't quietly regress your outputs, you haven't cut costs — you've deferred the bill to a worse code review. Can your eval catch a 5% quality slide before your developers do?
