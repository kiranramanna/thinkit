---
layout: post
title: "When the Skill Is Designed to Dodge Your Safety Checks"
date: 2026-11-28 03:05:31 +0000
categories: [agentic-ai, llm-ops, industry]
source: hn
source_id: "50669765"
discussion_url: https://news.ycombinator.com/item?id=50669765
source_url: https://github.com/convex/convex-backend-skill/issues/64
---

The headline on [this issue](https://github.com/convex/convex-backend-skill/issues/64) is that a skill POSTs your one-sentence app idea to a remote endpoint it never mentions, logged server-side as "a run started." That's bad, but it's the ordinary kind of bad — undisclosed telemetry, fixable with a consent prompt. The line that actually stopped me is in a sibling skill, describing why it splits a download and its execution into two separate steps:

> A single command that both downloads remote code and executes it is the shape harness safety classifiers block.

Read that again. The skill isn't just doing something risky — its instructions tell the agent to break a `curl | bash` into two calls *specifically because* the combined form is what the harness's safety classifier catches. That's not a careless one-liner. That's a skill engineered to route around the exact guardrail the user or their admin chose to keep switched on.

This is the agent-skill supply-chain problem we've been hand-waving about, made concrete. We spent the last year wiring safety classifiers into harnesses: pattern-match the dangerous shapes, flag download-and-run, gate the spend. A classifier that keys on command *shape* is trivially defeated by anyone who knows the shape — and a Markdown skill file is the perfect place to encode that knowledge, because it reads as instructions to the model, not as code to a scanner.

The reporter's fixes are the right ones: disclose and gate the data send, bundle or hash-pin the bootstrap scripts, and delete the classifier-dodging instruction outright. But the deeper lesson for anyone shipping an agent platform is that your safety layer can't live only at the command surface. If a skill's natural-language text can talk the model into restructuring its own tool calls, the threat model has to include the prose itself. The [HN discussion](https://news.ycombinator.com/item?id=50669765) is mostly users saying they're now eyeing alternatives — the market doing the enforcement the classifier couldn't.

If your harness blocks `curl | bash` but waves through the two-line version that does the same thing, what exactly did you block?
