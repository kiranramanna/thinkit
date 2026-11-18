---
layout: post
title: "There Is No Best Agent Harness, Only the Right Pairing"
date: 2026-11-18 14:06:47 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
source: hn
source_id: "50532191"
discussion_url: https://news.ycombinator.com/item?id=50532191
source_url: https://runta.com/blog/introducing-frontierharness-eval-v1-1/
---

The interesting result in [FrontierHarness Eval v1.1](https://runta.com/blog/introducing-frontierharness-eval-v1-1/) isn't that your agent harness matters — it's how little it matters on its own once you widen the model set. Twenty-two harness configurations, five open models, 62 terminal tasks, 27,280 runs, and the model explains about 93% of the variance in cost per task. The harness alone accounts for roughly 2%. The harness-model pairing is where the other ~5% lives, and that pairing is the only part you can actually engineer around.

That reframes the "just pick the best agent harness" advice I keep hearing. The lever is real but local: with the model fixed, the priciest harness still costs 1.8x to 5x more per task than the cheapest. Codex CLI ranked 1st paired with GLM-5.3 and 16th with Kimi-K3, and every model landed on a different best-value harness. Cost per pass barely tracked pass rate — rank correlation ran from -0.39 to +0.22 — so the expensive harness is not quietly buying you correctness.

For anyone operating an eval harness in production, the operational read is blunt: you cannot inherit someone else's leaderboard. Best-value is a per-model, per-workload measurement, and defaults leak money — 64.5% of spend in the scored runs went to trials that never passed, and 216 were flagged for reward hacking. If your eval doesn't price cost-per-*passed*-task on your own tasks, you are tuning a number that won't survive the next model swap. The [HN discussion](https://news.ycombinator.com/item?id=50532191) argues about exactly this: whether harness rankings generalize at all, or expire the moment the model underneath them changes.

The wider reaction has mostly latched onto the cost-swing headline rather than the pairing nuance. [Enterprise DNA](https://enterprisedna.co/resources/ai-pulse/ai-pulse-2026-09-02-harness-choice-swings-agent-cost-17-5x-on-the-same-task) reads the same-model cost gap as a clean business signal, careful to add it is "not a final verdict on any tool." [Developers Digest](https://www.developersdigest.tech/blog/coding-agent-harness-benchmark-cost-per-pass-frontierharness-2026) credits the harness-over-pass-rate finding but flags small and dated task sets. [Starlog](https://starlog.is/articles/ai-agents/frontier-harness-eval-eval) goes further — praising the deterministic verifiers and golden checkpoints while picking apart the single-model setup and opaque cost normalization, the very limits this v1.1 run widened to five models to address. The trend forming across all three is the same one I'd bet on: the harness is becoming something you eval against your own workload, not something you pick off a list.
