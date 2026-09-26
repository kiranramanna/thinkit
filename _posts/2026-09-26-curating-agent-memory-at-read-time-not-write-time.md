---
layout: post
title: "Curating Agent Memory at Read Time, Not Write Time"
date: 2026-09-26 03:07:55 +0000
categories: [agentic-ai, rag, research]
source: hf-papers
source_id: "2609.27334"
discussion_url: https://huggingface.co/papers/2609.27334
source_url: https://arxiv.org/abs/2609.27334
---

The sharp claim in [JitMem](https://arxiv.org/abs/2609.27334) isn't the benchmark numbers — it's that write-time memory curation has been solving the wrong problem all along. Distilling a finished trajectory into a reflection, workflow, or "skill" forces the system to decide what matters before it knows the next task, then retrieve that frozen artifact by similarity. JitMem keeps the raw traces and curates them at read time, once the query is actually in hand.

- 🎯 **Read-time curation** synthesizes a compact, task-adaptive payload from retrieved traces per query — no query-independent summary straining to serve every possible future.
- 💡 **The training win is the real story**: consuming the payload on the same task collapses a long-horizon credit-assignment problem into a single-step objective you can train straight from task success.
- 📊 **The gains hold up**: +16.2 and +16.3 success-rate points on ALFWorld and WebShop, +3.9 on τ²-bench, over the strongest write-time baseline.
- 🔍 **Even an untrained curator** beats those baselines — the read-time framing itself carries most of the lift, not the learned policy on top of it.
- ⚠️ **The bill lands on storage and retrieval**: keeping raw trajectories losslessly means your retrieval layer now eats everything write-time distillation used to throw away.

This lines up with something RAG teams learned the hard way: premature summarization is where recall goes to die. The same instinct that keeps you storing raw chunks instead of pre-summarized ones applies cleanly to agent memory. The [HF paper page](https://huggingface.co/papers/2609.27334) has the curator details. The open question for production is whether read-time synthesis stays inside a per-step latency budget once your trajectory store is millions of traces deep — not three tidy benchmarks.
