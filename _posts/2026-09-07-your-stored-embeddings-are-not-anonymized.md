---
layout: post
title: "Your Stored Embeddings Are Not Anonymized"
date: 2026-09-07 03:09:28 +0000
categories: [rag, llm-ops]
source: hn
source_id: "49590595"
discussion_url: https://news.ycombinator.com/item?id=49590595
source_url: https://arxiv.org/abs/2505.12540
---

For years the quiet assumption in RAG infrastructure was that a vector store holds "just numbers" — strip the source text, keep the embeddings, and you've de-identified the corpus. [vec2vec](https://arxiv.org/abs/2505.12540) says that assumption is wrong, and it's the kind of wrong that surfaces in a breach postmortem.

The result underneath the [HN discussion](https://news.ycombinator.com/item?id=49590595): you can translate embeddings from one model's space into another's with no paired data, no access to either encoder, and no known matches. The method leans on a strong form of the Platonic Representation Hypothesis — that models trained on similar objectives converge to the same latent geometry — then exploits that shared geometry to align the spaces unsupervised. The payoff for an attacker is direct: given only a dump of embedding vectors, translate them into a model you do control and run attribute inference and classification against the underlying documents. Vectors you assumed were opaque become queryable.

This lands differently depending on where you sit. If you run a multi-tenant vector store, "we only persist embeddings" stops being a privacy control you can wave at a security review — it's closer to storing lightly obfuscated text. The same geometry that makes this an attack also has a benign use: migrating a corpus between embedding models without re-embedding from source, which is a genuine operational headache every time you swap a reranker or upgrade an encoder. The uncomfortable part is that the migration tool and the exfiltration tool are the same tool.

The reaction has settled less on "is this real" and more on "what now." [kidukkang](https://kidukkang.github.io/blog/harnessing-the-universal-geometry-of-embeddings/) calls the theory compelling but is alarmed that attribute inference and zero-shot inversion work from embeddings alone; [Ian Barber](https://ianbarber.blog/2025/06/28/harnessing-the-universal-geometry-of-embeddings/) is more measured — a fascinating result, but tested mostly on English contrastive transformer encoders, so "universal" is doing some heavy lifting — while still flagging the enterprise privacy risk. The most telling response is operational: a [LanceDB discussion](https://github.com/lancedb/lancedb/discussions/2402) where developers treat it as a real threat model and start asking what defenses a vector database should ship. When the vector-store maintainers, not just the paper's authors, are the ones worrying, the finding has crossed from interesting to actionable.
