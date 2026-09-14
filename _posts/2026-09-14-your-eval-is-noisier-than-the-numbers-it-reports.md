---
layout: post
title: "Your Eval Is Noisier Than the Numbers It Reports"
date: 2026-09-14 14:09:51 +0000
categories: [llm-ops, research, industry]
source: hn
source_id: "49655621"
discussion_url: https://news.ycombinator.com/item?id=49655621
source_url: https://danluu.com/exercise-7/
---

Dan Luu's [walk through three broken
benchmarks](https://danluu.com/exercise-7/) lands on a failure mode I keep
seeing in production eval harnesses: taking a continuous, noisy score and
stapling a hard pass/fail threshold on top of it. Senior SWE-Bench's "tasteful
solve" is the clean example — a solution passes only if it clears a rubric cut
*and* isn't more than 2x the length of a reference. So a model at 121 lines of
code passes where 122 would fail, on a benchmark run once per condition. When
the underlying signal already jitters run to run, a sharp cutoff turns that
jitter into a coin flip that decides your leaderboard row.

The part that should bother anyone shipping evals: the grader itself is a
source of variance. LLM-judge disagreement flips a meaningful fraction of these
official results on re-grade. If your headline metric can change because the
judge sampled differently, the metric isn't measuring the model — it's
measuring the judge's mood. Reporting 25.0% vs 24.4% as if the gap means
something is the tell that nobody computed a confidence interval.

None of this is exotic. It's the same hygiene we owe any eval harness: run each
condition multiple times, report spread instead of a point estimate, and avoid
manufacturing discontinuities out of scores that were continuous for a reason.
The winter-tire and napkin-math examples in the post make the same point from
outside AI — a benchmark is a measurement, and a measurement without an error
bar is an anecdote with a decimal point. The [HN
discussion](https://news.ycombinator.com/item?id=49655621) has good war stories
from people who've watched a single-seed eval greenlight the wrong model.

Here's the uncomfortable question for anyone with an internal leaderboard: if
you re-ran your eval three more times tonight, how many of your "wins" would
survive?
