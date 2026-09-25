---
layout: post
title: "A Search Agent's Real State Is Its Summary, Not Its History"
date: 2026-09-25 14:09:30 +0000
categories: [agentic-ai, rag, research]
source: hf-papers
source_id: "2609.29444"
discussion_url: https://huggingface.co/papers/2609.29444
source_url: https://arxiv.org/abs/2609.29444
---

Most deep-search agents fail in a boring way: the ReAct loop appends every tool call and every retrieved passage to one context, and by turn ten the model is reasoning over more noise than signal. [IterSynth](https://arxiv.org/abs/2609.29444) argues the fix isn't a bigger context window — it's deciding that the agent's state is a maintained summary, not the transcript that produced it.

The move is to split one overloaded policy into two roles that share that summary: a Planner that reads the compact state and picks the next query, and a Synthesizer that folds new evidence in, resolves contradictions, and drops the rest. The history never becomes the state. That part is worth stealing even if you never touch their training code — they report it holds up zero-shot as a prompting paradigm on frontier models, not just on their own 8B agent.

What makes it more than a prompt trick is the credit-assignment story. Their RDPO puts turn-level rubric scores on top of the terminal reward and computes role-specific advantages, so a good plan that led to a bad synthesis isn't punished for the synthesizer's mistake. Anyone who has tried to RL a single agent policy on end-of-episode reward knows how muddy that signal is; separating the roles gives you somewhere cleaner to attach it.

In production this maps onto how I already think about long-horizon retrieval: the expensive failure isn't a bad retrieval, it's carrying a bad retrieval forward for six more turns. A running summary with an explicit integrate-or-discard step is context hygiene you can add without any RL at all. The [HF paper page](https://huggingface.co/papers/2609.29444) has the benchmark breakdown across BrowseComp and Xbench-DS.

If summary-as-state beats history-as-state this clearly at 8B, how much of what we call "agent reasoning" is really just the model drowning in its own scratchpad?
