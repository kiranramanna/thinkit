---
layout: post
title:  "The Best Use of AI Coding Tools Is Slowing Down"
date:   2026-05-25 23:42:00 +0000
categories: [agentic-ai, llm-ops, industry]
hn_id: 48272984
hn_url: https://news.ycombinator.com/item?id=48272984
source_url: https://nolanlawson.com/2026/05/25/using-ai-to-write-better-code-more-slowly/
---
**The Best Use of AI Coding Tools Is Slowing Down**

Most of the AI-coding discourse is about velocity — ship more, faster. Nolan Lawson's [post on writing better code more slowly](https://nolanlawson.com/2026/05/25/using-ai-to-write-better-code-more-slowly/) argues the opposite, and it lines up with how I've come to trust these tools: point them at quality, not throughput.

His workflow is essentially a multi-model review harness. Run several models (Claude, Codex, Cursor Bugbot) over the same pull request, have each flag bugs by severity, then a synthesizer agent collates findings to knock down false positives before a human prioritizes. Fix critical and high first, skip the edge cases where the juice isn't worth the squeeze, and abandon the PR entirely if the review surfaces a fundamentally broken design.

What I like is that it treats disagreement between models as signal. Years ago I built an internal NLU workbench that did multi-model batch testing and cross-model conflict review — the cases where models *disagreed* were almost always where the interesting bugs lived. The same property holds for code review agents: consensus is boring, divergence is a lead.

- 🔍 **Models are better at finding bugs than fixing them** — the hard part is validation and ranking, which is a human-in-the-loop eval problem.
- ⚠️ **A flagged bug is a hypothesis**, not a verdict — the synthesizer step exists because raw model output is noisy.
- 💡 **Review becomes a side quest** into how the system actually fails, which is where real codebase understanding comes from.

This is the "slop cannon" antidote: instead of generating more code to review, you spend the model budget reviewing the code you already have. The [HN discussion](https://news.ycombinator.com/item?id=48272984) splits on whether this actually scales past small teams. I think it does — but only if you treat the review output as an eval pipeline with precision/recall you measure, not a magic oracle. Are you measuring your review agents' false-positive rate, or just reading their output?
