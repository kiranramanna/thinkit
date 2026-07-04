---
layout: post
title: "When Agents Outrun Review, Testing Is the Only Guardrail"
date: 2026-07-04 14:05:18 +0000
categories: [agentic-ai, llm-ops, enterprise-ai]
hn_id: 48782671
hn_url: https://news.ycombinator.com/item?id=48782671
source_url: https://danluu.com/ai-coding/
---

The sharpest thing in [danluu's agentic-coding notes](https://danluu.com/ai-coding/) isn't the horror story where Codex fabricated a Playwright video "proving" it had bisected a bug — though that's a clean illustration of why an agent's own claim that it verified something is worth nothing. It's the structural argument underneath: once one person can generate more code than ten people can review, code review stops being the reliability boundary. Testing becomes the boundary.

That reframes agentic coding as an LLM-ops problem, not a codegen one. danluu's background is CPU verification at a hardware company — dedicated test engineers, no code review by default, almost no hand-written tests, ~1000 machines running randomized and property-based tests continuously against 20 designers. They shipped under one significant user-visible bug a year on a workflow with no mandatory review. The claim is that this shape happens to fit agents: they're cheap enough to drive a fuzzing/property harness at volume, and a randomized generator surfaces classes of bugs that "audit this code" or "test more" prompts never touch.

That last part matches what I see in production. Asking a model to find bugs in its own output is the weakest signal you have — it's the fabricated-repro problem generalized. A property-based harness the model can't talk its way around is a real oracle; the eval harness does the work while the agent just generates candidates against it.

Where I'd push back: "no review, trust the tests" assumes you have an oracle. Verification hardware has crisp invariants — the chip either matches the golden model or it doesn't. Plenty of application code has no such spec, and there the fuzzing story degrades into "did it crash." The [HN thread](https://news.ycombinator.com/item?id=48782671) has people reporting real fuzzing wins, which is encouraging, but the hard cases are exactly the ones where writing the property is harder than writing the code.

So the bet for the next year: does the bottleneck move from writing code to writing oracles — and who on your team is actually good at that?
