---
layout: post
title: "When Copilot Copies the Attacker's Instructions Forward"
date: 2026-07-29 14:04:47 +0000
categories: [agentic-ai, llm-ops, enterprise-ai]
hn_id: 49096188
hn_url: https://news.ycombinator.com/item?id=49096188
source_url: https://enklypesalt.com/posts/context-collapse-part3-ai-worming-through-word/
---

Morris II showed self-replicating prompts in email assistants; this is the same idea landing in Word. In a [coordinated disclosure with MSRC](https://enklypesalt.com/posts/context-collapse-part3-ai-worming-through-word/), the researcher demonstrates hidden instructions in one document propagating into Copilot-edited documents — turning each output into a new carrier, even after the original malicious file is gone.

- 🪱 **The worm is the workflow.** Malicious text hidden in a "trusted" source doc gets read by Copilot for Word, executed as if it were the user's request, then copied into the drafted output.
- 🔁 **Propagation without the attacker.** Once the payload lives in a Copilot-generated doc, the next Copilot-assisted edit re-triggers it and spreads it further — no original attacker document required.
- 🎯 **XPIA, escalated.** Parts 1–2 of the series showed single-interaction cross-domain prompt injection; this extends it to persistence across a document supply chain.
- ⚠️ **144 days to coordinate.** A 90-day disclosure window stretched to 144 — a signal of how non-trivial the mitigation is when the vulnerability is the model reading its own inputs.
- 🔍 **Content is code.** The root issue is unchanged from every injection story: an LLM can't reliably separate instructions from data, and "data" now includes every document it touches.

This is why I don't trust context-boundary hygiene as a control for agentic document tools — provenance and output sanitization have to sit outside the model. The [HN discussion](https://news.ycombinator.com/item?id=49096188) is split on whether this is "just prompt injection again," but self-propagation changes the blast radius.

If your agents both read and write shared documents, what stops a payload from riding along?
