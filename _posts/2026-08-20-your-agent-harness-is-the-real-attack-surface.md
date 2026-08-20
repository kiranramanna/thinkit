---
layout: post
title: "Your Agent Harness Is the Real Attack Surface"
date: 2026-08-20 03:03:23 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.17597"
discussion_url: https://huggingface.co/papers/2608.17597
source_url: https://arxiv.org/abs/2608.17597
---

The number that jumps out of [HarnessRisk](https://arxiv.org/abs/2608.17597): attack success ranges from 12.6% to 80.9% across the *same* models. The variance lives in the harness and its configuration, not the weights. If you run agents in production, that spread should unsettle you more than any single model's safety card.

The paper's move is to stop treating agent safety as one thing and split it across six lifecycle phases, then embed an adversarial instruction inside an untrusted workflow artifact for each. That's the failure mode I actually see: not a model deciding to be evil, but a tool result or a stored scrap of state carrying an instruction nobody sanitized.

- 🎯 **Harness Configuration is the weakest phase** across all three harnesses — attacks win by nudging security-sensitive params inside otherwise-authorized workflows, not with flashy jailbreaks.
- ⚠️ **Detection is not safety**: some setups flagged risk in over 90% of runs and still got compromised. A guardrail noticing the threat is not the agent refusing to act on it.
- 📊 **Four separate axes** — Utility, Attack Success, Persistence, Detection — instead of one blended "safety" score, which is the only honest way to expose that gap.
- 🔍 **Persistence as a first-class metric**: did the compromise survive into later state, or just fire once and vanish.
- ⚡ **Utility stayed high (75–97.6%)** even where attacks landed — so "it still completed the task" tells you nothing about whether it was safe.

Most agent safety dashboards I've seen measure "did the model recognize this was bad" — and a model that recognizes danger while still executing the dangerous action is scoring well on the wrong metric. The [HF paper page](https://huggingface.co/papers/2608.17597) has the sandboxed case breakdown.

If you're running agents with tool access and persistent state, which of your six phases have you actually red-teamed — or are you assuming the model's refusal is your control plane?
