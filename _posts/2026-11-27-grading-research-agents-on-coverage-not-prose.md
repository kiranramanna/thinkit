---
layout: post
title: "Grading Research Agents on Coverage, Not Prose"
date: 2026-11-27 14:06:00 +0000
categories: [rag, agentic-ai, research]
source: hf-papers
source_id: "2611.34852"
discussion_url: https://huggingface.co/papers/2611.34852
source_url: https://arxiv.org/abs/2611.34852
---

The failure I keep seeing in production research agents isn't writing quality — it's silent omission. A report reads clean, cites real sources, and quietly skips an entire branch of the question. DRBench Pro ([arXiv](https://arxiv.org/abs/2611.34852)) is the first eval I've seen built specifically to catch that.

- 🎯 It makes **knowledge coverage the primary target** instead of prose quality — scoring what a report actually explored, not how well it reads.
- 🔍 Rubrics are generated from **knowledge trees built off Wikipedia subgraphs**, so each one maps to a real relation in the domain rather than a vibe-based checklist.
- 📊 Overall coverage is the **geometric mean of breadth and depth** — go deep on one thread and ignore the rest, and the score punishes you. That's the exact failure mode reading the output can't surface.
- ⚠️ Across 144 cases and 44,102 rubrics, the **best of 16 agents reached 57% coverage** — call it half the relevant territory left unexplored.
- ✅ Rubric judgments **track human annotations** and agent rankings stay stable across metric configurations, which is the part that makes the 57% worth trusting.

The [HF paper page](https://huggingface.co/papers/2611.34852) lists all 24 domains. If you operate a RAG or deep-research agent, here's the uncomfortable question: do you measure what your agent covered, or only whether the answer it returned was correct? Those are different tests, and most harnesses only run the second one.
