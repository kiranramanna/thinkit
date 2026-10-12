---
layout: post
title: "Make the Harness Decide What Each Agent Sees"
date: 2026-10-12 14:09:13 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.07625"
discussion_url: https://huggingface.co/papers/2610.07625
source_url: https://arxiv.org/abs/2610.07625
---

Most long-horizon agent setups I've run fail the same way: the conversation becomes the database. Every tool result, every dead end, every retry gets appended to one growing history, and by hour three the agent is paying to re-read its own mistakes while a parallel worker quietly redoes something another already finished. More inference stops buying more progress.

[Stateless Language Agents](https://arxiv.org/abs/2610.07625) move the state out of the chat entirely. The harness owns the research state — candidate solutions and their measured outcomes — and reconstructs a fresh, role-specific context for every invocation. No agent carries its conversation across calls. A stateless Advisor reads harness-summarized evidence across search directions and assigns concrete experiments to parallel Workers, so what each agent sees becomes an explicit design choice instead of an accident of history. The result that caught me: it matches the strongest kernel-optimization baseline's final score with over 84% fewer tokens, and the Advisor doing all the routing spends under 0.6% of the budget.

This is the orchestration pattern I keep rebuilding by hand — a controller that decides what to try next and workers that run with exactly the context they need, nothing more. The part worth sitting with is their warning about evaluation. They ran budgets up to a billion tokens and found that short horizons misjudge which components actually help; effects that look flat early compound over a full run. Most agent evals I trust top out far below that, which means a system you benchmarked as "better" might just be better at not collapsing yet. The [HF paper page](https://huggingface.co/papers/2610.07625) is where I'd watch for whether this holds outside software engineering, kernels, and algorithm design. If your agent's state lives in its conversation, is your benchmark even long enough to show where that breaks?
