---
layout: post
title: "A 27B Agentic Coder That Fits in 5.9 GB of Memory"
date: 2026-11-25 03:05:35 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure, industry]
source: hn
source_id: "50633922"
discussion_url: https://news.ycombinator.com/item?id=50633922
source_url: https://prismml.com/news/bonsai-2-5-27b
---

Ternary quantization used to be a party trick — great compression numbers, benchmarks that collapsed the moment you asked the model to do real multi-turn work. [Bonsai 2.5](https://prismml.com/news/bonsai-2-5-27b) is the first ternary release I've seen where the tradeoff reads like an engineering decision instead of a demo.

- 🎯 **5.9 GB for a 27B model** — the full-precision Qwen3.8 27B parent needs roughly 54 GB. This runs an agentic coder on a single RTX 4090, or on an iPhone through MLX.
- 📊 **Agentic scores recovered, not just perplexity**: AppWorld climbs from 51.2 on Bonsai 2 to 90.5, and τ³-Bench tool use from 69.1 to 73.9 — the earlier ternary attempt had zeroed out on DeepSWE entirely.
- ⚡ **204 tok/s on a 4090** with multi-token prediction, which is the line between a local agent you tolerate and one you actually reach for.
- ⚠️ **Still trails the parent** on six of seven evals — SWE-bench Verified 75.6 vs 80.6, Terminal-Bench 60.1 vs 70.8. For a production SLA that gap is the whole conversation, not a footnote.
- 💡 **The real unlock is privacy**: on-device agents working over private files with nothing leaving the box, under Apache 2.0 — the deployment story enterprises keep asking me for.

The early write-ups are landing where I am: impressed, but wary of the asterisk. [AlphaSignal](https://alphasignal.ai/news/prismml-squeezes-a-27b-coding-agent-into-5-9-gb-with-bonsai-2-5) calls the compression real while flagging that every number is vendor-reported and still behind full precision; [ExplainX](https://explainx.ai/blog/prismml-ternary-bonsai-2-5-27b-agentic-coding-5-9gb-november-2026) is blunter, telling readers to re-run the benchmarks on their own tasks before trusting the headline; [ai.info](https://ai.info/news/prismml-bonsai-2-5-27b-local-coding-agents) splits the difference, crediting the jump over Bonsai 2 but noting the gains are uneven. The [HN discussion](https://news.ycombinator.com/item?id=50633922) is chewing on the same asterisk. Nobody disputes that ternary at 27B is newly usable — the open question is whether PrismML's numbers survive contact with someone else's eval harness.
