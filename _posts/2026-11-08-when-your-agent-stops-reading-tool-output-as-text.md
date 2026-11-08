---
layout: post
title: "When Your Agent Stops Reading Tool Output as Text"
date: 2026-11-08 14:05:51 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.06500"
discussion_url: https://huggingface.co/papers/2611.06500
source_url: https://arxiv.org/abs/2611.06500
---

Every multi-step agent I've run in production eventually chokes on the same thing: tool output. A search call returns a few KB of mostly-irrelevant text, the agent appends it verbatim, and ten steps later the context window is a landfill of stale observations the model re-reads on every turn. The usual fixes — summarize the observation, prune old turns — all stay inside text, which caps how much you can actually squeeze out.

[This paper](https://arxiv.org/abs/2611.06500) makes the sharper argument: the agent doesn't need to read tool output as text at all. Their method compresses each tool observation into a handful of continuous latent tokens and drops those straight into the agent's input embedding space — no decoding back to words. The clever part is the training signal. Instead of optimizing for reconstruction (can I recover the original text?), they use what they call Action-Preserving Training: align the agent's next-action distribution under the compressed observation with its distribution under the full one. You're not compressing the text, you're compressing it down to whatever the agent needed to pick its next move. On web-search agents across four QA benchmarks they report 70-89% fewer tokens and 24-56% lower end-to-end runtime, with task accuracy going *up*. The [HF paper page](https://huggingface.co/papers/2611.06500) has the per-benchmark breakdown.

Here's where my production instinct tightens up. Latent tokens are opaque. What I give up isn't accuracy — it's the readable trace. When a text-based agent goes sideways, I can scroll the transcript and see exactly which observation poisoned the plan; with latent observations that debugging surface is gone, and the operational exhaust an on-call engineer actually reads disappears into a vector. Action-Preserving Training also only preserves the actions it was trained against — swap in a new tool whose output shifts the decision boundary and the compressor has no idea it's now dropping the signal that matters.

So the real question isn't whether this saves tokens; the numbers say it does. It's whether you'd trade your agent's audit trail for a 3x context budget. For a high-QPS, tightly-bounded tool surface, maybe. For anything I still have to debug at 2am, I'm not convinced going blind is worth it.
