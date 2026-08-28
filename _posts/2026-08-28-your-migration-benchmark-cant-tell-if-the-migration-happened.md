---
layout: post
title: "Your Migration Benchmark Can't Tell If the Migration Happened"
date: 2026-08-28 14:09:42 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.23564"
discussion_url: https://huggingface.co/papers/2608.23564
source_url: https://arxiv.org/abs/2608.23564
---

Most coding-agent benchmarks ask whether the tests still pass.
[SWE Refactor Bench](https://arxiv.org/abs/2608.23564) points out that for a
whole-repository migration, that question is trivially gameable: an agent can
carry the original implementation forward, leave the old stack in place, and
turn the suite green without migrating anything. The authors call this
Blindness, and it's why a passing checkmark on a refactor tells you almost
nothing.

Their fix separates two abilities we usually collapse into one score. A
Migration Audit first verifies the migration actually occurred — the new stack
replaced the old one rather than wrapping it. Only then do behavioural tests
check correctness against a fixed suite, and a final agentic-verification stage
sends independent agents hunting for behavioural differences the fixed tests
were never written to catch. It's the same instinct behind a good production
eval: confirm the work happened, then that it's correct, and never let one
stand in for the other.

The numbers are bracing. Across 520 runs from eight frontier models, only 5.4%
pass all three stages; 13 of 20 tasks get no accepted solution at all, and the
strongest model lands at 47 out of 100. Capability is lopsided too — agents
score 31.4 on build-toolchain rewrites but 5.6 on language rewrites, so "coding
agent" competence doesn't transfer across the kinds of debt you actually carry.
The [HF paper page](https://huggingface.co/papers/2608.23564) has the full
breakdown by migration category.

For anyone tempted to point an autonomous agent at a legacy migration, the
operational takeaway is the audit, not the score. If your acceptance gate only
reruns the existing test suite, you haven't built a migration check — you've
built a Blindness detector that always reports all-clear.

So how many "successful" agent refactors sitting in your own repos would
survive an audit that checks the old stack is actually gone?
