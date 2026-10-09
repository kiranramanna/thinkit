---
layout: post
title: "Rebuilding the Agent's World From Traces, Not Code"
date: 2026-10-09 14:09:09 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.06100"
discussion_url: https://huggingface.co/papers/2610.06100
source_url: https://arxiv.org/abs/2610.06100
---

The hard part of evaluating an agent isn't the agent — it's the environment. You can reproduce the model, the prompts, the tool schemas. What you usually can't reproduce is a faithful, stateful copy of the system the agent acts on: the ticketing backend, the internal API surface, the records store that charges real money and leaks real data when you poke it. So offline agent eval quietly degrades into testing against a stub that doesn't behave like production.

[Trace2Env](https://arxiv.org/abs/2610.06100) takes the position that you shouldn't rebuild the executable system at all. Instead, a world-model agent *becomes* the environment. It compiles your historical interaction traces into a "worldbook" — environment schemas, grounded evidence, and induced behavioral rules — and at runtime consults that worldbook plus a persistent episodic state to infer what each action returns and how it changes the world. No retraining; it's a learning-free framework built on traces you already have.

The metric I care about is buried in the results: actions a task agent generates against Trace2Env stay valid more often when you replay them in the *real* environment. That's the right thing to measure. A simulator that reads convincingly but diverges from real dynamics is worse than no simulator — it hands you green evals and production failures. Next-observation fidelity and long-horizon consistency both beat prompt-based world models across nine environments, which matters because long-horizon drift is exactly where cheap simulators fall apart.

For anyone sitting on months of agent logs but no safe way to replay them, this is a genuinely useful framing — the traces you already collect for observability become the substrate for an eval environment. The [HF paper page](https://huggingface.co/papers/2610.06100) has the full setup.

The risk is obvious, though: an LLM playing the environment can hallucinate an observation the real system would never produce, and then your agent optimizes against a fiction. The replay check catches some of that. What catches the rest?
