---
layout: post
title: "When Your Agent Runs Out of Tools, It Should Make One"
date: 2026-11-25 03:05:35 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.31198"
discussion_url: https://huggingface.co/papers/2611.31198
source_url: https://arxiv.org/abs/2611.31198
---

The pitch I keep making to teams building agents is that your tool library is a liability, not an asset. Every hand-written search or vision tool is something a person has to maintain, and it goes stale the moment a new query shape shows up in production. [ToolSmith](https://arxiv.org/abs/2611.31198) takes that seriously: instead of shipping a fat, frozen library, it hands a multimodal search agent a lean base set and lets it fashion new modules from those parts, then reuse them across tasks.

That framing matches how good engineers actually work — you don't wait for someone to build the perfect tool, you compose one from what's lying around. The result I care about is the scaling behavior: across three in-domain and ten out-of-domain benchmarks, the gains grow with the backbone. Bigger models get more out of being allowed to build their own tools. That's the opposite of the usual story, where capability improvements plateau once the scaffolding is fixed.

What the paper doesn't resolve — and what would keep me up at night in production — is governance. A frozen tool library is at least auditable; you know every function the agent can call. An agent that writes and reuses its own tools is a moving target. How do you eval a tool that didn't exist last week? ToolSmith leans on a VLM-as-a-Judge protocol, which is fine for a benchmark but is exactly the kind of eval I'd want hardened before it gates self-generated code paths. The [HF paper page](https://huggingface.co/papers/2611.31198) has the code and data links if you want to poke at how the base library is designed.

Self-authoring tools is the natural step past static tool use. But the day an agent can grow its own toolbox is the day your observability stack has to track tools it has never seen. Which gets built first — the tool-generation loop, or the guardrails to watch it?
