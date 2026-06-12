---
layout: post
title: "When Grep Beats Your Vector Store in the Agent Loop"
date: 2026-06-10 03:04:44 +0000
categories: [agentic-ai, rag, research]
hn_id: 48460863
hn_url: https://news.ycombinator.com/item?id=48460863
source_url: https://arxiv.org/abs/2605.15184
---

The sharper claim in [this paper](https://arxiv.org/abs/2605.15184) isn't that grep can hold its own against vector retrieval — it's that the agent harness wrapped around the retriever decides which one wins. The authors pit grep against vector search on a LongMemEval sample, run it through provider-native CLIs (Claude Code, Codex, Gemini CLI) plus their own Chronos harness, and vary the thing most RAG benchmarks quietly ignore: how a tool result reaches the model — inline in the context window, or written to a file the agent opens on its own.

That second axis is exactly where production agentic search leaks performance. Teams spend weeks tuning rerankers and hybrid-search weights, then watch the gains evaporate because the loop pastes thousands of tokens of tool output inline and the model fixates on the first hit. The paper also stresses what happens as irrelevant surrounding text grows — the failure mode every long-context agent meets once real corpora replace clean eval sets. Grep winning in some of these setups isn't a knock on embeddings; it's a sign that retrieval quality and result presentation are separate problems we keep collapsing into one.

The practical takeaway: benchmark your retriever inside the harness you actually ship, not in a notebook. A reranker that looks great in isolation can lose to plain substring search once the agent has to read, page, and reason over the output. The [HN thread](https://news.ycombinator.com/item?id=48460863) has the predictable "vectors are overrated" takes, but the real lesson is narrower — measure the loop, not the component. If grep beats your vector store in your harness, is that a retrieval result or a context-engineering bug you haven't found yet?
