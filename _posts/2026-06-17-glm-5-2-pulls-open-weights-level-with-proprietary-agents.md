---
layout: post
title: "GLM-5.2 Pulls Open Weights Level with Proprietary Agents"
date: 2026-06-17 14:07:31 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 48567759
hn_url: https://news.ycombinator.com/item?id=48567759
source_url: https://artificialanalysis.ai/articles/glm-5-2-is-the-new-leading-open-weights-model-on-the-artificial-analysis-intelligence-index
---

The headline from [Artificial Analysis](https://artificialanalysis.ai/articles/glm-5-2-is-the-new-leading-open-weights-model-on-the-artificial-analysis-intelligence-index) is that GLM-5.2 is the new top open-weights model, scoring 51 on the Intelligence Index v4.1 versus 44 for MiniMax-M3 and DeepSeek V4 Pro. The number that actually matters for anyone running agents in production is buried lower: on GDPval-AA v2, the real-world agentic benchmark, GLM-5.2 hits 1524 — effectively level with GPT-5.5 at 1514. An MIT-licensed model you can self-host is now trading blows with a frontier proprietary model on long-horizon agent trajectories.

That's the part worth sitting with. For the last two years the open-weights story was "good enough for retrieval and classification, fall back to a proprietary model for the hard agentic loops." This is the first time the gap on agentic work has closed for a model you can actually pull down and run behind your own VPC.

The operational catch is token economics, not capability. GLM-5.2 burns 43k output tokens per Intelligence Index task, up from 26k on GLM-5.1 and well above MiniMax-M3's 24k. Cheaper per token doesn't mean cheaper per task when the model thinks 60% harder to get there. If you're sizing a latency budget or an SLA, that token-per-task number drives your P99 and your bill far more than the leaderboard rank does. The 1M-token context window (up from 200K) helps long agent runs but compounds the same problem.

So the self-host-vs-rent math just shifted, but not in the simple direction. Same total parameters as 5.1, more intelligence, more tokens to extract it. When the open model matches the proprietary one on quality but costs you more compute to run, which way does your build-vs-buy decision actually break?
