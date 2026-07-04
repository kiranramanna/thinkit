---
layout: post
title: "Self-Hosting an Opus-Class Model Is a VRAM Problem"
date: 2026-07-04 03:03:03 +0000
categories: [llm-ops, ai-infrastructure]
hn_id: 48775921
hn_url: https://news.ycombinator.com/item?id=48775921
source_url: https://github.com/jamesob/local-llm
---

jamesob's [local-LLM writeup](https://github.com/jamesob/local-llm) is the most
honest hardware post I've read this year, because the takeaway isn't "buy the new
thing." It's: spend on VRAM, buy everything else secondhand. The ~$40k rig runs
GLM-5.2 quantized on 4x RTX 6000 Blackwell and lands "pretty close to Opus" — but
the base system wrapped around those GPUs is a $500 secondhand EPYC Milan and
DDR4 ECC.

- 🎯 **VRAM is the constraint, not FLOPs** — a 594B quantized model needs ~384GB, so the model choice follows the memory budget, not the other way around
- ⚡ **~80 tok/s at 460k context** on the big rig, while a $2k dual-3090 box runs Qwen3.6-27B — the floor for "usable" is lower than people assume
- 🔍 **The real work sits below the model** — vLLM in docker-compose, IOMMU disabled, PCIe ACS tuned, cards power-limited to survive a 110V circuit
- 📊 **Interconnect matters** — a PCIe Gen4 switch buys 27.5 GB/s GPU-to-GPU; without it, tensor-parallel throughput craters
- 💡 **Local buys data control, not convenience** — you trade a clean API SLA for being your own hardware ops team

The economics argument on the [HN thread](https://news.ycombinator.com/item?id=48775921)
mostly misses this. The question was never "is local cheaper than the API"
(usually it isn't). It's whether you need the weights on your own iron for
governance reasons — and if you do, this is the actual bill of materials rather
than a hand-wave.

At enterprise-fleet scale the calculus flips again: you're not power-limiting
3090s, you're amortizing a cluster and worrying about utilization. But the
single-rig version is a useful forcing function — it makes the VRAM-per-dollar
math impossible to fudge. When does self-hosting stop being a hobby and start
being a compliance line item for your team?
