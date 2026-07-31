---
layout: post
title: "The Token Case for Refactoring Agent-Written Code"
date: 2026-07-31 14:07:10 +0000
categories: [agentic-ai, llm-ops]
hn_id: 49111176
hn_url: https://news.ycombinator.com/item?id=49111176
source_url: https://martinfowler.com/articles/exploring-gen-ai/refactoring-economic-benefit.html
---

Every team shipping agent-written code is quietly accumulating a tax nobody had measured until now. In a [Thoughtworks experiment](https://martinfowler.com/articles/exploring-gen-ai/refactoring-economic-benefit.html), agents (mostly Claude Code) built a ~150k-line app and let the data access layer balloon to 17,155 lines in a single Rust file — every query re-inlining the same HTTP setup and JSON codec, no extraction, no dedup. The usual objection to that mess is human: it's unreadable. The more interesting cost is now a line item on your inference bill.

The clever part is the measurement. Because agents carry no memory between runs, you can re-run the exact same feature change against the codebase after each refactoring stage and get an untainted before/after — something you can't do with a human engineer who learns the code as they go. Extract functions, collapse the duplication, and the token cost of the next equivalent change drops measurably. Refactoring stops being a readability argument and becomes an amortization argument: spend tokens now to make future changes cheaper.

This reframes tech debt for anyone running agentic coding in production. If your agents regenerate boilerplate on every pass, your per-change token cost trends *up* as the file grows — the opposite of the compounding leverage everyone assumes they're buying. The writeup has the token-cost-per-stage curve; the [HN thread](https://news.ycombinator.com/item?id=49111176) is arguing about whether you should just instruct the agent to refactor as it goes, or gate it behind a human pass.

If an agent never learns your codebase, is "keep it clean so the next engineer understands it" still the point — or is the next engineer just another agent paying by the token?
