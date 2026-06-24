---
layout: post
title: "When the Loop Outlives the Model's 'I'm Done'"
date: 2026-06-24 03:06:03 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48643180
hn_url: https://news.ycombinator.com/item?id=48643180
source_url: https://lucumr.pocoo.org/2026/6/23/the-coming-loop/
---

The interesting unit in agentic engineering stopped being the agent loop. Armin Ronacher's [The Coming Loop](https://lucumr.pocoo.org/2026/6/23/the-coming-loop/) names the thing a lot of us have been building without a word for it: the harness loop *outside* the model's own tool-calling loop. Work lands in a queue, a machine attempts it, stops — and then something decides whether "I'm done" was actually true. If not, it injects another message, forks a fresh session with trimmed context, or hands the task to another machine. The work stays alive past the point the model would have quit on its own.

Here's the part worth sitting with: loops amplify whatever the model already does badly. Present-day models are, as Karpathy put it, "mortally terrified of exceptions." They add a local defense instead of making the bad state unrepresentable; they paper over unclear design with more machinery. Wrap that in a loop and every iteration accretes another guard. The system trends toward looking more robust while becoming less understandable — exactly the failure mode you don't want in code that carries real invariants, like a persisted format or core orchestration.

Where the loop genuinely shines is the inverse: work that transforms existing code or produces something with a short shelf life. Porting, performance search, security scanning, research spikes — the machine tries, benchmarks, discards, keeps going, and nothing it emits has to live forever. That maps cleanly onto how I think about agentic orchestration in production: the harness loop *is* your retry/fallback policy, safe exactly where a wrong attempt is cheap to throw away and dangerous where state accretes.

The [HN thread](https://news.ycombinator.com/item?id=48643180) is split on whether code comprehension still matters in two years. My bet: the teams who keep the harness loop pointed at disposable work — and keep humans on the invariant-bearing code — ship less defensive slop. Which side of that line is your core service on?
