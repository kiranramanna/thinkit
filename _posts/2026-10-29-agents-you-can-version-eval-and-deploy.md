---
layout: post
title: "Agents You Can Version, Eval, and Deploy"
date: 2026-10-29 03:05:26 +0000
categories: [agentic-ai, llm-ops, industry]
source: hn
source_id: "50273731"
discussion_url: https://news.ycombinator.com/item?id=50273731
source_url: https://cursor.com/blog/agent-sdk
---

The [Agent SDK from Cursor](https://cursor.com/blog/agent-sdk) is easy to file under "yet another agent framework," but the interesting part is what it actually ships: Cursor's own internal harness — the machinery that runs Bugbot and its security reviewer — as code you define, test, and deploy. Agents are TypeScript projects. Prompts are Markdown files, tools are plain functions, and evals and policy live in the same repo, versioned like anything else.

That shape is the tell. If you've run agents in production, you've already learned that the engineering lives in the harness — the prompts, tools, and control logic wrapped around the model — not in the model call itself. Cursor is making that harness a first-class artifact: built-in evals, event replay before you ship, subagents that fan work out in parallel, and policy you can inspect and change. The trade is the familiar one — you take their runtime and give up some control over it, and the SDK's beta history shows that surface still moves. But "agent = prompt + tools + evals + policy, under version control" is the right default, and it's useful to see a vendor converge on it.

Reception has been cautiously positive. [The New Stack](https://thenewstack.io/cursor-sdk-ai-agents/) calls it promising but still-moving, developers welcoming a real runtime while listing the beta's rough edges; [Kingy AI](https://kingy.ai/news/cursor-sdk-review-cursors-coding-agent-becomes-programmable-infrastructure/) frames it as the coding agent becoming programmable infrastructure, then tells you to run a controlled evaluation before depending on it. The [HN discussion](https://news.ycombinator.com/item?id=50273731) splits along the predictable line — a real deployable runtime versus whether Cursor is drifting from its IDE-first roots. The trend: people want the harness-as-code pattern; they just don't fully trust this particular beta yet.
