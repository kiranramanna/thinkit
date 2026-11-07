---
layout: post
title: "Rewrite the Reasoning You Already Paid For"
date: 2026-11-07 14:11:09 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.03852"
discussion_url: https://huggingface.co/papers/2611.03852
source_url: https://arxiv.org/abs/2611.03852
---

Most "cheaper reasoning" work asks the model to think differently next time — shorter chains, latent tokens, a distilled habit. [This paper](https://arxiv.org/abs/2611.03852) does something more operational: it rewrites the reasoning the agent has *already produced* into a compact state record, right before the next tool result comes back, and measures what that does downstream. No retraining, no new decoding scheme — just compaction applied to history at the one seam in an agent loop where it's cheap to intervene.

The timing is the trick. In a tool-using agent, every pending observation is about to be concatenated onto a reasoning trace that keeps growing; compact the history first and the continuation reasons over fewer tokens from then on. The authors find accepted compact histories usually shorten future reasoning, and a coding case study shows less repeated verification once a candidate solution is shared across steps — exactly the waste I watch agents commit, re-deriving "did I already check this?" on every turn. In software-agent deployments it can cut total spend.

The honest part is the asterisk: the rewrite itself costs tokens, and both retained quality and rewrite-inclusive latency depend on which model compresses and which continues — so this is a per-model policy, not a free switch. That lands it squarely in eval-harness territory. You can't adopt compaction without measuring retained capability alongside the token savings, or you'll ship an agent that's cheaper and quietly dumber. The [HF paper page](https://huggingface.co/papers/2611.03852) is where I'll watch for whether anyone reports a compressor/target pairing that actually nets out positive. If rewriting your agent's own scratchpad is this effective untrained, how much of your reasoning bill is just the model talking to itself?