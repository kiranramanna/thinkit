---
layout: post
title: "Give the Agent a Ledger, Not a Bigger Context Window"
date: 2026-10-08 14:09:02 +0000
categories: [agentic-ai, rag, llm-ops, research]
source: hf-papers
source_id: "2610.10444"
discussion_url: https://huggingface.co/papers/2610.10444
source_url: https://arxiv.org/abs/2610.10444
---

The failure mode in [RunningTab](https://arxiv.org/abs/2610.10444) is one I've watched eat long agent runs: the agent lists a dozen files, reads most of them, extracts a figure — and still ships the report without that figure. Nothing dropped it on purpose. The requirement, the files read, and the files listed-but-never-opened all slid out of the context window without leaving a trace.

The fix isn't a bigger context window or a smarter prompt. It's an environment-side tab: a per-task ledger the environment keeps alongside the agent, not inside the model. The agent writes down what the task owes; the environment records every file it reads as an excerpt with provenance, and every file it listed but never opened as a candidate. The agent then sees each requirement next to its best-matching excerpts and top unopened candidates, resolves it or sets it aside with a stated reason, and gets a finish check if it tries to wrap up with requirements still open. Across three benchmarks and three LLMs it beat plain direct-corpus interaction and — the result that matters — beat baselines that kept the same record inside the model.

That last comparison is the whole argument. We keep asking agents to track their own task state in-context, and it keeps failing silently on long trajectories because there's no durable record of what was promised versus what was delivered. Moving the ledger out of the model, with provenance on every read, is the same discipline I'd want on any production agent that touches a real corpus — and it does it with no index to build or keep fresh. The [arXiv page](https://arxiv.org/abs/2610.10444) has the benchmark breakdown and the [HF paper page](https://huggingface.co/papers/2610.10444) has the discussion.

If an external task ledger with a finish check reliably beats in-context tracking, how much of what we currently throw context window at is really just missing bookkeeping?
