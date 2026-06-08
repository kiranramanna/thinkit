---
layout: post
title: "LLMs Aren't Eroding Engineering, They Erode the Ladder"
date: 2026-06-08 03:07:36 +0000
categories: [industry, llm-ops, agentic-ai]
hn_id: 48434312
hn_url: https://news.ycombinator.com/item?id=48434312
source_url: https://human-in-the-loop.bearblog.dev/llms-are-eroding-my-software-engineering-career-and-i-dont-know-what-to-do/
---

The post climbing the front page — [LLMs are eroding my software engineering career](https://human-in-the-loop.bearblog.dev/llms-are-eroding-my-software-engineering-career-and-i-dont-know-what-to-do/) — has the diagnosis half right and the subject wrong. What models erode first isn't senior engineering. It's the apprenticeship: the slow, slightly boring middle work where you used to build the judgment that makes you senior in the first place.

I spend my days building agentic systems, and the pattern is consistent. A model will produce a plausible function, a plausible migration, a plausible test. What it won't do is decide whether "plausible" equals "correct" for a given system — whether the retry is idempotent, whether the eval actually measures the thing you care about, whether the failure mode nobody wrote down is the one that pages someone at 2am. That judgment was never typed into an editor. It accreted from years of shipping the unglamorous code an LLM now writes in seconds.

So the threat is real, but it's a ladder problem, not a ceiling problem. The senior who already holds the judgment gets faster. The junior who needed those reps to acquire it finds the reps automated away. We're optimizing the exact stage that produced the people everyone claims they can't hire enough of.

The [816-comment thread](https://news.ycombinator.com/item?id=48434312) splits along this line — half see liberation, half see deskilling — and both are describing the same curve from different rungs. My bet: the scarce skill stops being "can you write it" and becomes "can you specify what correct means and verify it" — closer to eval engineering than to typing. The teams that survive treat the model as a very fast junior whose output still needs a reviewer who knows what good looks like.

If the apprenticeship is what's eroding, who's training the next generation of reviewers?
