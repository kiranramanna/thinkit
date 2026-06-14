---
layout: post
title: "Your Local LLM Bottleneck Is the BIOS, Not the Model"
date: 2026-06-14 03:04:24 +0000
categories: [llm-ops, ai-infrastructure]
hn_id: 48515454
hn_url: https://news.ycombinator.com/item?id=48515454
source_url: https://imil.net/blog/posts/2026/rtx-5080-+-rtx-3090-setup-80+-tok-s-on-qwen-3.6-27b-q8/
---

Getting Qwen 3.6 27B to 80+ tok/s at Q8 on a mismatched RTX 5080 + RTX 3090 pair came down to motherboard arcana, not model tuning — which is the entire story of serious local inference. The [iMil writeup](https://imil.net/blog/posts/2026/rtx-5080-+-rtx-3090-setup-80+-tok-s-on-qwen-3.6-27b-q8/) reads like a model-performance post and is actually a plumbing post, and that inversion is the lesson.

- 🎯 **The throughput win was PCIe plumbing**, not weights: disable CSM, enable Above 4G Decoding and Resizable BAR, and split the x16 slot into 2x8 on a board that actually supports it.
- ⚠️ **Boot UEFI, never MBR** — MBR mode silently forbids using both cards, which is the kind of failure that eats an evening before you suspect the firmware.
- ⚡ **Q8 over Q4 was bought with VRAM**, not magic: a refurbished 24GB 3090 alongside the 5080 moved the rig from ~30 tok/s to 50–60 with MTP, then past 80.
- 🔍 **Heterogeneous GPUs cooperated fine** — Blackwell and Ampere together — so the architectural mismatch was never the ceiling; the board was.
- 📊 **80 tok/s on a 27B at full Q8 at home** quietly redraws the build-vs-rent line for anyone doing inference capacity planning.

This rhymes with production serving: latency and throughput get won in the layer below the model — interconnect, memory placement, quantization, batching — long before anyone swaps a checkpoint. The [HN discussion](https://news.ycombinator.com/item?id=48515454) has more dual-card setups, and they all confirm the unglamorous truth: the hard part of running an open model isn't the model. So how much of your "LLM tuning" time last quarter was actually spent on firmware, drivers, and PCIe lanes?
