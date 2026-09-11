---
layout: post
title: "When 90% Fewer Tokens Doesn't Cut the Bill"
date: 2026-09-11 14:05:10 +0000
categories: [llm-ops, agentic-ai]
source: hn
source_id: "49656471"
discussion_url: https://news.ycombinator.com/item?id=49656471
source_url: https://quesma.com/blog/does-rtk-make-ai-coding-cheaper/
---

The interesting thing in [Quesma's RTK benchmark](https://quesma.com/blog/does-rtk-make-ai-coding-cheaper/)
isn't RTK. It's the reminder that "tokens saved" is a vanity metric until you
measure it against the bill you actually pay.

RTK compresses terminal output before a coding agent reads it, and its own
counter proudly logged tens of millions of tokens saved. Then the benchmark
ran the tasks end to end: Claude Code costs fell 1-5%, DeepSeek costs *rose*
5-17%. The savings evaporated for a boring reason — terminal output was only
11% of input tokens for one model and 40% for another, and fewer bytes per
turn sometimes bought more turns.

- 🎯 "Tokens removed" counts bytes stripped, not dollars saved — scored against
  a counterfactual run that never happened
- ⚠️ Compressing 90% of a stream that's a fraction of your input moves the
  total a little, not a lot
- 🔁 Fewer bytes per turn can mean more turns; one bug made an attempt cost
  roughly 9x baseline
- 🔍 Editor-native tools — Read, Grep, Edit — bypass the bash hook entirely, so
  the tokens they accumulate go untouched
- 📊 Frontier models already trim their own terminal usage, shrinking whatever
  headroom is left

This is the whole case for measuring LLM-ops cost the annoying way: a fixed
task suite, billed end to end, with turns and cache reads in the denominator.
A feature's self-reported savings and your invoice are different numbers, and
only one of them shows up on the finance dashboard. The
[HN discussion](https://news.ycombinator.com/item?id=49656471) has people
reporting the same gap from their own runs.

So here's the uncomfortable version: most token-reduction tooling should be
graded on cost-per-completed-task, and a lot of it wouldn't survive that
grading. Which of your own optimizations have you actually billed end to end?
