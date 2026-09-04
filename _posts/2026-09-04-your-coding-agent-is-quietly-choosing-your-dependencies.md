---
layout: post
title: "Your Coding Agent Is Quietly Choosing Your Dependencies"
date: 2026-09-04 03:03:33 +0000
categories: [agentic-ai, llm-ops, industry]
source: hn
source_id: "49557206"
discussion_url: https://news.ycombinator.com/item?id=49557206
source_url: https://armature.tech/blog/which-tools-coding-agents-install
---

When you hand a task to a coding agent, you're not just delegating code — you're delegating procurement. [Armature measured 16,893 sessions](https://armature.tech/blog/which-tools-coding-agents-install) across Claude Code, Codex, and Cursor and found the three pick the *same* tool only 42% of the time. That 58% disagreement is the number I'd want on a dashboard before I let an agent scaffold anything that ships.

The finding that reframes it for me: mention isn't selection. PayPal got cited 139 times and chosen zero. LangChain drew 194 mentions and four actual picks. So the model's chatter about a dependency tells you almost nothing about what it will wire in — and what it wires in tracks vendor presentation and feature bundling more than technical merit. Neon took 66% of database picks; Stripe won 9 of 10 payment tasks; Resend and SendGrid flipped purely on whether the repo was TypeScript or Python.

The three agents also research differently, which is the real tell. Codex web-searched in 94% of sessions, Cursor in two-thirds, while Claude Code leaned on training data (~30% searches) and built in-house nearly twice as often (19% vs 10%). Same prompt, three different supply chains — and whichever one your team standardizes on silently biases every dependency that lands in your repos.

- 🎯 **Treat agent tool choice as a governed decision** — an allowlist and a review gate, not an emergent behavior
- 🔍 **Log what the agent installs**, not just what it says; the mention-vs-selection gap is real
- ⚠️ **Repo context leaks into the pick** — language and existing deps steer the vendor more than merit does

Armature published the full per-category leaderboards and the raw session traces, and the [HN thread](https://news.ycombinator.com/item?id=49557206) is where people stress-test the methodology against their own stacks.

If an agent picked your database and payment provider this quarter, would anything in your pipeline have flagged it before it merged?
