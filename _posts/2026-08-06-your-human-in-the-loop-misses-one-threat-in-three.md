---
layout: post
title: "Your Human-in-the-Loop Misses One Threat in Three"
date: 2026-08-06 14:06:17 +0000
categories: [llm-ops, agentic-ai, enterprise-ai]
hn_id: 49195468
hn_url: https://news.ycombinator.com/item?id=49195468
source_url: https://scalex.dev/blog/ai-agent-permissions-stats/
---

We keep calling the human approval prompt the last line of defense against a rogue agent. [Scale X's data from 40,000 runs](https://scalex.dev/blog/ai-agent-permissions-stats/) of a browser game — where you play the human approving an AI coding agent's commands under time pressure — suggests it's a thin line. Mean accuracy was 66.3%. The reviewer missed roughly one threat in three.

The miss-rate breakdown is the useful part, because it tracks how *obvious* the damage is, not how *dangerous* it is:

- 🟢 **Obvious destructive** (`rm -rf /`, `chmod -R 777 /`) — only 11.7% missed
- 🟠 **Persistent mutation** (crontab injection, `git config` hijack) — 23.8% missed
- 🔴 **Exfiltration / code execution** (curl to unknown APIs, typosquatted packages) — 33.4% missed
- 🔴 **Scope violations** (`cat ~/.aws/credentials`) — highest miss category
- ⚠️ **7% of players approved every single prompt** — the `--dangerously-skip-permissions` crowd, live

The quiet exfil and credential reads — the ones that actually end incidents — are exactly where human attention falls off. And this was a *game* where 34% of commands were threats and players knew they were being tested. In production the base rate is a fraction of that, which makes vigilance worse, not better: approval fatigue sets in fast when 99 of 100 commands are benign.

The operational takeaway for anyone shipping agents: human-in-the-loop is a backstop, not a control. Allowlists, static command classification, and scoped credentials have to catch the exfiltration and scope-violation classes *before* the human ever sees them. The [HN discussion](https://news.ycombinator.com/item?id=49195468) has the usual split between "just read every command" and people who've felt the fatigue firsthand.

If a click-through approval catches two threats in three, is it a guardrail or a liability-shifting UI?
