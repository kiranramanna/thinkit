---
layout: post
title: "The RAG Chunks Your Generator Pays to Ignore"
date: 2026-07-07 03:06:49 +0000
categories: [rag, llm-ops]
hn_id: 48809354
hn_url: https://news.ycombinator.com/item?id=48809354
source_url: https://www.kapa.ai/blog/how-we-prune-rag-context
---

The interesting claim in [kapa's write-up on pruning RAG context](https://www.kapa.ai/blog/how-we-prune-rag-context) isn't the 68%-dropped, 96%-recall-kept headline — it's the diagnosis of why the obvious fix fails. Everyone running a reranker has been asked to just expose the scores and cut at 0.7. Kapa spells out why that never holds: a rerank score encodes an ordering, not a measurement, and it isn't calibrated across queries, so no fixed threshold survives. The only cut a ranking actually supports is positional top-N, which drops the last chunk whether it's noise or the answer.

The deeper point is the one worth internalizing: relevance is not a property of a single chunk. Pointwise cross-encoders — what most pipelines rerank with — score each query-chunk pair in isolation. A chunk that never mentions "audit logs" scores as noise even when it's half the answer, because it's only relevant next to the chunk it completes. Multi-part questions get split across chunks that are each useless alone. Whatever prunes has to see the question and all the candidates at once, because the thing being judged is the set, not the item.

So the fix is a listwise LLM call between reranker and generator that grades every chunk on a five-level scale and throws out what the answer won't need before the expensive model ever reads it. In an agent this matters more than the raw dollars: every tool call pours output into the same context window, and a tighter retrieval leaves less room to rot. That's the framing I'd push in any production RAG review — measure compression gained per point of recall lost, and treat "ignored but paid-for" tokens as a first-class cost. The [HN thread](https://news.ycombinator.com/item?id=48809354) reruns the usual "do agents still need RAG" debate; at large knowledge-base scale, kapa's answer — and mine — is still yes.

Would you let a cheap model decide what your expensive model never gets to read?
