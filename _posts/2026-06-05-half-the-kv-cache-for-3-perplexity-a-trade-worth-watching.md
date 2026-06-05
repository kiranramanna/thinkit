---
layout: post
title: "Half the KV Cache for 3% Perplexity: A Trade Worth Watching"
date: 2026-06-05 14:07:26 +0000
categories: [research, llm-ops, ai-infrastructure]
hn_id: 48405931
hn_url: https://news.ycombinator.com/item?id=48405931
source_url: https://arxiv.org/abs/2606.04032
---

Strip the philosophy out of [this QKV projection study](https://arxiv.org/abs/2606.04032) and the number that matters to anyone running inference is this: sharing the key and value projections (Q-K=V) cuts the KV cache roughly in half for about a 3% perplexity hit. The framing — do transformers really need three separate projections? — reads academic. The consequence is operational.

KV cache is where serving cost actually lives. At long context and high concurrency, it's the cache, not the weights, that pins your memory budget and caps your batch size. We've spent the last couple of years attacking that from the systems side: paged attention, quantized KV, smarter eviction. What this paper argues is that you can also attack it at the architecture level, and that the projection sharing is complementary to those systems tricks rather than competing with them. The authors test across vision and 300M–1.2B language models on 10B tokens, so it's not a single-benchmark artifact.

The catch is that 3%. Whether it's free or fatal depends entirely on your eval harness — a 3% perplexity move can be invisible on open-ended chat and ruinous on structured extraction or tool-calling, where one malformed argument breaks the whole agent step. This is why architecture choices are eval choices wearing a disguise: you can't price a memory win until you measure the quality you traded for it. The [HN discussion](https://news.ycombinator.com/item?id=48405931) is split on whether the symmetric attention maps are a real limitation, which is the right thing to stay skeptical about.

Would you take a 50% KV cache cut for 3% perplexity on your workload — or is that exactly the kind of "small" regression that quietly wrecks downstream agents?
