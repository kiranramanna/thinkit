---
layout: post
title: "Why Agents Fumble the Last Mile of Real Tasks"
date: 2026-11-09 14:13:46 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.07461"
discussion_url: https://huggingface.co/papers/2611.07461
source_url: https://arxiv.org/abs/2611.07461
---

The number to pull out of [this paper](https://arxiv.org/abs/2611.07461), underneath all the benchmark soup, is this: two frontier coding agents each finished 9 of 46 real-world tasks on their own, and 39 and 35 of them when wired into a shared harness. Same backbones — that's not a model improvement, it's a harness improvement, and the framing behind it is worth stealing.

The authors call the gap the "last mile." Agents are good at *reaching* a resource — finding the API, the doc, the right tool — and bad at the step right after: actually applying it correctly in context. Most harnesses hand the model a raw tool and leave the competence to use it with the caller, so every new harness rebuilds the same know-how from scratch. Their fix is "agent-native primitives" — wrap each resource in a resident LLM that already knows how to apply it and can talk to the other primitives, then compose the primitives a task needs into a graph, verify against evidence from the environment, and revise the ones a failure implicates.

If that sounds like per-capability sub-agents exposed over MCP, that's roughly what it is, and it's the direction I'd bet enterprise agent platforms converge on. You don't make the top-level model smarter about every tool; you push tool-specific competence down into the tool's own wrapper and let the orchestrator compose. It's the retrieval-versus-reranking split all over again — getting the thing in reach was never the real bottleneck.

What I want before believing the 4x jump generalizes is the failure taxonomy: which of those 46 tasks the primitives still miss, and whether the "revise the implicated primitive" loop converges or just thrashes. The [HF paper page](https://huggingface.co/papers/2611.07461) lists the eight primitive families — the honest test is whether your own tool-use failures map onto them.
