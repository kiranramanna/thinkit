---
layout: post
title: "When 'Good Enough' Models Eat Most of the Work"
date: 2026-08-28 03:07:31 +0000
categories: [llm-ops, ai-infrastructure, industry]
source: hn
source_id: "49466917"
discussion_url: https://news.ycombinator.com/item?id=49466917
source_url: https://calv.info/small-models-have-arrived
---

Most of us reach for the biggest model by reflex when we're coding, which makes
it easy to miss that the small, fast tier has quietly crossed the good-enough
line. That's the real point of ["Small Models Have Arrived"](https://calv.info/small-models-have-arrived):
the interesting shift isn't a benchmark number, it's the economics underneath.

Token cost is the load-bearing constraint now. Every request in a user-facing
product carries a real inference bill, and that single fact reshapes the capital
math for anything consumer-scale — you can't run the old "get users cheap, worry
about margins later" playbook when each interaction costs money to serve. A
small model that hits ~100 tokens/sec and answers a research thread across
thousands of documents for tens of cents changes which products are even viable
to build.

The framing I keep coming back to is the split between frontier work and
good-enough work. Demand for the strongest models keeps climbing for genuinely
novel reasoning — hard science, engineering breakthroughs. But most of what
actually runs inside a company is the fast/cheap/good-enough tier: classify
this, extract that, draft the summary, route the ticket. That's exactly the
band small models now cover well. In LLM Ops terms, it means the routing default
should flip — the big model becomes the escalation path, not the baseline — and
your latency budgets and per-request SLAs suddenly have real headroom.

The [HN discussion](https://news.ycombinator.com/item?id=49466917) splits along
a predictable line: people who benchmark on frontier-hard tasks shrug, while
people shipping production workloads recognize the shift immediately.

The uncomfortable question for most teams isn't whether small models are good
enough. It's how many of your production paths have been quietly running on a
frontier model out of habit, not requirement — and what your bill looks like
once you actually check.
