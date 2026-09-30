---
layout: post
title: "Agentic Search Just Rediscovered the Knowledge Graph"
date: 2026-09-30 14:09:23 +0000
categories: [rag, knowledge-graphs, research]
source: hf-papers
source_id: "2609.37226"
discussion_url: https://huggingface.co/papers/2609.37226
source_url: https://arxiv.org/abs/2609.37226
---

Give an LLM agent a big document collection as a flat pile of files and it does the obvious thing: search, read, search again, and rediscover the same relationships between documents on every single query. [CorpusMap](https://arxiv.org/abs/2609.37226) points out how wasteful that is and fixes it in the least surprising way possible — by precomputing an entity graph offline.

The construction is plain: find recurring entities in the corpus, resolve mentions that refer to the same thing across documents, and build an Entity Page per entity that aggregates what every document says about it and links back to each one. The agent traverses that entity-document graph instead of rediscovering cross-document links at inference time. Across 7 models and 3 datasets it improves evidence discovery and answer quality while spending fewer tokens, and beats four other navigation layers.

If that sounds familiar, it should. This is knowledge-graph-enhanced retrieval wearing an "agentic search" label. A lot of RAG discourse over the last two years argued that letting an agent roam a raw corpus would make structured indexes obsolete. It didn't. The moment you care about multi-hop evidence — a project's approval in one doc, its requirements in another, its status in a third — you need something that already knows those documents are connected, and entity resolution is a cheap, durable way to encode that connection once instead of paying for it per query.

The part I'd stress-test is entity resolution quality. An Entity Page is only as good as the coreference behind it; conflate two people who share a name, or split one product across three surface forms, and the navigation layer confidently routes the agent to the wrong evidence. The [HF paper page](https://huggingface.co/papers/2609.37226) has the full setup.

So here's the question for anyone running agentic retrieval in production: if the winning move is a precomputed entity graph, how is that different from the KG index you were just told to throw away?
