---
layout: post
title: "Your LLM Grader Is Reliable Until You Ask It to Judge"
date: 2026-06-29 14:07:49 +0000
categories: [llm-ops, research, enterprise-ai]
hn_id: 48713832
hn_url: https://news.ycombinator.com/item?id=48713832
source_url: https://danunparsed.com/p/hackerrank-open-source-ats
---

The fun detail in [Dan Kinsky's teardown of HackerRank's open-sourced ATS](https://danunparsed.com/p/hackerrank-open-source-ats) isn't that the same resume scored 90, then 74, then 88. It's *where* the variance lived. He looped the scorer 100 times against one unchanged PDF and got a spread of 66 to 99 — at temperature 0.1, the setting that's supposed to pin the model down. If your cutoff is 85, that candidate fails roughly two runs in three on identical input.

But split the rubric and the story sharpens. Technical skills — a checklist of "do you know React or not" — landed 8/10 in 98 of 100 runs. Rock solid. The projects category, where the model has to form an actual opinion about quality, swung wildly. That's the line every eval harness lives on: extraction is stable, judgment is not. An LLM matching a candidate against a skills list is doing retrieval. An LLM deciding whether your side project is "impressive" is sampling from a distribution and handing you one draw as if it were a measurement.

This is the whole argument for treating LLM-as-judge as a measurement instrument, not an oracle. A single scalar score on a subjective axis is noise wearing a number's clothes. The mitigations are unglamorous: constrain the judge to verifiable sub-criteria, run it N times and report the distribution instead of the point estimate, and reserve the model's "taste" for ranking pairs rather than emitting absolute grades. I've watched scoring pipelines pass internal review on a single golden run and then drift the moment they hit real traffic — same failure mode, higher stakes than a resume.

The [HN thread](https://news.ycombinator.com/item?id=48713832) has people noting the obvious next move: ship the variance, not the mean. If you can't show me the standard deviation of your grader, why should I believe the score?
