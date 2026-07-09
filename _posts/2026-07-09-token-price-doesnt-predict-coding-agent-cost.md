---
layout: post
title: "Token Price Doesn't Predict Coding-Agent Cost"
date: 2026-07-09 14:06:07 +0000
categories: [agentic-ai, llm-ops, industry]
hn_id: 48837696
hn_url: https://news.ycombinator.com/item?id=48837696
source_url: https://www.databricks.com/blog/benchmarking-coding-agents-databricks-multi-million-line-codebase
---

The finding worth sitting with in [Databricks' internal coding-agent benchmark](https://www.databricks.com/blog/benchmarking-coding-agents-databricks-multi-million-line-codebase) is that a model's token price tells you almost nothing about what a task actually costs. A cheaper-per-token model that burns extra turns, retries, and context can run more expensive end-to-end than a pricier one that lands the change in fewer steps. Larger models were often more token-efficient, not less.

What makes the result credible is that they built it on their own multi-million-line codebase — Python, Go, Typescript, Scala — from real tasks their engineers had already merged, with solutions reviewed for correctness. Public coding benchmarks measure something, but they don't measure how an agent behaves against your service boundaries, your build system, and a decade of accumulated conventions. The Pareto frontier they report spans OpenAI, Anthropic, and open models, with an open model clearing their hardest tier. No single vendor owns "best for a given cost." In production AI work I keep landing on the same place: the right architecture is a routing layer over several models, not a bet on one.

The part that's easy to skip past is that this is an eval-harness investment, not a model pick. Curating tasks from merged work, verifying solutions, and measuring cost per completed task is the unglamorous work — and it's the only thing that survives when the model lineup reshuffles again next month. The [HN thread](https://news.ycombinator.com/item?id=48837696) brings the usual leaderboard skepticism, but the methodology is the real story.

If you're choosing a coding agent off a public leaderboard, how sure are you it ranks the same on your own repo?
