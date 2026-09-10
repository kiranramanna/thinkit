---
layout: post
title: "No, Looped Transformers Aren't Hiding the Reasoning"
date: 2026-09-10 03:03:51 +0000
categories: [ai-infrastructure, llm-ops, industry]
source: hn
source_id: "49627370"
discussion_url: https://news.ycombinator.com/item?id=49627370
source_url: https://magazine.sebastianraschka.com/p/gpt-6-astra-looped-transformers-and
---

The interesting thing about the GPT-6 Astra "looped transformers hide the reasoning" story isn't the architecture — it's how quickly a single anonymous source hardened into settled fact.

Raschka's piece cuts through it: a looped, or recurrent-depth, transformer just reuses the same layer stack more than once before emitting a token. Reuse a 22-layer block twice and you get 44 layers of compute without 44 layers of weights. That adds hidden-state computation exactly the way ordinary layers do — it doesn't suppress a visible chain of thought. Astra emitting fewer reasoning tokens than GPT-5.6 Sol is what you'd expect from a bigger, better-trained model, not proof of concealment. [His breakdown](https://magazine.sebastianraschka.com/p/gpt-6-astra-looped-transformers-and) walks through the mechanism.

The production angle is real, though: recurrent depth is adaptive test-time compute. Easy prompts take fewer loops, hard ones take more, and you pay in latency rather than context length — a genuinely different cost curve than "just generate more reasoning tokens." What's worth flagging is epistemic. The entire architecture claim traces to one report from The Information, and the ecosystem is already writing "Astra is a looped transformer" as if OpenAI shipped a spec. The [HN discussion](https://news.ycombinator.com/item?id=49627370) has the usual mix of people treating a rumor as documentation.

The wider reaction splits along that exact fault line. [The Memo](https://lifearchitect.substack.com/p/the-memo-special-edition-gpt-6-astra) reads Astra as proto-ASI sitting on a huge undiscovered capability overhang, while still tagging the looped-transformer mechanism as unconfirmed. [Kingy AI](https://kingy.ai/blog/recurrent-depth-openai-astra/) pushes back hard — recurrent depth is plausible, but the Astra-specific claim is one anonymously sourced report with no code, technical report, or independent corroboration behind it. [AI/TLDR](https://ai-tldr.dev/releases/sebastian-raschka-looped-transformers-sep9/) lands near Raschka, reading the shorter traces as capability rather than concealment. The story people want is "OpenAI hid the chain of thought"; the story the evidence supports is that someone said "recurrent depth" once and the internet built a datasheet around it.