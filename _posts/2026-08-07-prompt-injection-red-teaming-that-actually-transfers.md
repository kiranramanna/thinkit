---
layout: post
title: "Prompt-Injection Red Teaming That Actually Transfers"
date: 2026-08-07 14:07:37 +0000
categories: [research, agentic-ai, llm-ops]
source: hf-papers
source_id: "2608.05108"
discussion_url: https://huggingface.co/papers/2608.05108
source_url: https://arxiv.org/abs/2608.05108
---

The recurring problem with automated prompt-injection red teaming isn't finding one working attack — it's that the attacker you trained against last quarter's model is worthless against this quarter's. Most state-of-the-art methods train an RL attacker end-to-end against a specific target, and that policy overfits: swap the target LLM and attack success rate falls off a cliff. [PIMiner](https://arxiv.org/abs/2608.05108) reframes the job as building a *strategy library* rather than a model.

During training it sees a sequence of (dataset, target model) pairs and accumulates reusable strategies from scratch. At test time that library transfers to a previously unseen target with no additional training and only about ten queries per sample. The numbers are worth staring at: on IPIArena it lands 76.2% ASR against Gemini-2.5-Pro, 61.9% against GPT-5.1, and 42.9% against Claude-Sonnet-4.5; AgentDojo tells the same story. For anyone operating agents, a transferable attacker is a standing eval asset, not a one-off exercise — you can wire it into CI and rerun it every time you change a tool, a system prompt, or a model version, which is exactly when an injection hole silently reopens.

Two numbers stick with me. First, even the most robust target still eats north of 40% ASR — "we added a guardrail" is not a state you get to declare finished. Second, ~10 queries per sample makes continuous testing cheap, and cheap is what determines whether a defense gets tested on every release or once at launch. The [HF paper page](https://huggingface.co/papers/2608.05108) has the training setup.

If your agent's injection posture is only ever probed by a red team that retrains per model swap, how would you ever notice the release that quietly reopened the hole?
