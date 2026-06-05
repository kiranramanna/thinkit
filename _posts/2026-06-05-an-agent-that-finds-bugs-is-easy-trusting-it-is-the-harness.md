---
layout: post
title: "An Agent That Finds Bugs Is Easy; Trusting It Is the Harness"
date: 2026-06-05 14:07:24 +0000
categories: [agentic-ai, llm-ops, industry]
hn_id: 48403980
hn_url: https://news.ycombinator.com/item?id=48403980
source_url: https://github.com/anthropics/defending-code-reference-harness
---

The interesting thing about [Anthropic's vulnerability-discovery framework](https://github.com/anthropics/defending-code-reference-harness) isn't that an LLM can flag bugs — models have been surfacing suspicious code for a while now. It's that the release is shaped as a *reference harness*: the scaffolding for running, scoring, and reproducing what the agent claims to find. That's the part most teams skip, and it's the part that decides whether an AI security tool survives contact with a real codebase.

Anyone who has pointed an agent at a real repo knows the failure mode. The model surfaces fifty "vulnerabilities," six are real, and the security team burns a week sorting them. Detection was never the bottleneck — precision is, and so is a triage loop that doesn't lose the team's trust after the third false positive. A harness that pins down ground truth and actually measures false-positive rate is doing the unglamorous work that makes the agent deployable instead of demo-able.

This is the lesson that keeps resurfacing in production agentic systems: the model is the cheap part, the eval harness is the moat. A vuln-discovery agent without a repeatable scoring loop is a party trick; one with a harness that gates findings on confidence is something you can wire into CI and trust to stay quiet when it should. My bet is that the durable value here is the methodology, not the prompts. The [HN thread](https://news.ycombinator.com/item?id=48403980) is already arguing about signal-to-noise on real repositories — which is exactly the right argument to be having.

If you were evaluating one of these for your own pipeline, what false-positive rate would it have to clear before you'd actually turn it on for a production repo?
