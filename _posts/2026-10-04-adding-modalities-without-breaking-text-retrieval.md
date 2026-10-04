---
layout: post
title: "Adding Modalities Without Breaking Text Retrieval"
date: 2026-10-04 14:08:55 +0000
categories: [rag, ai-infrastructure, research]
source: hf-papers
source_id: "2610.02148"
discussion_url: https://huggingface.co/papers/2610.02148
source_url: https://arxiv.org/abs/2610.02148
---

The quiet failure mode in multimodal retrieval is a regression you don't notice: you bolt image and audio encoders onto a text embedder, media recall looks great in the demo, and three weeks later someone asks why plain text search got worse. [Omni-Embed-Mini](https://arxiv.org/abs/2610.02148) attacks that by making the regression structurally impossible — it keeps the text-side weights bit-identical to the backbone, so adding five modalities cannot move the text number (49.57 nDCG@10 on MTEB BEIR-8 holds by construction, not by luck).

The part I'd actually reuse is the teacher signal: the target is the frozen backbone's own embedding of a dense caption of each media sample. No separate teacher model, no second embedding space to reconcile — teacher and student share byte-identical geometry, and lightweight projectors plus phased LoRA adapters on the modality encoders do the alignment. For anyone running hybrid search in production, "the new modality lands in the same cosine space as my existing text index" is the whole ballgame. It means you don't re-embed your corpus or stand up a parallel retrieval path to support images or audio.

The size story matters more than the leaderboard story. At 0.9B it's 2.7–9.5x smaller than the open omni embedders they compare against, and the 2.3B variant trades blows with the closed gemini-embedding-2. In an eval harness where you watch index build time and query latency, a 0.9B embedder that doesn't regress text is more operationally useful than a 7B one that edges a benchmark. Models, code, and the eval harness are linked from the [HF paper page](https://huggingface.co/papers/2610.02148).

The open question for me: Matryoshka SigLIP gives you truncatable dimensions, but does cross-modal alignment survive aggressive truncation, or does media recall fall off a cliff well before text does?
