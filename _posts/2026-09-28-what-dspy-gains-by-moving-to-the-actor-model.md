---
layout: post
title: "What DSPy Gains by Moving to the Actor Model"
date: 2026-09-28 03:07:44 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
source: hn
source_id: "49869995"
discussion_url: https://news.ycombinator.com/item?id=49869995
source_url: https://github.com/deepfates/imp
---

The easy read on [Imp](https://github.com/deepfates/imp) is "DSPy, but in Elixir," and that undersells it. DSPy's real idea — declare what each LLM step takes and returns as a signature, then let an optimizer compile the prompts against examples of what good looks like — is orchestration. And orchestration is the one thing the BEAM has been quietly good at for thirty years.

Porting that onto the actor model buys you more than syntax. It buys supervision, process isolation, and real concurrency for the parts of an agent that actually need them. Fan-out tool calls, retries and fallbacks, sub-agent routing — those are message-passing problems, and OTP already treats a crashing process as a routine event with a supervisor to restart it, not an exception you bolt onto a linear script. Python agent frameworks keep reinventing that machinery on top of a runtime that fights them on concurrency; here it's the substrate you start from.

The caveats are real. It's a 0.5, first-on-Hex release, the optimizers still need large-scale benchmarking to prove they earn their keep, and it's chasing a moving target — built against DSPy 3.2–3.3, aiming for parity by 3.5 — while the ML tooling gravity stays firmly in Python. The [HN discussion](https://news.ycombinator.com/item?id=49869995) splits along exactly that seam: is the concurrency story worth leaving the ecosystem for? The transferable idea outlives the language argument — treat LLM programs as supervised, concurrent processes instead of sequential scripts, and the reliability problems that dominate production agents start to look like problems someone solved decades ago. Would you run your next agent stack on a runtime built for a million supervised processes, or keep patching concurrency onto Python?
