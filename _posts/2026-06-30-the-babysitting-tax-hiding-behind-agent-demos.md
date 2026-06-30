---
layout: post
title: "The Babysitting Tax Hiding Behind Agent Demos"
date: 2026-06-30 14:08:04 +0000
categories: [agentic-ai, llm-ops, enterprise-ai]
hn_id: 48679762
hn_url: https://news.ycombinator.com/item?id=48679762
source_url: https://twoheads.net/the-promise-is-unattended-work/
---

The pitch sells the setup. The bill arrives after.

[Two Heads' post on unattended work](https://twoheads.net/the-promise-is-unattended-work/) names something I watch teams relearn every quarter: an agent demo runs on a curated happy path, and production is where missing data, stale records, broken integrations, and instructions nobody wrote down all show up at once. The demo was the cheap part.

What the post calls babysitting, I'd call the actual operating cost. An agent that's confidently wrong needs the same things any production service needs — monitoring, logs, fallbacks, scoped permissions, and an owner who understands both the business logic and the failure modes. Skip that and you don't get unattended work. You get a second system running next to the manual process people still don't trust, and a team busy tuning prompts instead of shipping outcomes. Activity, not value.

The line that lands hardest: AI doesn't remove the need for software judgment, it makes that judgment more important. An agentic workflow is still software. It drifts, it leans on APIs that change, it produces wrong output with high confidence. The eval harness, the retry-and-fallback policy, the human-in-the-loop checkpoint for the confident-but-wrong case — that isn't overhead bolted onto the magic. That is the product.

The [HN thread](https://news.ycombinator.com/item?id=48679762) splits along a familiar line: people who've operated these systems nodding, people who've only demoed them pushing back. That gap is the whole story.

So here's the question I'd put to any agent vendor before signing: who owns this when it's confidently wrong at 2am, and what does it do instead of guessing?
