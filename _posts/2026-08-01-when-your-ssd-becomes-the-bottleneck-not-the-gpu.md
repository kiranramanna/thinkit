---
layout: post
title: "When Your SSD Becomes the Bottleneck, Not the GPU"
date: 2026-08-01 14:04:12 +0000
categories: [llm-ops, ai-infrastructure]
hn_id: 49123386
hn_url: https://news.ycombinator.com/item?id=49123386
source_url: https://github.com/sqliteai/waste
---

The headline number is 29 GB of RAM to run a 2.78-trillion-parameter model on a laptop. The number that actually decides your experience is 17 GB — that's how much WASTE reads off NVMe for *every single token*.

Kimi K3 is a mixture-of-experts model that activates roughly 4% of itself per token, and [WASTE](https://github.com/sqliteai/waste) leans on that sparsity completely: it keeps the 27.28 GB trunk resident in RAM and streams the remaining ~955 GB of expert weights from disk on demand, quantized to 3 bits per weight with residual vector quantization. The model "fits" in a MacBook's memory, but decode lands at 0.45–0.62 tok/s — because you're now bandwidth-bound on the SSD, not the accelerator.

- 🎯 MoE sparsity is the whole trick — 4% active experts per token is what lets 955 GB stay on disk
- ⚡ Overlapping expert reads with compute buys ~1.6x; prefetching layer L+1's experts during layer L lifts cache hits from 14% to 38%
- 🔍 Experts are 4 KiB-aligned so each lookup is exactly one `pread` — storage layout becomes a first-class perf lever
- 📊 17 GB/token against a measured 12.78 GB/s SSD sets the ceiling; drop to a USB 3 drive at 0.94 GB/s and it's unusable
- ⚠️ The trunk stays at 4–8 bits because it has no trained tolerance for 3-bit compression — not every tensor quantizes equally

In production we obsess over KV-cache growth and HBM bandwidth on the GPU. WASTE is a reminder that the memory hierarchy doesn't stop at VRAM: push the model down to disk and the SSD's sequential read rate *is* your tokens/sec. The [HN thread](https://news.ycombinator.com/item?id=49123386) treats this as a fun stunt, but I think the real question is inverted — at what context length does streaming experts from NVMe actually beat renting a second GPU?
