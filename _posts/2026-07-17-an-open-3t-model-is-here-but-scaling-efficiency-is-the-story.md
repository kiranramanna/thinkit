---
layout: post
title: "An Open 3T Model Is Here, but Scaling Efficiency Is the Story"
date: 2026-07-17 03:03:37 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 48935342
hn_url: https://news.ycombinator.com/item?id=48935342
source_url: https://www.kimi.com/blog/kimi-k3
---

The headline number is 2.8 trillion parameters. The number I actually care about is 2.5×.

Moonshot's [Kimi K3 announcement](https://www.kimi.com/blog/kimi-k3) is careful to say the model still trails Claude Fable 5 and GPT 5.6 Sol on their own eval suite. That honesty is the tell — this isn't a "we beat the frontier" release, it's a scaling-efficiency release. The claim is that Kimi Delta Attention, Attention Residuals, and a sparser MoE (16 of 896 experts active) convert compute into capability roughly 2.5× more efficiently than K2. For anyone running open weights in production, efficiency-per-FLOP is the line item that decides whether a 3T-class model is a research curiosity or something you can actually serve.

Two operational details stand out. First, the weights don't land until July 27 — so today's benchmarks are Moonshot's, not yours, and the real eval work (long-horizon coding, the 1M-token context, native vision) starts when the community can reproduce it. Second, "16 of 896 experts" paired with a million-token context is a routing-and-KV-cache problem before it's a quality problem. In an agentic loop that sustains long engineering sessions, your serving cost is dominated by how that sparsity and context interact with batch scheduling, not by the parameter count on the box.

I keep landing on the same production question with every open frontier release: can my eval harness tell the difference between "the model got better" and "the model got cheaper to run at the same quality"? Those are different wins, and they route to different parts of the stack. The [HN thread](https://news.ycombinator.com/item?id=48935342) is already arguing about the first; I'd bet the second decides who ships this in six months.

Will an open 3T-class model change your architecture, or just your bill?
