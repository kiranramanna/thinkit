---
layout: post
title: "When Blaming the AI Needs a Permutation Test"
date: 2026-06-06 14:08:22 +0000
categories: [llm-ops, industry, research]
hn_id: 48411635
hn_url: https://news.ycombinator.com/item?id=48411635
source_url: https://alexispurslane.github.io/rsync-analysis/
---

A regression in [rsync got blamed on Claude](https://alexispurslane.github.io/rsync-analysis/), and the internet did what it does: a spurious correlation from one upgrade, a screenshot reposted into a GitHub issue with no bug report, and a thread that escalated from argument to harassment. What it didn't produce was a number.

Someone finally ran the test. The method is the part worth copying: severity-weighted bugs per 10 commits, then an exact permutation test asking how likely the historical release distribution is to produce releases as bad as the AI-assisted ones. That's the right shape for this question. With only a handful of post-change releases, a regression model would drown in noise, and "bugs per line before and after" is too crude to mean anything. Asking where the recent releases fall in the historical distribution is about the most you can honestly claim from this much data.

This is the same discipline I'd want before letting any AI-assisted change pipeline into production: you don't get to assert quality went up or down without a baseline distribution and a test that accounts for sample size. "It feels buggier since they started using an LLM" is a hypothesis, not a finding — and the [HN discussion](https://news.ycombinator.com/item?id=48411635) is a good catalog of how rarely people separate the two.

The irony is that the analysis itself leaned on an LLM to write its data-pipeline scripts, with the statistics and methodology chosen by a human. That's roughly the division of labor that actually works: humans own the question and the eval design, models do the mechanical assembly. If you want to know whether AI made your codebase worse, the answer isn't a social-media thread — it's a reproducible pipeline and a p-value. Why is that still the rare response instead of the default?
