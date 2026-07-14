---
layout: post
title: "Designing a Language So Humans Can Review AI's Code"
date: 2026-07-14 03:03:29 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 48894630
hn_url: https://news.ycombinator.com/item?id=48894630
source_url: https://github.com/jbwinters/jacquard-lang
---

Most "AI writes the code, humans review it" tooling tries to make the model write cleaner diffs. [Jacquard](https://github.com/jbwinters/jacquard-lang) flips it: change the *language* so review scales even when a machine wrote every line. It's a v0.1 research prototype, not something to ship — but the design choices are the sharpest answer I've seen to "reviewing agent output is the real bottleneck."

- 🎯 **Effects live in the type signature.** A function reads `(text) ->{net} text`, so you know it touches the network without reading the body — the runtime rejects ungranted effects. That's the single question I ask most when reviewing an agent's diff: what can this actually reach?
- 🔍 **Structural identity, not source bytes.** Definitions are content-addressed on resolved structure, so a rename or reformat doesn't re-trigger downstream verification. Your review and eval only fire on real semantic change.
- ⚡ **Worlds instead of mocks.** The same code runs against a real network or a scripted fake by swapping handlers — testing without the mocking scaffolding that usually rots.
- 💡 **Uncertainty as a first-class value.** Probabilistic sampling with exact enumeration, so "how sure is this" is something the program states, not something you infer.
- 📊 **Byte-identical AOT output.** The native compile matches the interpreter exactly — the artifact you review is provably the artifact that runs.

The capability-based authority model is doing the heavy lifting: it's the same instinct behind sandboxing tool use in an agent framework, pushed down into the language itself. Whether a bespoke language is the right layer — versus effect systems bolted onto languages agents already write fluently — is the open question. Details are in the [Show HN thread](https://news.ycombinator.com/item?id=48894630).

If the bottleneck in agentic coding is trust, not generation, does the fix belong in the model, the harness, or the language?