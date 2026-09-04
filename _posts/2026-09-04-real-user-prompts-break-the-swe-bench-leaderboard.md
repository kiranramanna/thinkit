---
layout: post
title: "Real User Prompts Break the SWE-Bench Leaderboard"
date: 2026-09-04 03:03:33 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.27831"
discussion_url: https://huggingface.co/papers/2608.27831
source_url: https://arxiv.org/abs/2608.27831
---

Every coding-agent leaderboard I've looked at was built on SWE-bench-style prompts: long, formal, information-rich problem statements distilled from curated GitHub issues. [RealSWE](https://arxiv.org/abs/2608.27831) points out how little that resembles what users actually type — and then shows the gap is wide enough to reorder the ranking.

The measurement I care about is the distribution mismatch. Problem-statement-only requests are 88% of real prompts but 7% of benchmark problems; 87% of real prompts are casually written while 94% of benchmark problems are formal. When the authors rebuild 381 task families from SWE-bench Verified and Pro to match the real distribution — same underlying task and gold patch, only the information composition and style vary — resolution rates fall 6.4 points on average and, more tellingly, model rankings change. If you picked your agent because it topped a formal benchmark, that ranking may be an artifact of prompt shape.

The actionable part is sharper than the headline. Two information categories carry the signal: stating the Desired Behavior and the Motivation. Environment Information and Reproduction Steps — the fields we habitually pad issue templates with — mostly add tokens without measurable benefit, and linguistic style barely registers. So the lever isn't a fancier model; it's getting the intent stated, and 88% of real prompts arrive without it.

- 🎯 **Eval on prompt shape, not just tasks** — hold the gold patch fixed and vary information composition, the way RealSWE does
- 💡 **Coach for Desired Behavior + Motivation** — in the UI, or in an agent pre-step that asks when they're missing
- ⚠️ **Stop treating Reproduction Steps as signal** — they inflate the prompt without moving resolution

The [HF paper page](https://huggingface.co/papers/2608.27831) has the taxonomy and the per-category ablations, which is what you'd need to run this shape of eval against your own harness.

If your agent's benchmark rank was set on formal prompts your users never write, how confident are you it holds on the casual one-liners they actually send?
