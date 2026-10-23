---
layout: post
title: "When Your Guardrail Should Be a Program, Not a Judge"
date: 2026-10-23 14:15:34 +0000
categories: [llm-ops, agentic-ai, enterprise-ai, research]
source: hf-papers
source_id: "2610.31062"
discussion_url: https://huggingface.co/papers/2610.31062
source_url: https://arxiv.org/abs/2610.31062
---

Policy enforcement for agents has quietly outgrown the content-moderation model everyone started with. The question is no longer "is this one message safe" but "did this multi-turn transcript, with all its tool calls, actually stay inside a compound business policy." [SCOPE](https://arxiv.org/abs/2610.31062) argues the two dominant answers are both wrong for production: fine-tuned guardrail models fall apart on compound policies, and LLM-as-a-judge is accurate but expensive and maddeningly unstable run-to-run.

Its answer is to compile the natural-language policy into an executable program of small neural predicates, deterministic extractors, and plain code that composes them — then optimize that program against adversarially generated counterexamples that target where it drifts from the policy.

- 🎯 **The policy becomes code**, so a verdict is reproducible instead of re-sampled on every call
- 🔍 **Each decision is interpretable** — you can read the predicate outputs that produced the verdict
- ⚡ **Runs on cheap models** yet reaches accuracy comparable to frontier reasoning models on their benchmark
- 💡 **Programs transfer** across executors without re-optimization, so a weak-model build still ports up
- ⚠️ **The hard part moves to spec quality** — the counterexample generation is doing the heavy lifting, and that's exactly where your edge cases live

This lands on a real LLM-ops pain. Anyone who has run an LLM-as-a-judge guardrail in production knows the instability tax: the same transcript flips verdicts between runs and your eval dashboard quietly stops meaning anything. A compiled, inspectable predicate program is the kind of artifact a governance review actually wants to see. The [HF paper page](https://huggingface.co/papers/2610.31062) has the ablations. My open question: compound enterprise policies change constantly — how cheap is recompiling and re-verifying a SCOPE program when legal edits one clause, versus just editing a judge's prompt?
