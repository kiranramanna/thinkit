---
layout: post
title: "Agentic Rewrites Are Cheap to Run, Expensive to Ship"
date: 2026-07-27 14:04:47 +0000
categories: [agentic-ai, llm-ops, industry]
hn_id: 49067854
hn_url: https://news.ycombinator.com/item?id=49067854
source_url: https://lockwood.dev/ai/2026/07/27/how-is-the-bun-rewrite-in-rust-going.html
---

The $165,000 headline for rewriting Bun in Rust is the generation bill, not the cost of the rewrite. That distinction is the entire story, and Tom Lockwood's [teardown of the numbers](https://lockwood.dev/ai/2026/07/27/how-is-the-bun-rewrite-in-rust-going.html) backs it with receipts — he cloned the repo, read the tags, and counted the queue.

Six weeks after the rewrite reportedly merged to main, there's still no release tag — the longest gap in Bun's release history since 2022. Open PRs from the automated bot account climbed from roughly 1,277 to 2,475 in eighteen days, and pushing each one through CI runs 40 minutes to an hour and a half. Run that math and the build pipeline alone would need about 86 days going continuously just to drain the backlog. None of that lands on the token invoice.

In production, generation is the cheap part — that's the pattern I keep seeing. The expensive parts — review, integration, CI/CD spend, the engineers still babysitting a merge queue — live off the token bill and never make the announcement. "Merged to main" is a generation milestone, not a delivery one. When an agent opens PRs faster than a build cluster can verify them, the bottleneck has moved from writing code to trusting it.

The [HN thread](https://news.ycombinator.com/item?id=49067854) argues over whether the rewrite is "done." That's the wrong question. The one worth asking: when the marginal cost of producing a PR drops below the marginal cost of reviewing it, what is your real throughput — and who pays for the half of the work that isn't tokens?