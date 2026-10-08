---
layout: post
title: "Your Web Agent Breaks in the Harness, Not the Model"
date: 2026-10-08 03:12:26 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.03036"
discussion_url: https://huggingface.co/papers/2610.03036
source_url: https://arxiv.org/abs/2610.03036
---

The most useful number in the [WebFovea report](https://arxiv.org/abs/2610.03036) is that the team pushed their hidden-set score from 31.0 to 57.0 using the same model in every submission. Nothing about the LLM changed. All of that lift came from the harness — the code sitting between the model's reply and the live page.

If you build agents, you already suspect this. A capable multimodal model is necessary and nowhere near sufficient; at every step four things have to go right, and on real websites the failures cluster in the plumbing, not the reasoning:

- 🎯 **Action parsing** — the model's reply has to become the action it meant; self-generated chat-template tokens contaminated 4.9% of task episodes
- ⚡ **Action effect** — a coordinate-space mismatch quietly placed every click at three-quarters of its intended target
- 🔍 **Faithful reporting** — native dropdowns, iframe content, and text boxes failed silently, so the agent "saw" a success that never happened
- 💡 **Right context** — the loop has to show the model the information it actually needs before the next decision, not whatever the DOM happened to dump
- ⚠️ **Guardrails** around the loop keep the agent inside the rules and its token budget instead of trusting it to stay there on its own

The framing I'm taking back to my own agent work: the four-stage view is model-independent even when individual fixes aren't. Before you reach for a bigger model to fix a flaky agent, instrument those four stages — most of the "the model is dumb" failures I've chased turned out to be a click landing in the wrong place or a result the harness never reported back. The [HF paper page](https://huggingface.co/papers/2610.03036) links the code and the negative results, and the negatives are worth as much as the fixes here.
