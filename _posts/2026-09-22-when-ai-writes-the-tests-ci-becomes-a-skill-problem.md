---
layout: post
title: "When AI Writes the Tests, CI Becomes a Skill Problem"
date: 2026-09-22 03:03:16 +0000
categories: [llm-ops, ai-infrastructure, industry]
source: hn
source_id: "49792067"
discussion_url: https://news.ycombinator.com/item?id=49792067
source_url: https://linear.app/now/ci-bottleneck-reworked
---

The line worth internalizing from [Linear's CI writeup](https://linear.app/now/ci-bottleneck-reworked) is one they don't quite say outright: AI coding tools almost never remove a bottleneck, they relocate it. Code generation got cheap, so the constraint slid downstream — straight into the validation machinery that has to prove all that generated code actually works.

The numbers make the squeeze concrete. Their test suite nearly quadrupled this year, with agents now writing most of the tests, and yet they pulled PR wait time from over six minutes down to just over five. That gap is all engineering: moving off GitHub Actions to faster runners, swapping in the `tsgo` native TypeScript compiler, dropping type-aware linting, and batching seven independent checks into two — the batching alone clawed back around 87,000 runner-minutes a month, nearly 12% of their CI bill. None of it is glamorous; all of it is the kind of work that only pays off once you're measuring runner-minutes like a budget.

The move I'd flag for anyone running coding agents in production is buried near the end: they updated their internal agent skills so AI-written tests follow the new CI performance constraints by default. That's the real shift. Once the agent is the one authoring tests, CI throughput stops being purely an infra problem and becomes a prompt-and-skill problem — you fix the pipeline once, then you have to teach the thing generating the load to respect it. The [HN discussion](https://news.ycombinator.com/item?id=49792067) splits between "just pay for faster runners" and teams already living this. My bet: within a year, "does your coding agent know your CI budget?" is a normal code-review question.
