---
layout: post
title: "Why Agents Won't Just Fix Your Fused Kernels"
date: 2026-06-20 14:06:07 +0000
categories: [llm-ops, ai-infrastructure, agentic-ai]
hn_id: 48605355
hn_url: https://news.ycombinator.com/item?id=48605355
source_url: https://ianbarber.blog/2026/06/19/llms-are-complicated-now/
---

Ian Barber's framing lands hard: the Transformer stack that made Llama feel clean has quietly turned into the kind of terrifying graph that recsys engineers have lived with for a decade. Read [his post](https://ianbarber.blog/2026/06/19/llms-are-complicated-now/) and the through-line is clear — attention is no longer one thing. Grouped, compressed, sparse, linear, sliding-window; MoE routing that started in the feed-forward layer and crept into attention blocks and the residual stream; multimodal encoders mixed in rather than bolted on; and inference now sharded across GPUs, which drops communication ops right into the middle of your model.

The interesting claim isn't that models got complicated. It's *why*. The recsys analogy is the part worth sitting with: the complexity didn't come from chasing capability alone, it came from the shrinking gap between performance-as-optimization and performance-as-necessity. Once your fused kernel is load-bearing — once the model won't serve inside the latency budget without it — the "clean" reference definition stops being the thing you actually ship.

This is where I push back on the optimistic agentic story. The pitch is that you hand a PyTorch or JAX definition to an agent and it emits optimally fused kernels. Maybe. But that loop only closes if you have a fixed, trusted baseline to check the generated kernel against — numerically and on latency. In production AI work, that baseline is exactly the thing that erodes as the model gets more complicated. You can't verify "is this faster and still correct?" against a reference you no longer maintain.

The [HN thread](https://news.ycombinator.com/item?id=48605355) leans toward "agents will handle it." I'd flip it: agentic kernel optimization makes a well-specified, continuously-tested baseline more valuable, not less. Who's actually keeping a clean model definition around once the fused version is the only one that meets SLA?
