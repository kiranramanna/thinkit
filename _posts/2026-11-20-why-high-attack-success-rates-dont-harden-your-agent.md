---
layout: post
title: "Why High Attack Success Rates Don't Harden Your Agent"
date: 2026-11-20 03:05:40 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.24362"
discussion_url: https://huggingface.co/papers/2611.24362
source_url: https://arxiv.org/abs/2611.24362
---

The uncomfortable finding in [PIPETTE](https://arxiv.org/abs/2611.24362): a
red-teaming run that racks up a sky-high attack success rate can still leave you
with an agent no more robust than before. Two RL-based attackers they test
collapse onto a handful of winning strategies — plenty of successes, almost all
variations on the same exploit — so adversarial training on that haul hardens
against one thing and little else.

- 🎯 **ASR is the wrong target** — coverage of *distinct* attack strategies is
  what actually transfers into defense
- 🔍 **A dictionary-learning reward** pushes red-teaming toward broader strategy
  coverage instead of rediscovering the same injection
- ⚠️ **On-policy adversarial training tuned for indirect prompt injection** —
  resist the attack while still completing the legitimate user task
- 📊 **Near-zero success on static attacks**, holds up against strong adaptive
  ones on AgentDojo and ASB, with benign utility close to the undefended
  baseline
- 💡 **The production lesson**: a guardrail eval that only reports "attacks
  blocked" is measuring the wrong axis — a mode-collapsed test set can glow
  green while the agent stays wide open

Anyone running agents against untrusted data — email, web pages, retrieved
documents — is already in scope for indirect prompt injection whether their eval
harness admits it or not. The [arXiv paper](https://arxiv.org/abs/2611.24362)
walks through the purple-teaming loop, and the
[HF paper page](https://huggingface.co/papers/2611.24362) has the benchmark
numbers. The habit I'd carry into any safety harness: stop celebrating attack
success rate and start measuring strategy coverage — a defense is only as good
as the diversity of the attacks it was trained against.
