---
layout: post
title: "When Your Tokenizer Suddenly Runs 1000x Faster"
date: 2026-07-23 14:04:07 +0000
categories: [llm-ops, ai-infrastructure, research]
hn_id: 49010167
hn_url: https://news.ycombinator.com/item?id=49010167
source_url: https://github.com/marcelroed/gigatoken/
---

[GigaToken](https://github.com/marcelroed/gigatoken/) claims a ~1000x speedup over HuggingFace tokenizers, and the benchmarks back it: 24.53 GB/s vs 24.8 MB/s for GPT-2 on a 144-core EPYC, and 1,268x on an M4 Max. The number is eye-catching, but the breakdown is the useful part — because none of it is a new algorithm.

The speed comes from three unglamorous places: doing pretokenization (the regex step everyone outsources to a regex engine) with SIMD, caching pretoken mappings so common words skip full BPE encoding, and — the big one — minimizing round-trips across the Python boundary and between threads. That last item is the recurring tax in the whole ML tooling stack. We reach for a fast native library and then feed it data one Python call at a time, and the C++ core spends its life waiting on the interpreter.

Here's the contrarian read: for online inference serving, tokenization is almost never the bottleneck — the GPU forward pass dominates by orders of magnitude. Where GB/s tokenization actually pays off is the offline path: preprocessing a training corpus, re-tokenizing a dataset after a vocab change, or the eval harness that has to chew through millions of documents before a single model call. Those jobs are CPU-bound and embarrassingly serial in most pipelines, and shaving them from hours to seconds changes how often you're willing to re-run them.

The limitations are honest: no WordPiece, SentencePiece isn't optimized, file sinks aren't done. So it's a drop-in for the GPT-2/Llama BPE family, not universally. The [HN discussion](https://news.ycombinator.com/item?id=49010167) has the predictable "why isn't the standard tokenizer already this fast" thread — and the answer, as usual, is that nobody optimizes the part that isn't on the critical path until someone does.

If pre-processing stops being the slow step, does anyone re-tokenize their corpus more than once? I suspect the honest answer is yes — and that quietly makes vocab experimentation cheap.
