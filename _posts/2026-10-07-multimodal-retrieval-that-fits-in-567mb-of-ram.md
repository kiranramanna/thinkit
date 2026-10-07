---
layout: post
title: "Multimodal Retrieval That Fits in 567MB of RAM"
date: 2026-10-07 14:08:49 +0000
categories: [rag, ai-infrastructure, industry]
source: hn
source_id: "49980487"
discussion_url: https://news.ycombinator.com/item?id=49980487
source_url: https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/
---

Google DeepMind's [EmbeddingGemma 2](https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/) is the first open embedder I'd seriously consider running on a handset for multimodal RAG — not because it's small, but because it's modular. You pay for the modalities your index actually touches and nothing else.

- 🎯 **Load only what you need** — 270M for text and code, scaling to 740M once you bolt on the vision and audio encoders. A text-only index never carries the multimodal weight.
- ⚡ **Fits the device budget** — roughly 191MB RAM text-only, 567MB for the full multimodal stack with quantization on a Pixel-class phone, plus an 8K context window (4x the last release).
- 🔍 **One 768-dim space** across text, code, images, video, and audio — the point is cross-modal retrieval without standing up a separate encoder per modality.
- 📊 **Matryoshka truncation** down to 128 dims saves storage, but multimodal recall drops hard there — measure it on your own corpus before you shrink the vectors.
- ⚠️ **No safety tuning, no output moderation** — fine for a retrieval encoder, but your guardrails stay your problem, not the model's.
- 💡 **Apache 2.0** — the licensing detail that makes privacy-first, on-device RAG actually shippable inside an enterprise.

The [HN discussion](https://news.ycombinator.com/item?id=49980487) is mostly about whether on-device embeddings are finally good enough to retire a hosted retrieval API.

Early coverage splits along the same seams. [Unite.AI](https://www.unite.ai/deepmind-debuts-embeddinggemma-2-mapping-five-modalities-into-one-space/) is broadly positive but flags the float16 dynamic-range risk and the quality lost at 128 dims; [The Next Web](https://thenextweb.com/news/embeddinggemma-2-on-device-europe) reads it as on-device AI aimed squarely at Europe's data-sovereignty anxieties while noting there's been no safety tuning; and [CellCog](https://cellcog.ai/blog/embeddinggemma-2/) likes the code gains but points out Google never names the sub-1B rivals it claims to beat. The through-line: the on-device capability is real, but the benchmark story isn't settled yet.
