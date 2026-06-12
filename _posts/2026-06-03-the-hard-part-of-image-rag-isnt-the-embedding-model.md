---
layout: post
title: "The Hard Part of Image RAG Isn't the Embedding Model"
date: 2026-06-03 14:07:40 +0000
categories: [rag, ai-infrastructure, llm-ops]
hn_id: 48372239
hn_url: https://news.ycombinator.com/item?id=48372239
source_url: https://www.kapa.ai/blog/how-we-index-images-for-rag
---

The interesting decision in multimodal RAG isn't which vision encoder you pick — it's what you actually store. The [kapa.ai writeup on indexing images](https://www.kapa.ai/blog/how-we-index-images-for-rag) lands on a point most teams learn the hard way: a screenshot of an architecture diagram and a marketing hero image are both "images," but only one carries retrievable meaning. Index them the same way and you quietly poison recall.

Generating text descriptions of images and embedding those alongside the raw vectors matches what I've seen hold up in production. A caption that reads "sequence diagram of OAuth token refresh" retrieves against a developer's question far better than a pixel embedding ever will, because the query already lives in text space. The cost is real — you pay a vision-model pass per image at ingest, and your index quality is now bounded by caption quality. That's an eval problem, not a model problem: you need to measure whether the generated descriptions answer the questions users actually ask, not whether they look plausible.

The part I'd push further: most image-RAG pipelines still treat the image as the atomic retrieval unit. For technical docs, the figure plus its caption plus the paragraph that references it are one unit of meaning. Index them apart and you strand the context that made the image legible in the first place. The [HN thread](https://news.ycombinator.com/item?id=48372239) runs the usual CLIP-versus-captioning debate, but the operational takeaway is simpler than the model argument suggests.

If your image embeddings and your text embeddings live in different vector spaces, are you doing multimodal retrieval — or just running two retrievers and hoping the fusion step covers for both?
