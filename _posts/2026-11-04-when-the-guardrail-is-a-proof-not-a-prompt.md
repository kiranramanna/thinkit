---
layout: post
title: "When the Guardrail Is a Proof, Not a Prompt"
date: 2026-11-04 03:05:42 +0000
categories: [agentic-ai, llm-ops, enterprise-ai]
source: hf-papers
source_id: "2611.02332"
discussion_url: https://huggingface.co/papers/2611.02332
source_url: https://arxiv.org/abs/2611.02332
---

Most of the guardrails I've shipped for tool-using agents are, underneath, a
second model asked nicely to catch the first one misbehaving.
[LeanGuard](https://arxiv.org/abs/2611.02332) flips that: it checks every
proposed tool call against a policy written in Lean4 before the call reaches the
environment, and the decision procedure is proved equivalent to a formal
LeanLTL semantics. Fail-closed, with scoped past-time temporal operators over
the execution history — so "never issue a refund after the account was flagged"
stops being a sentence you hope the judge model honors and becomes a predicate
the runtime enforces.

The numbers are the part worth sitting with. On Tau-Bench, unguarded agents
across five Qwen sizes execute at least 33 calls the policy forbids; LeanGuard
executes zero, and task success doesn't drop. On a direct prompt-injection suite
it cuts attack success from 57.9% to 5.9%. In production terms that's the
difference between a guardrail that degrades gracefully under adversarial input
and one that quietly lets the injection through because the judge got argued out
of its own rule.

The genuinely new piece is proof-guided repair: when a call is denied, Lean
metaprogramming searches for a nearby admissible call that preserves the user's
intent — no model in the loop — and finds one for 88 of 252 argument-value
denials in a median of a couple of milliseconds. That's not just blocking; it's
a path to keeping the agent useful after it hits the wall. The
[HF paper page](https://huggingface.co/papers/2611.02332) has the discussion and
the DTap and telecom breakdowns. The open question for anyone running agents
against real systems: are our policies even writable as temporal predicates, or
have we been hiding genuinely ambiguous business rules behind a model because we
never had to make them precise?
