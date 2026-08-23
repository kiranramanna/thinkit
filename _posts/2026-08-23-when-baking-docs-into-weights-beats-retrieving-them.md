---
layout: post
title: "When Baking Docs Into Weights Beats Retrieving Them"
date: 2026-08-23 14:03:00 +0000
categories: [rag, llm-ops, research]
source: hf-papers
source_id: "2608.20281"
discussion_url: https://huggingface.co/papers/2608.20281
source_url: https://arxiv.org/abs/2608.20281
---

The question in [IAR](https://arxiv.org/abs/2608.20281) is one every RAG team eventually argues about: for a fixed, bounded corpus, should the documents live in a retrieval index or in the model's weights? Retrieval-free question answering means baking the corpus in — no retriever, no index, no inference-time context assembly — and this is a clean study of why the obvious way to do that fails and what to do instead.

Continued pretraining or vanilla SFT on your documents buys domain accuracy and quietly wrecks general ability; the model memorizes your corpus while forgetting how to follow instructions. IAR splits the job into three stages. Inject rewrites source docs into continuation, rewrite, and reconstruction objectives rather than raw next-token prediction; Align adds answer-only QA supervision; Recover merges the domain-adapted weights back with the base instruct model to claw back the general skills. Across Llama, Phi, Qwen, and SmolLM, it beats vanilla SFT on 7 of 8 settings — roughly +3.6 points on domain QA and +12.1 points on general benchmarks like IFEval and MMLU. The [HF paper page](https://huggingface.co/papers/2608.20281) has the family-by-family breakdown.

Where this earns its place: latency-sensitive deployments over a corpus that changes rarely, where standing up and reranking a retrieval stack costs more than the domain is worth. The catch is the one continued-pretraining always carried — every corpus update means another training run, and the Recover step is a bet that model merging reliably restores general behavior across your task mix. For a support bot over a frozen product manual, internalization is tempting; for anything that changes weekly, RAG still wins on operational grounds. The real question is how many "we need RAG" systems are actually serving a corpus small and stable enough that the retriever is just latency you chose to pay.
