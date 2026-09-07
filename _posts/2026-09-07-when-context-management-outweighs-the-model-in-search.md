---
layout: post
title: "When Context Management Outweighs the Model in Search"
date: 2026-09-07 03:09:28 +0000
categories: [agentic-ai, rag, research]
source: hf-papers
source_id: "2609.04304"
discussion_url: https://huggingface.co/papers/2609.04304
source_url: https://arxiv.org/abs/2609.04304
---

The most useful admission in [Iris](https://arxiv.org/abs/2609.04304) isn't the leaderboard — it's that the authors evaluate every benchmark twice, with and without inference-time context management, because that single knob moves the score more than most reported differences between search agents. Hold the tool set, the context limit, and the judge fixed, and the "which model is better" question partly dissolves into "who manages the context window better mid-trajectory."

That reframes how I read agentic-search results. Iris-mini and Iris-pro (35B-A3B and 397B-A17B) post strong BrowseComp / BrowseComp-ZH / DeepSearchQA / HLE numbers as a single ReAct agent — no sub-agents, no test-time verification. In production that constraint is the interesting part: a plain ReAct loop that spends its budget on context hygiene keeps pace with fancier orchestration.

The data recipe is worth stealing even if you never train a model. They reverse-construct multi-hop questions from the hyperlink structure of a web corpus — build an entity graph from a seed page and its out-links, rewrite every non-answer entity into a descriptive reference so nothing resolves by string matching, and admit only questions a reference model fails closed-book but solves once the evidence is supplied. That last filter is a clean definition of a retrieval-dependent question, and it's exactly the eval set most RAG teams lack: queries that are impossible without retrieval and verifiable once you have it.

The training loop ("SFT-RL climbing" — alternate SFT and RL against live search, feed the hardest solved and most efficient rollouts back into the next supervised pass) is the part most teams can't reproduce without a cluster. The eval discipline is the part they can copy today. The [arXiv page](https://arxiv.org/abs/2609.04304) and the [HF paper page](https://huggingface.co/papers/2609.04304) have the full recipe; weights and pipeline are promised.

If context management swings your search-agent benchmark more than the model does, what is your eval actually measuring — the agent, or the harness around it?
