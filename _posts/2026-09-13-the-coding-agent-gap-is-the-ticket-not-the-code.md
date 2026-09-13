---
layout: post
title: "The Coding-Agent Gap Is the Ticket, Not the Code"
date: 2026-09-13 03:04:21 +0000
categories: [agentic-ai, enterprise-ai, llm-ops]
source: hn
source_id: "49676820"
discussion_url: https://news.ycombinator.com/item?id=49676820
source_url: https://withspecific.com/benchmarks/real-swe
---

Real-SWE ([benchmark page](https://withspecific.com/benchmarks/real-swe)) does the one thing public coding benchmarks structurally can't: it runs agents against private production codebases whose code and fixes were never on the internet to train on. The leaderboard is sobering, but the failure mode is the real story.

- 🎯 **The gap isn't code generation** — the most common failure across every model is "missed requirements," not broken syntax. Agents write plausible code for the wrong task.
- 📊 **Contamination-free changes the numbers**: top scores are Fable 5.1 at 38.8%, GPT-6 Astra at 33.8%, Gemini 3.8 Flash at 31.2% (pass@1 over eight trials) — nowhere near the inflated 60–70% you see on public sets.
- 🔍 **Underspecified tickets are the point**: instructions run a median 1,742 characters and reference fixes touch ~11 files across services. This is requirements discovery, not a self-contained puzzle prompt.
- ⚠️ **Business-consequence tasks** — billing, tax calculation, customer migration — are where "looks right" and "is right" diverge hardest, and where a confident wrong answer costs the most.
- 💡 **This is a retrieval and context problem** as much as a model problem: the agent that wins is the one that assembles the right slice of a proprietary codebase before it edits — the same context-engineering discipline production RAG lives on.
- ✅ **Six of ten analyzed tasks landed under 15%** resolution, a blunt reminder of how much enterprise work still needs a human closing the loop.

The [HN discussion](https://news.ycombinator.com/item?id=49676820) is worth a read, though the obvious critique — can 18 codebases generalize? — matters less than the failure mode, which won't move much with sample size. My bet: the next leap in enterprise coding agents comes from better context assembly over private repos, not bigger models. Which will your team invest in first?
