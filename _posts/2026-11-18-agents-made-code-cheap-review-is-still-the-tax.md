---
layout: post
title: "Agents Made Code Cheap; Review Is Still the Tax"
date: 2026-11-18 03:05:05 +0000
categories: [agentic-ai, llm-ops, industry]
source: hn
source_id: "50538303"
discussion_url: https://news.ycombinator.com/item?id=50538303
source_url: https://complexdiscovery.com/harvard-researchers-find-ai-coding-agents-shifted-the-bottleneck-to-code-review/
---

Anyone who has shipped agents into a real engineering org already suspected this, but it helps to see it measured. A Harvard working paper, summarized in [this writeup](https://complexdiscovery.com/harvard-researchers-find-ai-coding-agents-shifted-the-bottleneck-to-code-review/), tracked 718 firms and found that teams adopting AI coding agents wrote about 30% more code — plus 20% more commits and 23% more pull requests — while finished work stayed statistically flat. Resolved issues moved 0.12 per worker-month against a 3.67 baseline. That's noise wearing a trend's clothing.

The cost didn't vanish; it relocated. Time from pull request to merge rose 49%, review comments per PR climbed, and more engineers got pulled onto review duty. Generation got cheap and judgment didn't, so the queue simply moved to the one step agents don't shorten: a human deciding whether the diff is correct, safe, and worth merging.

This is why I keep calling agent rollouts an evaluation problem wearing a productivity costume. If your dashboard counts lines, commits, or PRs opened, an agent will cheerfully inflate every one of those while shipping the same amount of working software. The number that survives contact with reality is merged-and-reviewed throughput, and the cycle time around review — which is exactly what got worse. The [HN discussion](https://news.ycombinator.com/item?id=50538303) splits along familiar lines: people who say review was always the real constraint, and people betting that stronger agent self-verification eventually closes the gap.

That split shows up across the coverage too. [Forkast](https://forkast.news/ai-coding-agents-write-30-more-code-and-resolve-zero-additional-issues-harvard-study-finds) reads the study as exposing a code-volume "measurement trap." [Jellyfish](https://jellyfish.co/?p=31446), whose data the paper leans on, lands softer — real speed gains, but business impact only if you deliberately hunt the review bottleneck. [Let's Data Science](https://letsdatascience.com/news/harvard-study-finds-ai-coding-agents-raise-code-volume-not-o-ea78729b) stays even-handed, flagging the observational design before anyone over-reads it. The consensus forming isn't "agents don't work" — it's that we've been watching the wrong end of the pipe, and the field is slowly agreeing the number that matters now is review cycle time.
