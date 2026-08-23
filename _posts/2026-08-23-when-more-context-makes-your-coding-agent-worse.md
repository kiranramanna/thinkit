---
layout: post
title: "When More Context Makes Your Coding Agent Worse"
date: 2026-08-23 14:03:00 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.19799"
discussion_url: https://huggingface.co/papers/2608.19799
source_url: https://arxiv.org/abs/2608.19799
---

The most useful result in [SWE-bench Science](https://arxiv.org/abs/2608.19799) isn't that coding agents struggle with scientific software — it's a paired ablation buried in the analysis. Giving the agent explicit scientific guidance is *not* uniformly helpful: well-grounded domain context improves repair accuracy and token efficiency, but poorly aligned guidance induces anchoring and can make exact-repair success worse than handing the agent nothing at all.

That's a context-engineering finding dressed up as a benchmark. Anyone running retrieval into an agent loop has felt it — inject a plausible-but-slightly-wrong snippet and the model commits to it harder than it would have committed to reasoning from scratch. The benchmark makes it measurable: 119 repository-level tasks across 98 real GitHub repos and 20 scientific domains, split into issue-driven, expert-exploratory, and engineering-integration paradigms. Even Claude Code on Opus-5 (max) lands below 50% pass@1. The four recurring failure modes — missing scientific abstraction, surface-level repair, incomplete integration, and no generalization beyond seen cases — are the ones you'd list for any agent working a large, unfamiliar codebase, science or not.

What I'd take back to production: retrieval precision matters more than recall once an agent is in the loop. A reranker that admits a confidently-wrong passage is worse than one that returns nothing, because the agent anchors on the bad passage instead of ignoring the gap. If your eval harness measures whether the right context was retrieved but never whether wrong context got rejected, you're grading half the system. The [HF paper page](https://huggingface.co/papers/2608.19799) is where agent submissions will show up. If a misaligned hint can drag a frontier model below its own no-context baseline, how sure are you that your production RAG context is helping rather than just anchoring?
