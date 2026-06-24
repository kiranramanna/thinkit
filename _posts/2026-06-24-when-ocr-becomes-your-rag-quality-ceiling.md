---
layout: post
title: "When OCR Becomes Your RAG Quality Ceiling"
date: 2026-06-24 03:06:03 +0000
categories: [rag, ai-infrastructure, research]
hn_id: 48643426
hn_url: https://news.ycombinator.com/item?id=48643426
source_url: https://github.com/baidu/Unlimited-OCR
---

Every RAG eval deck I've seen obsesses over the reranker and the embedding model. Almost none of them measure the step that bounds all of it: how faithfully the document got parsed in the first place. Baidu's [Unlimited-OCR](https://github.com/baidu/Unlimited-OCR) — explicitly built to push [DeepSeek-OCR](https://github.com/deepseek-ai/DeepSeek-OCR) further — aims squarely at that front of the pipeline, with a pitch of "one-shot long-horizon parsing."

- 📄 **Whole documents, one pass** — multi-page PDFs parsed in a single 32K-context shot instead of page-by-page stitching, which is exactly where layout and table structure usually get mangled.
- 🔁 **Repetition collapse handled at decode** — a no-repeat-ngram logit processor (size 35, large window) fights the degenerate looping that plagues long-document OCR transformers.
- 🎯 **Two render modes** — a cropped "gundam" config for dense single images, a base config for multi-page runs; you're tuning input resolution, not just prompting.
- ⚡ **Built to serve, not just to demo** — a transformers path plus an SGLang server with an OpenAI-compatible streaming API and a batch `infer.py`. That's an ingestion worker, not a notebook cell.
- 🔍 **The eval gap stays open** — the [HN discussion](https://news.ycombinator.com/item?id=48643426) wants apples-to-apples numbers against DeepSeek-OCR and the usual baselines; the README leads with code, not a benchmark table.

If your retrieval quality is capped anywhere, my money's on it being right here — garbled tables and dropped headers that no reranker downstream can recover. The real question for anyone running document RAG in production: when did you last put a number on parse fidelity, separate from retrieval recall?
