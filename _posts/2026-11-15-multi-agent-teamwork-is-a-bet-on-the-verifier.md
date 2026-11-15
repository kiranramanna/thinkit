---
layout: post
title: "Multi-Agent Teamwork Is a Bet on the Verifier"
date: 2026-11-15 03:05:04 +0000
categories: [agentic-ai, llm-ops, industry]
source: hn
source_id: "50496811"
discussion_url: https://news.ycombinator.com/item?id=50496811
source_url: https://research.google/blog/advancing-science-engineering-with-antigravitys-teamwork-feature/
---

Google's pitch for [Antigravity's /teamwork feature](https://research.google/blog/advancing-science-engineering-with-antigravitys-teamwork-feature/) is a team of Gemini agents — a lead that scopes the work, specialist workers, and auditors that check each milestone — turned loose on multi-day problems like open math conjectures and a RISC-V CPU simulator. The fan-out is the part everyone screenshots. The auditor is the part that decides whether any of it was worth running.

Look at where it reportedly shines: math problems and CPU simulators. Both come with a crisp oracle. A proof either checks or it doesn't; a simulator either passes its test suite or it doesn't. That's not a coincidence — it's the precondition. A team of agents producing ten candidate solutions an hour is only an asset if something can cheaply and correctly reject the nine that are wrong. Strip out a trustworthy verifier and parallelism just manufactures plausible-looking failures faster.

This is the same wall I watch every production agent system hit. The expensive engineering was never spawning workers; it's the eval that can score a multi-agent run end to end and the guardrails that stop a confident-but-wrong answer from shipping. The [HN discussion](https://news.ycombinator.com/item?id=50496811) keeps circling back to exactly that — teamwork makes the verification dependency louder, not optional, and the more agents you run, the more of it you've signed up for.

The wider reaction tracks that tension. [TechWyse](https://www.techwyse.com/news/ai-search/google-antigravity-teamwork-multi-agent-gemini-math-engineering) reports Google's claims of solved open math problems and a working CPU sim favorably, while flagging it's still an early research preview. [MindStudio](https://www.mindstudio.ai/blog/google-anti-gravity-teamwork-preview/) calls it a genuine time-saver — but only for tasks with checkable outputs, and notes the auditor agents need "something concrete to check against." A [hands-on reviewer](https://twcom-rr.pages.dev/blog/google-antigravity-review-i-tested-gemini-3-5-flash/) was blunter after burning through his token budget: "Fast and parallel is great. It just isn't the same thing as correct." The enthusiasm is real; so is the caveat that agent teams inherit the quality of your verifier, not the speed of your fan-out.
