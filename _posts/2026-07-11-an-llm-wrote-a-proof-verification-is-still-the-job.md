---
layout: post
title: "An LLM Wrote a Proof; Verification Is Still the Job"
date: 2026-07-11 03:07:45 +0000
categories: [llm-ops, research, agentic-ai]
hn_id: 48863490
hn_url: https://news.ycombinator.com/item?id=48863490
source_url: https://cdn.openai.com/pdf/04d1d1e4-bc75-476a-97cf-49055cd98d31/cdc_proof.pdf
---

The headline says a frontier model proved the Cycle Double Cover Conjecture. The [released prompt](https://cdn.openai.com/pdf/04d1d1e4-bc75-476a-97cf-49055cd98d31/cdc_proof.pdf) says something more useful about where AI-for-math actually sits.

- 🎯 The deliverable is an *unverified* artifact. A model emitted a proof; whether it holds is still an open human question — the [HN discussion](https://news.ycombinator.com/item?id=48863490) is already split between "huge milestone" and "suspiciously concise."
- 🔍 Half the prompt is anti-reward-hacking. It explicitly rejects "status reports, vague optimism, and claims that an unproved global compatibility statement is 'routine'." That isn't math guidance — it's a guardrail against a model declaring victory.
- ⚠️ Verifying with another LLM ("the smaller model says the proof is sound") is circular. If your checker shares the generator's blind spots, you've manufactured confidence, not correctness.
- 💡 This is the eval problem I hit in production, just with higher stakes: generation is cheap, and the bottleneck is a verifier you actually trust. Math has one — formal proof checkers. Most agentic tasks don't.
- 📊 The tasks AI eats first are the ones where correctness is machine-checkable, solutions are expressible as text, and prior art is dense. Theorem proving and software both qualify — that's the real signal here, not the trophy.

The race worth watching isn't which model proves the next conjecture. It's whether we wire these outputs into Lean or Coq before someone ships an elegant, wrong proof that no human bothered to check.
