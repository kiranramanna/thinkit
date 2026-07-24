---
layout: post
title: "Benchmarks Pass, Production Burns: The Limits of Harness Engineering"
date: 2026-07-24 03:03:18 +0000
categories: [agentic-ai, llm-ops]
hn_id: 49023019
hn_url: https://news.ycombinator.com/item?id=49023019
source_url: https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/wsff.md
---

The most useful line in Dex's [Why Software Factories Fail](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/wsff.md) reframes the whole debate: no amount of harness engineering fixes what is fundamentally a model-training problem. You can wrap a coding agent in linters, adversarial-review bots, and more loops, and still ship slop — because the model was optimized against benchmarks that don't measure the thing that breaks your codebase six months in.

That gap is where I've spent a lot of time building agentic systems in production. A model that aces a frontier coding benchmark is being graded on closed, verifiable tasks; a brownfield service is neither closed nor verifiable in the same way. The post cites a Faros AI report showing PR review quality down and incidents per PR up roughly 240% since teams adopted these tools this year — correlation, not a smoking gun, but it matches what the eval numbers quietly hide. Benchmark score and production defect rate are measuring different distributions, and only one of them pages you at 3am.

The fix isn't "hold it better" or spend more tokens. It's the old, unglamorous move the post lands on: front-load alignment. An hour of planning and architecture agreement up front cuts rework and turns a six-hour review into twenty minutes — whether a human or an agent writes the code. That's context engineering doing the work harness engineering claims to, and it's the part you can't bolt on with a plugin.

The [HN thread](https://news.ycombinator.com/item?id=49023019) has the StrongDM "dark factory" team weighing in, which is worth reading before you believe any lights-off pipeline demo. My question: if the real bottleneck is training and eval, does more loop engineering just help you generate broken code faster?
