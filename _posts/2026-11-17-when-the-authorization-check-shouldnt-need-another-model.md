---
layout: post
title: "When the Authorization Check Shouldn't Need Another Model"
date: 2026-11-17 14:06:52 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.07222"
discussion_url: https://huggingface.co/papers/2611.07222
source_url: https://arxiv.org/abs/2611.07222
---

The clever move in [SPILLWAY](https://arxiv.org/abs/2611.07222) isn't a better classifier for prompt injection — it's refusing to put a model on the final authorization check at all.

Most runtime defenses for tool-using agents work by asking a model whether an action is safe to let through. That model reads the same attacker-controlled text it's supposed to guard against, and it adds a model call to every step — a latency and cost tax that bites the moment you're running agents against real SLAs. SPILLWAY reads *where* an action is going straight from the typed returns the tools already hand back: an email's sender or a payment's destination arrives in a typed field, while injected instructions arrive as free text. A call is admitted only when each target value that showed up in tool output — but not in the user's original task — came from a read-only tool's typed field or a fixed delegation rule. A deterministic sanitizer strips the instruction-like spans before the model ever sees them, keeps the removed text as evidence, and a local judge can restore a wrongly-refused call — but never one whose target lived in those removed spans.

The reported numbers are the part worth sitting with: no standard templated injection redirects an action under this floor, a forged chat template produces a raw zero, and a released RL attacker lands at .007 mean in-scope attack success — all with almost no added model call and no defense-triggered re-run of the backbone.

For anyone building agents that touch email, files, or payments, this is the shape of guardrail I'd actually want in production: deterministic, auditable, and cheap enough to leave on by default. The [HF paper page](https://huggingface.co/papers/2611.07222) has the full method. The open question is how far the typed-field provenance idea survives contact with messy real tools whose "typed" fields are really half-structured strings — how much of your agent's action surface could you honestly express as typed targets instead of free text?
