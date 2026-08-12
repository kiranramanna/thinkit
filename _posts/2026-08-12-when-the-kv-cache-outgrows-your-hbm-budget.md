---
layout: post
title: "When the KV Cache Outgrows Your HBM Budget"
date: 2026-08-12 14:05:55 +0000
categories: [ai-infrastructure, llm-ops, research]
source: hf-papers
source_id: "2608.08097"
discussion_url: https://huggingface.co/papers/2608.08097
source_url: https://arxiv.org/abs/2608.08097
---

The interesting claim in [OasisKV](https://arxiv.org/abs/2608.08097) isn't the throughput number — it's the admission that decode is a memory problem, not a compute one. Once you serve long-context and long-form reasoning workloads, the KV cache dominates both footprint and memory traffic, and HBM capacity, not FLOPs, is what caps your batch size and throughput.

OasisKV decouples full KV storage from HBM. Because decode-time attention is naturally sparse, it keeps only the KV entries of the tokens that actually matter in HBM and pushes the rest to host or remote memory. The part that makes this practical is prediction: it drafts lookahead tokens with speculative decoding to guess which KV blocks the next decode step will need, then prefetches them through a background attention pipeline before they're used. Built on vLLM, it holds accuracy within 0.7 points of full attention under a 2,048-token KV budget and converts that sparsity into 1.69x throughput on reasoning workloads, up to 2.1x on multi-GPU long-context serving.

What earns a production engineer's attention is the disaggregation result: under prefill–decode disaggregation, OasisKV admits each request with 6.5–9.7x less KV and holds 2.2–2.6x less decode-node host memory. If you already split prefill and decode across separate pools, that changes your capacity math directly — more concurrent requests per decode node without buying more HBM.

The catch is that this is another accuracy-for-throughput knob, and "within 0.7 points" is workload-dependent. Speculative-decoding-driven prefetch also ties your serving throughput to draft quality: a worse drafter mispredicts important blocks and you pay the prefetch miss. The [HF paper page](https://huggingface.co/papers/2608.08097) has the eval breakdown worth checking before you trust that number on your own traffic.

Would you trade 0.1–0.7 accuracy points for ~1.7x decode throughput on a reasoning workload — or is your eval harness not yet sharp enough to even see that trade?
