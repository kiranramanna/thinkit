---
layout: post
title: "Your Coding Agent's Harness Is a Systems Problem"
date: 2026-09-18 14:04:46 +0000
categories: [agentic-ai, llm-ops, research]
source: hn
source_id: "49753878"
discussion_url: https://news.ycombinator.com/item?id=49753878
source_url: https://arxiv.org/abs/2609.20804
---

The useful takeaway from [this empirical study of coding-agent harnesses](https://arxiv.org/abs/2609.20804) is that there's no single good harness. Planning, action space, and context management each pay off differently depending on which model you're driving and the token budget you're driving it under. That's an inconvenient result if you've been treating your harness as a platform you build once and reuse across every model.

A few findings that map straight onto how I think about running agents in production:

- 🎯 **Context management earns its keep by preventing context-overflow failures**, and it matters more as the window tightens — not because it makes the agent smarter.
- ⚡ **Rule-based elision before LLM summarization** is the strongest efficiency play; making elided content recoverable adds machinery models rarely touch and buys no accuracy.
- 💡 **Planning flips roles with model strength** — an accuracy scaffold for weaker models, a cost saver for stronger ones. Same knob, opposite job.
- 🔍 **Bash-capable models run fine on a bash-only interface** and cost far less; predefined tool schemas mainly rescue models with weak bash proficiency.
- 📊 **176 matched settings across SWE-Bench Verified and Terminal-Bench 2.1** — enough ablation to trust the pattern instead of one leaderboard number.

That fourth point is the uncomfortable one for anyone who spent months curating a tool catalog: if your model is strong enough, a chunk of that orchestration is cost you're paying for no accuracy. The [HN discussion](https://news.ycombinator.com/item?id=49753878) is already arguing whether the context-management gains are a design effect or just more token spend — the right thing to check before you copy any of these defaults into your own framework.

So how much of your agent scaffolding is genuinely buying accuracy, and how much is expensive habit your current model has already outgrown?
