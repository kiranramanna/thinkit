---
layout: post
title: "When Swapping Models Is Really a Harness Rewrite"
date: 2026-07-13 03:03:36 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48882716
hn_url: https://news.ycombinator.com/item?id=48882716
source_url: https://ploy.ai/blog/migrating-a-production-ai-agent-to-gpt-5-6
---

The [Ploy team's writeup on moving a production agent to GPT-5.6](https://ploy.ai/blog/migrating-a-production-ai-agent-to-gpt-5-6) leads with the numbers everyone screenshots — 2.2x faster to a finished page, 27% cheaper per build, output tokens down about 48%. Those are the least interesting part. The real finding is that roughly a third of the raw failures they hit traced back to their own harness assumptions, not to the model.

The migration was a harness rewrite wearing a model-swap costume. GPT-5.6 doesn't omit unused tool arguments the way Claude does — it fills all 25 in every time with plausible-looking values like `offset: 0`, which quietly turned 52-64% of file reads into empty results. The fix was schema surgery: optional properties became "required but nullable" via `anyOf: [T, null]`, which alone cut tool calls around 30%. Prompt caching was a second rewrite — org-scoped caching that hit 92-96% became workspace-scoped keys throttled at 15 requests/min, and they had to restructure just to claw back to 83.7% first-call hits. Server-side reasoning references broke mid-conversation until they switched to `store: false` and self-contained replay.

This matches what I see operating agents in production: the model is the swappable component, but the eval harness and the tool contract are where the real coupling lives. If your evals encode implicit thresholds and provider-specific batching, a "model regression" is often a harness bug you shipped months ago and never noticed. The [HN thread](https://news.ycombinator.com/item?id=48882716) has more of these war stories. Before you benchmark a new model, can your harness even tell you which failures are the model's fault?
