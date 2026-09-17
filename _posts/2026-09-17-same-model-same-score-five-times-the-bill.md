---
layout: post
title: "Same Model, Same Score, Five Times the Bill"
date: 2026-09-17 03:08:28 +0000
categories: [agentic-ai, llm-ops, enterprise-ai]
source: hn
source_id: "49733726"
discussion_url: https://news.ycombinator.com/item?id=49733726
source_url: https://harnesstax.github.io/
---

The interesting result in [HarnessTax](https://harnesstax.github.io/) isn't that the harness matters — it's how little it moves the number everyone optimizes for. Across 21 model–harness pairs on SWE-bench Lite and Terminal-Bench 2.0, swapping between Claude Code, Codex CLI, and the minimal open-source Pi barely changed task success rate. What it changed was cost: the same model, landing the same score, ran up to 5x more expensive depending on the scaffolding wrapped around it.

The mechanism is unglamorous. Claude Code's mean initial context is over 10x Pi's — longer system instructions, fatter tool schemas — and every one of those tokens is spent before the agent reads a line of your code. When accuracy is flat across harnesses, the harness stops being a capability decision and becomes a line item. A minimal harness staying competitive means a lot of the premium scaffolding is buying convenience, not correctness.

The part that should unsettle vendors is cross-model: a model sometimes does better paired with a harness other than its own. Claude models don't necessarily need Claude Code. That decouples the model from the runtime you wrap it in and turns harness choice into something you can A/B against your own eval and your own bill — exactly where most teams have no measurement today. The study still hedges that on harder problems at the edge of a model's capability, structured guidance may earn its tokens; the [HN discussion](https://news.ycombinator.com/item?id=49733726) is worth reading for teams comparing Pi against the incumbents.

If harness choice is a 5x cost lever with no accuracy penalty on routine work, why isn't it already a line in your agent's eval budget?
