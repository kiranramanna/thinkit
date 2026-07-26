---
layout: post
title: "An LLM That Runs From Flash on an $8 Microcontroller"
date: 2026-07-26 03:03:09 +0000
categories: [ai-infrastructure, llm-ops, research]
hn_id: 49050512
hn_url: https://news.ycombinator.com/item?id=49050512
source_url: https://github.com/slvDev/esp32-ai
---

The reflex read on [this ESP32-S3 project](https://github.com/slvDev/esp32-ai) is "cute, a 28.9M-param model on an $8 chip." The real lesson is that on constrained hardware, your memory hierarchy — not your parameter count — is the design surface.

- 🎯 **The model is 14.9MB at 4-bit**, but the chip has 512KB of SRAM. Fitting it means deciding *where each weight lives*, not shrinking the model further.
- 🔍 **Three-tier layout**: SRAM holds the per-token "thinking" core, PSRAM holds the output head and working memory, and the ~25M-param table sits in slow flash — roughly 6 rows (~450 bytes) read per token.
- ⚡ **Per-Layer Embeddings** (the trick Google shipped in Gemma) make this viable: fetch only the embedding rows a token needs instead of resident-loading the whole table.
- 📊 **~9.5 tokens/sec end-to-end** — flash being the slow tier isn't the bottleneck people assume, because the access pattern is that sparse.
- ⚠️ **It writes short TinyStories and nothing else** — no instruction-following, no facts, no code. The memory technique is sound; the reasoning ceiling is the model, not the method.

What I keep coming back to: this is the datacenter serving problem inverted. We spend enormous effort keeping KV-cache and hot weights in HBM and paging the rest; the ESP32 is doing offload-to-flash with a 450-byte working set. Same principle — keep the per-token hot path tiny, push the cold mass down a tier — at opposite ends of the cost curve.

The [HN discussion](https://news.ycombinator.com/item?id=49050512) has good back-and-forth on whether sparse embedding fetches would survive a model that actually reasons. My bet: the layout generalizes, but the sparse-flash-read economics fall apart the moment you need dense attention over long context. Where's the crossover point where paging weights stops being free?
