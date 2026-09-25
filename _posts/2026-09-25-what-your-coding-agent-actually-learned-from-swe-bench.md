---
layout: post
title: "What Your Coding Agent Actually Learned from SWE-Bench"
date: 2026-09-25 03:08:10 +0000
categories: [llm-ops, agentic-ai, research]
source: hf-papers
source_id: "2609.27891"
discussion_url: https://huggingface.co/papers/2609.27891
source_url: https://arxiv.org/abs/2609.27891
---

Every coding-agent leaderboard has the same quiet problem: the test repositories are famous open-source projects that were almost certainly in the training data. So when an agent resolves a SWE-bench task, you can't cleanly tell whether it reasoned about the repository or just recognized it.

[SchrodingerRepo](https://arxiv.org/abs/2609.27891) attacks this by treating the test repo as a latent variable that only gets instantiated when the agent walks into the environment. It keeps executable behavior and the test-defined correctness identical, then erodes the memorized surface through four transformations: rewriting the problem statement, remapping namespaces, reordering intra-file layout, and functionality-preserving code rewrites. Same bug, same fix, unfamiliar clothes.

The result is the part that should bother anyone running an eval harness: strip the familiar cues and agent performance consistently drops while interaction cost climbs. And the extra cost isn't in making the fix — it's in exploration and localization. The agents were leaning on remembered file layouts and naming conventions to find where to work, not deriving it. That's a measurement bug, not just a model weakness: a chunk of your headline pass-rate is repository recognition wearing the costume of reasoning.

This maps onto how I think about eval harnesses at work. A benchmark number is only load-bearing if the thing it measures survives contact with a repo the model has never seen — which is the actual production case. Static benchmarks decay the instant they get popular enough to matter, because popularity is exactly what feeds them into the next pretraining run. A dynamically instantiated eval costs more to run, but it measures the capability you actually ship.

The [HF paper page](https://huggingface.co/papers/2609.27891) has the per-level transformation breakdowns, worth reading before you trust your own coding-agent scoreboard. If a functionality-preserving rewrite is enough to knock several points off a frontier agent, how much of every SWE-bench leaderboard is scoring memory instead of skill?
