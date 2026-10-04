---
layout: post
title: "When Agent Memory Is Just RAG in Disguise"
date: 2026-10-04 03:07:39 +0000
categories: [agentic-ai, rag, llm-ops]
source: hn
source_id: "49945933"
discussion_url: https://news.ycombinator.com/item?id=49945933
source_url: https://liao.gg/blog/agents-dont-need-memory
---

Kevin Liao's ["Agents Don't Need Memory. They Need Documentation."](https://liao.gg/blog/agents-dont-need-memory) lands because it names what the memory-plugin market keeps dancing around: "memory" is almost always RAG over your own chat transcripts. You chunk session logs into a thousand snippets, embed them, and gamble that top-k injection surfaces the one fact the agent needs this turn. When it misses, the agent doesn't know your project — it knows five lucky fragments.

I've hit this failure mode in production retrieval, and the pathology isn't the vector store, it's the corpus. Conversation transcripts are unstructured, contradictory across time, and reviewed by no one. Documentation inverts every one of those properties: version-controlled, diffable in a PR, and when the agent gets something wrong you fix one file instead of hoping a freshly re-chunked snippet wins the lottery next time. That's not a memory system — it's a knowledge base with provenance, which is what retrieval was supposed to give us before we started pointing it at ourselves.

The part most takes miss: documentation and memory aren't two points on a quality axis, they're different retrieval problems. Stable project knowledge — architecture, conventions, the "why" — belongs in curated docs that the whole team and every agent share. Genuinely episodic state, like what a user tried ten minutes ago, is the narrow slice where per-session memory earns its keep. Conflate the two and you've built a RAG index of your own confusion. The [HN discussion](https://news.ycombinator.com/item?id=49945933) splits right on that seam, with the sharpest pushback coming from people running long-lived agents that really do need episodic recall.

If your agent's "memory" is just embeddings of yesterday's conversations, what breaks if you delete it and write the AGENTS.md instead?