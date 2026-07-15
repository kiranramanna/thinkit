---
layout: post
title: "When the DSL Becomes the Thing You Actually Review"
date: 2026-07-15 14:05:05 +0000
categories: [agentic-ai, llm-ops, enterprise-ai]
hn_id: 48918575
hn_url: https://news.ycombinator.com/item?id=48918575
source_url: https://martinfowler.com/articles/llm-and-dsls.html
---

The reliability problem with LLM codegen was never that the model can't write the code. It's that the output space is unbounded, so every generation is a fresh review problem. [This Thoughtworks piece](https://martinfowler.com/articles/llm-and-dsls.html) argues the fix is a narrower target: give the model a domain-specific language to emit, and the DSL acts as a harness that does the constraining a longer prompt never will.

What I like about the argument is where it puts the source of truth. Once the DSL exists, you stop reviewing generated general-purpose code and start reviewing DSL programs — smaller, domain-shaped, checkable against the semantic model underneath. That's a real change to the eval surface. In production agent work, most of our reliability budget goes into exactly this: constrained decoding, tool schemas, structured output. A DSL is the high-leverage version of the same instinct — instead of validating free-form output after the fact, you make the invalid states hard to express in the first place.

The honest caveat the article gets right: you don't know the DSL upfront. A spec is a hypothesis, and the design gets discovered through implementation — so phase one is using the LLM as a partner to build the DSL iteratively, and only phase two treats it as a stable natural-language interface. That split is the part teams skip. They reach for a DSL, freeze it too early, and end up with an abstraction that fights the domain instead of encoding it. The [HN thread](https://news.ycombinator.com/item?id=48918575) has the predictable counter — "isn't this just a well-typed API?" — and the answer is yes, until the surface is big enough that natural-language-to-DSL beats natural-language-to-code on review cost alone.

So the open question for anyone running LLMs against a large codebase: what's the smallest DSL that would make 80% of your generations reviewable in a single pass — and would you rather maintain that, or keep re-reviewing raw output forever?
