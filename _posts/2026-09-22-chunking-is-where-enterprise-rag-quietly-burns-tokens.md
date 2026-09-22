---
layout: post
title: "Chunking Is Where Enterprise RAG Quietly Burns Tokens"
date: 2026-09-22 14:08:53 +0000
categories: [rag, enterprise-ai, llm-ops, research]
source: hf-papers
source_id: "2609.24220"
discussion_url: https://huggingface.co/papers/2609.24220
source_url: https://arxiv.org/abs/2609.24220
---

The clever part of [D-RAC](https://arxiv.org/abs/2609.24220) isn't the multimodal parsing — it's the refusal to let an LLM rewrite your source text during chunking at all.

Most enterprise ingestion pipelines pick one of two bad options. Rule-based extraction and OCR are cheap, but they flatten tables, scramble reading order, and throw away heading hierarchy, so retrieval quality suffers downstream. Agentic chunking over the extracted text fixes coherence but puts a frontier model on every page — token cost you can't forecast, and hallucinated content sneaking into your chunks. D-RAC normalizes any format into PDF first (DOCX, PPTX, scans all have a deterministic PDF rendering), does a single multimodal pass to retrieval-optimized Markdown with tables rewritten as self-contained prose and headings preserved, and then chunks deterministically: parse into ID-addressable units, and have the LLM plan over identifiers instead of regenerating text.

That last decision is the one worth stealing. Because source text is never regenerated during chunking, you keep determinism and observability — the same input produces the same chunks, and you can audit why a chunk exists. The numbers back it up: on a 236-document, 795-page enterprise benchmark, 95.7% fewer chunking-stage output tokens, 77.8–85.6% lower cost depending on model pricing, and linear scaling past 500 pages. When ingestion is a batch job you re-run every time a knowledge base drifts, that cost curve is the difference between refreshing nightly and refreshing quarterly.

The trade I'd want to measure is the multimodal pass itself — one model call per rendered page isn't free, and I'd profile the table-to-prose rewrite against my own layout-heavy PDFs before trusting it on, say, financial statements where a mis-parsed cell is a wrong answer. The [HF paper page](https://huggingface.co/papers/2609.24220) has the full pipeline breakdown. If your RAG eval already scores retrieval on the ingested chunks, would you hand chunking to a deterministic planner — or is the agentic rewrite still buying you something your metrics aren't catching?
