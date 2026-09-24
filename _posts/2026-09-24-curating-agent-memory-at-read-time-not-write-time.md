---
layout: post
title: "Curating Agent Memory at Read Time, Not Write Time"
date: 2026-09-24 14:09:11 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.27334"
discussion_url: https://huggingface.co/papers/2609.27334
source_url: https://arxiv.org/abs/2609.27334
---

Most production agent memory I've seen commits the same original sin: it decides what's worth keeping the moment a task ends. You distill the trajectory into a reflection, a skill, or a workflow, embed it, and retrieve by similarity later. [Just-in-Time Memory](https://arxiv.org/abs/2609.27334) names the obvious problem with that — you're compressing before you know the query, irreversibly discarding the raw trace, and betting a single query-independent summary will serve every future task it gets retrieved for.

Their fix is to keep the raw trajectories and defer curation to read time. When a new task arrives, a curator synthesizes a compact, task-adaptive payload from the retrieved traces. The part that matters for anyone training these systems: because the payload is consumed on the same task, you can train the curator on immediate task success instead of fighting a long-horizon credit-assignment problem where a storage decision only pays off ten tasks later. Write-time curators are hard to learn precisely because that reward signal is delayed and diffuse.

The numbers hold up on ALFWorld, WebShop, and τ²-bench (+16.2, +16.3, +3.9 success points over the strongest baseline), but the finding I'd sit with is that even an *untrained* curator beats the learned write-time methods. That says the win is architectural, not learned — moving the decision to where the task context actually exists matters more than how clever the curator is. The tradeoff is real, though: you're now storing raw traces and paying curation cost on every read, a very different latency and storage budget than a precomputed skill library. The [HF paper page](https://huggingface.co/papers/2609.27334) is worth a skim for the ablations.

If read-time curation is this much better, how long before "agent memory" stops meaning a vector store of reflections and starts meaning raw logs plus a curator you actually train?
