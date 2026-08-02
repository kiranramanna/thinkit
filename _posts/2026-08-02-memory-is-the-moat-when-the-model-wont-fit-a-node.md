---
layout: post
title: "Memory Is the Moat When the Model Won't Fit a Node"
date: 2026-08-02 14:03:09 +0000
categories: [llm-ops, ai-infrastructure]
hn_id: 49141073
hn_url: https://news.ycombinator.com/item?id=49141073
source_url: https://www.wafer.ai/blog/kimi-k3-mi355x
---

The headline number in [Wafer's Kimi K3 writeup](https://www.wafer.ai/blog/kimi-k3-mi355x) is that AMD's MI355X beats NVIDIA on performance per dollar. The more interesting shift underneath it: frontier open models have gotten big enough that the binding constraint is now *which GPU physically holds the weights*, not which one runs the hottest kernel.

Kimi K3 lands at 2.8T parameters — over 1.5TB of VRAM before you allocate a KV cache for long context. A full B200 node (8 GPUs) can't fit it. That leaves two options: a node of B300s at 288GB per GPU, or burning two B200 nodes on TP16 and eating a cross-node all-reduce right on the decode critical path. The MI355X also carries 288GB, at roughly 2.4× cheaper per GPU than a B300. On their benchmark, 8× MI355X hits 952 tok/s aggregate and 48 tok/s per dollar, versus 33 for the B300 and 7 for the split B200 config. The B300 still wins raw throughput by ~1.65×, but it loses badly once you divide by price.

The part that maps to production reality is the software story. AMD's gap has always been kernels and thin day-0 framework support — real engineering effort, not a spec-sheet problem. Wafer's bet is that coding agents are now closing that gap by writing and tuning kernels, and Kimi K3 shipping with day-0 AMD support suggests it's already underway. That's the LLM-ops lesson hiding inside a hardware benchmark: your moat isn't the accelerator, it's whether your serving stack keeps a 2.8T-param model resident and its KV cache fed without spilling across nodes.

If memory capacity is the real gate, the perf-per-dollar leaderboard will keep flipping every time someone ships a taller HBM stack. The [HN thread](https://news.ycombinator.com/item?id=49141073) argues throughput; I'd watch VRAM per dollar instead. Who actually decides which hardware you're allowed to serve on — the chip vendor, or the lab shipping 2.8T weights?
