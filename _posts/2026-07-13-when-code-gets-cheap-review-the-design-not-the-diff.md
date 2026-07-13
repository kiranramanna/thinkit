---
layout: post
title: "When Code Gets Cheap, Review the Design Not the Diff"
date: 2026-07-13 14:08:00 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48891184
hn_url: https://news.ycombinator.com/item?id=48891184
source_url: https://antirez.com/news/169
---

antirez's [latest post](https://antirez.com/news/169) names something most teams shipping agents already feel but haven't said out loud: when an LLM produces 5k lines in an afternoon, line-by-line review stops being the job. His framing — control the ideas, not the code — is the right altitude. You steer the design; the generated code is a lower-level output you sample, not a manuscript you proofread.

That maps cleanly onto how agentic systems actually get built in production. The leverage isn't in reading every diff a coding agent emits — it's in the harness around it: the spec you hand it, the invariants your tests encode, the eval that tells you whether the design survived contact with the code. When I catch myself scanning function by function, it usually means the design was underspecified and I'm doing QA that the eval should have done. antirez's observation that LLMs are locally excellent but weaker on the big picture is exactly why this bites — they'll write clean code for the wrong architecture all day.

The uncomfortable part is what this does to how we judge engineers. If "I read all the code" stops being a proxy for rigor, the replacement has to be design clarity plus the strength of your verification loop: can you state the idea precisely, and can you show the generated code honors it without reading all of it? That's harder to interview for than spotting a bug on line 200. The [HN thread](https://news.ycombinator.com/item?id=48891184) splits along this same fault line, with plenty of people insisting the code *is* the design.

So here's the question I keep landing on: if you no longer read every line your agent writes, what's the artifact you *do* read — and is your eval actually good enough to trust it?
