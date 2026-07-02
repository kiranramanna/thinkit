---
layout: post
title: "The Hard Part of Document ETL Isn't Parsing"
date: 2026-07-02 03:05:35 +0000
categories: [rag, agentic-ai, enterprise-ai]
hn_id: 48746752
hn_url: https://news.ycombinator.com/item?id=48746752
source_url: null
---

Most "extract structured data from PDFs" pitches quietly assume the schema lives inside a single page. The interesting claim in the [Parsewise Launch HN](https://news.ycombinator.com/item?id=48746752) is the opposite: a value you need often has to be resolved *across* documents — an insurance policy PDF, a transcribed call, an email thread — and the model has to reason about where each field actually comes from.

That reframes the problem. Point-and-extract is a parsing task; resolving one schema field from three sources that disagree is a retrieval-and-reasoning task, which is the part that breaks in production. Anyone who has handed a bucket of files to an LLM and asked for a clean CSV knows the two failure modes: you hit input limits and cost long before accuracy, and even when it returns something, you have no fast way to trust it. Lineage — knowing which document and which span produced a value — is what makes the output auditable instead of a plausible guess.

The founders (ex-Palantir ETL, ex-Bain financial analysis, per their [product page](https://www.parsewise.ai/api)) are betting the wedge is validation, not extraction: loop a business expert in to confirm definitions and spot-check resolved values. That matches what I see in enterprise RAG — the eval and grounding layer is where the real work is, not the first-pass extract.

The open question is whether cross-document lineage survives contact with messy inputs. Entity linking across a thousand-file corpus, with conflicting values and no shared key, is exactly where grounding degrades fastest. If they can show reliable provenance at that scale, the "agentic ETL" framing earns its name. If not, it's a nicer wrapper on the same brittle extract-and-pray loop. Which is it — has anyone run this against a genuinely adversarial document set?
