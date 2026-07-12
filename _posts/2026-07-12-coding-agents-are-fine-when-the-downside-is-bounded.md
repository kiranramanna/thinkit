---
layout: post
title: "Coding Agents Are Fine When the Downside Is Bounded"
date: 2026-07-12 14:06:18 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48880170
hn_url: https://news.ycombinator.com/item?id=48880170
source_url: https://terrytao.wordpress.com/2026/07/11/old-and-new-apps-via-modern-coding-agents/
---

The headline from [Terry Tao's write-up on porting old apps with coding agents](https://terrytao.wordpress.com/2026/07/11/old-and-new-apps-via-modern-coding-agents/) is that an agent moved two dozen Java 1.0 applets to JavaScript in an afternoon. The part worth keeping is the risk calculus he uses to decide the exercise is worth doing at all.

His framing is that these applets are secondary visual aids, not critical components, so the downside risk stays acceptable. That single sentence is the whole engineering decision. A subtle bug in a Minkowski-space diagram means a reader drags outside the box and sees something weird. The same class of agent, pointed at a retrieval layer that silently drops documents, is an incident with a postmortem. Identical tool, wildly different blast radius.

What I found honest is that he didn't claim the agent was clean. It introduced one minor bug and, in the process, surfaced two real bugs in his original code — his words, "a net wash." That is the correct way to score an agent: not against perfection, but against the human baseline that also ships defects. Most teams skip this comparison and then act surprised that a diffusion of small errors shows up.

This is exactly the line I draw in production AI work. The question is almost never "can the agent write this?" It's "what happens when it writes it wrong, and who notices before a user does?" Agents belong wherever the failure mode is visible and cheap to revert — visualizations, migrations, throwaway tooling — and stay gated wherever failure is silent and expensive.

The [HN thread](https://news.ycombinator.com/item?id=48880170) has the usual "but will it scale to real systems" pushback. Wrong axis. Where would you let an agent ship unreviewed today, and what property of that surface makes the downside bounded?
