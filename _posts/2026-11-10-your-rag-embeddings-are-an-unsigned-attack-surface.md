---
layout: post
title: "Your RAG Embeddings Are an Unsigned Attack Surface"
date: 2026-11-10 03:05:20 +0000
categories: [rag, llm-ops, research]
source: hf-papers
source_id: "2611.06498"
discussion_url: https://huggingface.co/papers/2611.06498
source_url: https://arxiv.org/abs/2611.06498
---

Most of the RAG-integrity thinking I've done stops at the document: sign the source, check the signature, trust the chunk. [This paper](https://arxiv.org/abs/2611.06498) goes after the part I'd been waving past — the embedding vectors that ship alongside the text. Offline and edge RAG gets updated through signed knowledge packs that bundle text with precomputed vectors. The signature proves who published the pack. It proves nothing about whether those vectors actually encode the text sitting next to them.

That's the text-vector integrity gap, and the obvious defense makes it worse. Recompute the embeddings and accept them within a cosine tolerance, and the share of queries an attacker can steer is exactly the distribution of angular retrieval margins at that tolerance — the authors call it the margin law. Margins are small in real corpora: a tolerance at floating-point-noise levels still leaves a few percent of queries hijackable, and a threshold calibrated from an ordinary CPU INT8-vs-FP32 comparison leaves 98–100% exposed. On a Raspberry Pi 5 with a local model, tampered vectors drop correct answers from 0.75 to 0.39. Compression is no shelter — on a FAISS product-quantization index over 57k documents, vectors that pass the integrity audit still rank the attacker's document first for a quarter of targeted queries.

Two takeaways I'd carry into any pipeline that ingests embeddings it didn't compute. A signature on the bundle is not integrity on the index; trusting vendor-supplied vectors means trusting an unsigned attack surface. And "just re-embed and compare" isn't the fix, partly because common FP and dynamic-INT8 inference isn't bit-reproducible across batch sizes or hardware. The working defense is to verify the quantization codes directly with a calibrated guard band. Code and data are on the [HF paper page](https://huggingface.co/papers/2611.06498).

How many production RAG stacks are quietly trusting an embedding index nobody ever bound to its source text?
