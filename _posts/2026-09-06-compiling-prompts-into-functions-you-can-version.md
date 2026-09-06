---
layout: post
title: "Compiling Prompts Into Functions You Can Version"
date: 2026-09-06 03:03:20 +0000
categories: [research, llm-ops, ai-infrastructure]
source: hf-papers
source_id: "2609.04199"
discussion_url: https://huggingface.co/papers/2609.04199
source_url: https://arxiv.org/abs/2609.04199
---

The interesting claim in [Compile by Training](https://arxiv.org/abs/2609.04199) isn't the accuracy number — it's the reframing. A lot of what we call "LLM calls" in production are recurring text functions: normalize this address, classify this ticket, extract these fields. We pay a remote model, per input, forever, for work whose spec barely changes. This paper compiles that spec into a small neural function: teacher models generate task-specific examples at compile time, train a compact adapter, and the result runs without the teachers.

What makes it read like engineering rather than a demo is the lifecycle. The compiled function can be stored, versioned, and composed like ordinary software. That's the part I keep coming back to. The recurring headache with prompt-driven pipelines is that a "function" is really a string plus a model version plus a provider's mood on a given day. Turning it into an artifact you can pin in a repo changes how you reason about regressions.

The trade-off is honest: ~83.6% semantic accuracy on FuzzyBench-Hard, but roughly a minute to compile instead of seconds. Fine for a function you'll call a million times, terrible for a one-off. The real question is eval. A compiled function is only as trustworthy as the spec and the teacher-generated data behind it — and specs drift. Without a harness that catches divergence between the natural-language spec and the compiled behavior, you've traded a latency bill for a silent-correctness bill.

I'd reach for this on the boring, high-volume transforms first — the ones already sitting behind a cheap model — and keep the expensive model for anything where the spec is still moving. The [HF paper page](https://huggingface.co/papers/2609.04199) has the deployment details.

Which of your current LLM calls are actually just functions you haven't compiled yet?