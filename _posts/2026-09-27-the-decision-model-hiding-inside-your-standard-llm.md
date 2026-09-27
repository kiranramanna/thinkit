---
layout: post
title: "The Decision Model Hiding Inside Your Standard LLM"
date: 2026-09-27 03:08:49 +0000
categories: [llm-ops, ai-infrastructure, agentic-ai]
source: hn
source_id: "49857656"
discussion_url: https://news.ycombinator.com/item?id=49857656
source_url: https://www.privatemode.ai/blog/system-one-from-glm-flash
---

Every agentic and RAG pipeline I've run leans on a swarm of tiny typed decisions — route to this tool or that one, is this chunk relevant, does this text smell like PII, which of forty intents fired. The lazy pattern is to send each one through a full generation call and parse JSON out the other side. That's a decode loop and a fragile parse step for what is really a single classification.

The [Privatemode write-up](https://www.privatemode.ai/blog/system-one-from-glm-flash) shows the cleaner move: prefill the assistant turn so it ends on `choice_index:`, then read the log-probabilities of the allowed option tokens from that one forward pass. vLLM already exposes the hooks — `allowed_token_ids` to constrain the vocabulary to your options and `logprob_token_ids` to pull the exact probabilities — so you get a ranked choice with calibrated confidence and no free-form text to sanitize. Their GLM-5.3-Flash setup lands within 0.7 points of a purpose-built decision model across 28 datasets, at roughly 180ms, and unlike that specialist it takes image inputs (70.2% on scanned-document classification).

The honest catch is cost: they quote EUR 62 per million decisions versus EUR 16 for the specialized model. So this isn't "always cheaper," it's "cheaper to operate a model you already serve." If GLM-Flash — or any capable open model — is already behind your vLLM, folding your routers and guardrail checks into single-pass logprob reads means one deployment, one set of SLAs, and confidence scores you can actually threshold on. That last part is what I'd lean on hardest: a router that knows when it's a coin-flip is worth far more than one that's silently 55% sure. The [HN discussion](https://news.ycombinator.com/item?id=49857656) is good on where the dedicated model still earns its keep.

If your intent classifier or tool-router is still doing a full generate-and-parse, what's actually stopping you from collapsing it into one forward pass?
