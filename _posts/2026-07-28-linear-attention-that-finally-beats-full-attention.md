---
layout: post
title: "Linear Attention That Finally Beats Full Attention"
date: 2026-07-28 14:07:17 +0000
categories: [research, llm-ops, ai-infrastructure]
hn_id: 49082022
hn_url: https://news.ycombinator.com/item?id=49082022
source_url: https://arxiv.org/abs/2510.26692
---

Linear attention has spent years as the thing I'd reach for only after giving up on quality to buy throughput. The [Kimi Linear tech report](https://arxiv.org/abs/2510.26692) is interesting because it claims the opposite trade — matching or beating full attention while cutting the memory you pay for at serving time.

- 🎯 **Kimi Delta Attention (KDA)** extends Gated DeltaNet with finer-grained gating, squeezing more out of the finite-state RNN memory that linear attention lives inside.
- ⚡ **Up to 75% less KV cache** and ~6× decoding throughput at 1M context — the numbers that actually move an inference bill.
- 📊 **3B activated / 48B total**, a layerwise hybrid of KDA and Multi-Head Latent Attention that beat full MLA on every evaluated task under an identical training recipe.
- 🔍 The claim that matters for LLM ops is **drop-in replacement**, not a long-context-only special mode — it held up in short-context and RL-scaling regimes too.
- 💡 They open-sourced the KDA kernel and vLLM implementation, so the throughput number is checkable rather than a benchmark screenshot.

KV cache is the quiet line item that decides how many concurrent agent sessions a single GPU can hold. If a hybrid linear stack really gives back three-quarters of it without a quality tax, the math for long-horizon agentic workloads — where context just keeps growing — shifts more than any single benchmark suggests. The [HN discussion](https://news.ycombinator.com/item?id=49082022) is already poking at the "under fair comparisons" caveat, which is exactly the right thing to poke at. Does the drop-in claim survive contact with a real 1M-context agent loop, or does the delta rule start forgetting things full attention would have kept?
