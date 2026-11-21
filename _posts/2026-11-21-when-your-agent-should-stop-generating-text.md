---
layout: post
title: "When Your Agent Should Stop Generating Text"
date: 2026-11-21 14:05:47 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.21053"
discussion_url: https://huggingface.co/papers/2611.21053
source_url: https://arxiv.org/abs/2611.21053
---

The expensive failure in a production agent isn't picking the wrong tool — it's inventing an argument value that looks plausible and then poisons every step downstream. Once a fabricated ID or quantity lands in a tool call, no amount of retries saves you; the error has already been laundered into "real" data.

[System 1 agents](https://arxiv.org/abs/2611.21053) go after that directly by refusing to let the model free-generate at all. A deterministic compiler turns each tool's schema plus the incoming request into multiple-choice questions whose options are drawn only from the request and the schema, and a single-pass decision model answers them. Nothing gets produced that wasn't already in the inputs, so there's no surface for hallucinated content. On 1,952 requests across 157 biomedical tools, the best configuration chose the right tool (or correctly declined) 97% of the time and filled 97% of argument values — ahead of all 18 local LLM-agent setups — while zero calls contained invented content, against 5.5–19.7% for the LLM agents.

That framing matches how I think about reliability in enterprise agentic workflows. We pour effort into guardrails that catch bad tool calls after the model emits them; constraining the decision space so a bad value is unrepresentable is a cleaner guarantee than inspecting generations after the fact. The tradeoff is honest — it only works where choices are enumerable, and it hands user-facing language back to a generative model — but a large share of real agent steps are exactly that: routing, selecting, declining. The [HF paper page](https://huggingface.co/papers/2611.21053) links the open-source release if you want to run it against your own tool set.

The open question for me: how far up the stack does "don't generate, decide" reach before the enumeration explodes? Routing and argument-filling clearly fit. Multi-step planning over an open tool catalog is where I'd expect it to break — and that's exactly where I'd want this guarantee most.