---
layout: post
title: "Choosing a Multi-Agent Harness Without Running It First"
date: 2026-10-06 14:08:35 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.04137"
discussion_url: https://huggingface.co/papers/2610.04137
source_url: https://arxiv.org/abs/2610.04137
---

Most multi-agent systems are built once and reused for every query. [SHIFT](https://arxiv.org/abs/2610.04137) makes the harness — the roles, instructions, tools, and communication structure — a per-query decision, which matches what I keep running into: the right orchestration for a lookup is wrong for a multi-step document task, and a fixed harness pays for that mismatch on every single call.

The clever move is where they put the cost. Tailoring a harness per query normally means executing candidate designs to see which one wins — expensive and slow at inference. SHIFT trains a local LLM "architect" to predict the utility of harness-building actions from past executions, balancing accuracy against execution cost, then runs Monte Carlo tree search over those predictions instead of over real runs. Execution leaves the per-query loop entirely. Across 9,193 tasks in six benchmarks it beat 17 baselines spanning prompting, prompt optimization, and workflow search by 7.2 points — and a cheaper mode still topped every baseline while spending 32% fewer execution tokens.

Two findings land directly on how I think about agent orchestration. First, choosing structure, instructions, and tools *jointly* beats choosing any one alone by up to 9.1 points — the knobs interact, so optimizing tool selection in isolation leaves accuracy on the table. Second, a learned value function finds cheaper and more accurate harnesses from the same candidate pool, which is the part that matters when you're staring at a token budget and an SLA. Predicting a design's value without paying to run it is the same problem I hit when deciding how many agents a request actually needs. The [arXiv page](https://arxiv.org/abs/2610.04137) has the SHIFT-search versus SHIFT-value split and the [HF paper page](https://huggingface.co/papers/2610.04137) has the discussion.

The open question I'd want answered before trusting this in production: how well does an architect trained on one executor's measured utilities transfer when you swap the underlying model out from under it?
