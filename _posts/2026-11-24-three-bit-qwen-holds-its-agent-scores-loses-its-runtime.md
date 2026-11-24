---
layout: post
title: "Three-Bit Qwen Holds Its Agent Scores, Loses Its Runtime"
date: 2026-11-24 03:05:05 +0000
categories: [llm-ops, ai-infrastructure, agentic-ai]
source: hn
source_id: "50611402"
discussion_url: https://news.ycombinator.com/item?id=50611402
source_url: https://huggingface.co/nari-labs/Qwen3.8-27B-NariQ-GGUF
---

The benchmark line everyone will quote from [NariQ](https://huggingface.co/nari-labs/Qwen3.8-27B-NariQ-GGUF) is that the 3-bit build *beats* BF16 on DeepSWE (41.0 vs 39.8) and Terminal-Bench (63.8 vs 62.6). Don't. A quantized model scoring half a point above its parent on an agent benchmark is noise, not a free lunch. The real result is that 3-bit holds inside the noise band while 2-bit falls off a cliff — DeepSWE 28.6, AIME 86.0. That cliff is the number worth trusting.

What's actually interesting is the operational trade. A 53.8 GB model compresses to 10.12 GB with no measurable loss on long-horizon agent tasks, math, or image understanding. When you're running agents and the model is the entire latency and memory budget, fitting a capable 27B onto a single consumer GPU changes what you can realistically self-host. The method is trellis-coded PTQ calibrated on real coding-agent traces, which is the right instinct — calibrate on the distribution you actually serve, not on a generic perplexity corpus.

The catch is portability, and it's a large one. These files only load in Nari Labs' own llama.cpp fork, tuned for SM120 cards like the RTX PRO 6000. Stock llama.cpp, Ollama, and LM Studio can't read the tensor types yet; Ampere and Apple silicon fall back to slow paths — about 3.8 tok/s on an M3 Pro. So you've traded 44 GB of VRAM for a hard dependency on one fork and one GPU generation. In production that's rarely a trade I'd take: a quant I can't move across runtimes is a quant I can't operate.

The [HN discussion](https://news.ycombinator.com/item?id=50611402) is circling the same question — is a format that needs a bespoke inference engine a real release or a tech demo? Which matters more to you: the 10 GB, or the runtime you have to adopt to get it?
