---
layout: post
title: "When BM25 Still Beats Your Dense Retriever"
date: 2026-08-08 14:03:51 +0000
categories: [research, rag, llm-ops]
source: hf-papers
source_id: "2608.05138"
discussion_url: https://huggingface.co/papers/2608.05138
source_url: https://arxiv.org/abs/2608.05138
---

The result worth stealing from a Modern Greek RAG paper has nothing to do with Greek. It's that a parameter-free BM25 baseline beat several off-the-shelf multilingual dense retrievers on specialist corpora — the same retrievers a lot of teams drop into production and never benchmark against plain lexical search.

[Teaching Nemotron Greek](https://arxiv.org/abs/2608.05138) adapts the full Nemotron retrieval stack — corpus mining, embedder training, reranker adaptation, reader fine-tuning — and the numbers show where the effort actually pays. Fine-tuning a 1B embedder on 65,773 in-domain retrieval pairs moves nDCG@10 from 0.362 to 0.835. The out-of-the-box multilingual embedding wasn't a weak retriever; it was a placeholder that happened to return vectors. The adapted cross-encoder reranker then adds consistent gains on top, and a LoRA-tuned reader takes judged answer correctness from 29.4% to 66.9% with better faithfulness and citation quality.

If you serve RAG over legal, financial, or medical corpora in any language that isn't well-covered English, the lesson is the sequence, not the language. Benchmark BM25 first. If your dense retriever can't clear it on your domain, you don't have a retrieval architecture problem — you have an unadapted-embedder problem, and no amount of reranking downstream fixes a first stage that's losing to term frequency. Only after the embedder earns its place does adapting the reranker and reader become the right spend.

The uncomfortable part is that "multilingual" and "specialist-domain" pull in opposite directions: the more general a retriever's pretraining, the more it tends to underperform lexical search exactly where you need it most. The [HF paper page](https://huggingface.co/papers/2608.05138) has the full stack and the HERA benchmark. When was the last time you checked your production dense retriever actually beats BM25 on your own corpus?
