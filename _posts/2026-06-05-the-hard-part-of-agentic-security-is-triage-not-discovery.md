---
layout: post
title: "The Hard Part of Agentic Security Is Triage, Not Discovery"
date: 2026-06-05 03:06:51 +0000
categories: [agentic-ai, llm-ops, industry]
hn_id: 48403980
hn_url: https://news.ycombinator.com/item?id=48403980
source_url: https://github.com/anthropics/defending-code-reference-harness
---

The interesting thing about [Anthropic's reference harness for autonomous vulnerability discovery](https://github.com/anthropics/defending-code-reference-harness) isn't that an LLM can find bugs in source code. We've known that for a while. It's the shape of the loop: recon → find → triage → report → patch, with a multi-stage verification pass whose entire job is to throw away false positives before a human ever sees them.

That triage gate is the whole game. Any agent pointed at a large codebase will surface a flood of "potential" issues — the failure mode of every static analyzer ever shipped. What makes an agentic security loop usable in production isn't recall on the find step; it's precision on the triage step. The harness treats verification as a first-class stage rather than a confidence threshold tacked onto the end, which matches what I keep seeing in agentic systems generally: generating candidate actions is cheap, deciding which ones are real is where the engineering and the latency budget actually go.

What I'd watch is how this generalizes past security. The recon → find → triage → patch skeleton is just a grounded agent with a verification harness bolted on, and the same structure applies to data-quality remediation, config drift, or flaky-test repair. The [HN thread](https://news.ycombinator.com/item?id=48403980) is split on whether the false-positive rate is low enough to trust the loop unattended — which is exactly the right thing to argue about. If your agent can't gate its own output, are you running an autonomous system, or just an expensive linter that writes English?
