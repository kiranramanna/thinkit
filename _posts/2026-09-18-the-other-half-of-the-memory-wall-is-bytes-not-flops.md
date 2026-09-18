---
layout: post
title: "The Other Half of the Memory Wall Is Bytes, Not FLOPs"
date: 2026-09-18 03:03:42 +0000
categories: [llm-ops, ai-infrastructure, research]
source: hf-papers
source_id: "2609.18063"
discussion_url: https://huggingface.co/papers/2609.18063
source_url: https://arxiv.org/abs/2609.18063
---

The compute half of the memory wall gets all the attention — MoE sparsity, K-of-N routing, active-parameter counts. [Edge0](https://arxiv.org/abs/2609.18063) is about the other half: sparsity shrinks the FLOPs per token, not the bytes you have to keep resident. A 35B-class MoE is roughly 19.5GB at 4-bit whether or not you only fire four experts per layer, and that number is what decides whether the model runs on the box you actually have.

Naive SSD offload doesn't rescue you, because layer N+1's experts can't be chosen until layer N produces its output — so the reads start too late to hide behind compute. Edge0's move is a prerouter: a small per-layer head predicts the next layer's routing one token ahead, and that prediction *is* the routing, so the expert set you stream equals the set you use and nothing gets dropped. A recovery LoRA on the student path pays back the accuracy lost to int4 and the routing swap. The reported result: a 35B MoE at 20 tok/s inside 3GiB of peak active memory on a single 24GB machine, within a few points of the fp16 teacher. The [HF paper page](https://huggingface.co/papers/2609.18063) has the per-benchmark numbers.

For anyone costing out inference, this is the interesting lever. The industry reflex is to quantize harder or distill smaller; predicting the I/O schedule instead lets you hold a big sparse model on commodity hardware and trade disk for the memory you don't have. The catch is that the trade is only as good as your SSD — streaming a full active set cold every token is a bandwidth-and-wear budget, not a free lunch.

That skepticism is where the early reaction landed too. [MindStudio](https://www.mindstudio.ai/blog/edge0-35b-phone-memory-moe) calls it genuinely useful for edge experimentation but weak on agentic workloads and Apple-Silicon-only for now, and [Ian Khasky](https://dev.to/khasky/edge0-streams-moe-experts-off-ssd-to-fit-35b-in-3-gb-3308) works the arithmetic to argue the "runs on your phone" framing oversells a Mac Python package whose per-token drive reads no consumer SSD can actually sustain at the quoted speeds. Both land in the same place: clever systems work, not yet a production serving story — which is exactly the seam worth watching as the recovery-LoRA-plus-prerouter pattern gets ported off Apple Silicon.
