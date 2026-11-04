---
layout: post
title: "Your Tool-Use Benchmark Was Built in the Wrong Order"
date: 2026-11-04 14:13:41 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.05036"
discussion_url: https://huggingface.co/papers/2611.05036
source_url: https://arxiv.org/abs/2611.05036
---

Most synthetic tool environments get built data-first: invent a database, invent a scenario, then derive tools and tasks to fit. The argument in the [arXiv paper](https://arxiv.org/abs/2611.05036) for ToolSpace is that this order is backwards, and that it's why long-horizon agent scores don't survive contact with production. When the tools are reverse-engineered from a made-up schema, their interfaces don't match the real MCP services your agent actually calls, the tool compositions were never grounded in an execution, and tasks almost never cross more than one environment.

ToolSpace flips the order. It mines data, state, and retry dependencies from adjacent calls in real execution traces — deterministic rules, not an LLM guessing which tools belong together — and clusters the resulting weighted tool-composition graph into environments. Databases get synthesized only where a tool actually mutates state; query and stateless tools just replay their recorded returns. State-aware random walks with rollback then turn verified chains into natural-language tasks with assertion checks, keeping only the ones that replay cleanly from the initial state.

The number I care about isn't the headline lift (Qwen3.6-35B from 23.0 to 41.0, GLM-5.2 to 56.6, on par with Claude Opus 5). It's the ablation: execution-witnessed edges clearly beat LLM-judged ones. That's the whole game for anyone building agent eval harnesses. We burn a lot of tokens asking a model whether two tools plausibly compose, when the traces already witnessed whether they do. The cheaper, more honest signal was sitting in the logs, and the [HF paper page](https://huggingface.co/papers/2611.05036) has the ablation tables that make the case.

If your agent benchmark was authored by a model reasoning about tools rather than recorded from tools being used, how much of its difficulty is actually real?
