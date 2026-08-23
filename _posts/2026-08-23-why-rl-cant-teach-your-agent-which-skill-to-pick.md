---
layout: post
title: "Why RL Can't Teach Your Agent Which Skill to Pick"
date: 2026-08-23 03:03:17 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.18852"
discussion_url: https://huggingface.co/papers/2608.18852
source_url: https://arxiv.org/abs/2608.18852
---

Most agent frameworks now ship skills — instruction files the model reads on demand — and picking which one to read has quietly become one of the highest-leverage decisions in a trajectory. The uncomfortable claim in [SkillGate](https://arxiv.org/abs/2608.18852) is that the obvious way to train that decision, outcome-rewarded RL over the candidate slate, structurally cannot do it.

The mechanism has a name now: selector credit starvation. Under a broadcast, sequence-level advantage, the few tokens that name the chosen skill carry a vanishing share of the loss, and the credit they inherit gets more wrong-signed as the episode grows. A correct skill choice gets punished whenever the execution after it fails — which, on a long horizon, is most of the time. Anyone who has watched an agent's routing get worse as tasks get longer has seen this without a name for it.

The fix is clean: partition the token support into two disjoint credit channels. Outcome credit reaches only execution tokens; a separate action-local advantage reaches exactly the skill-naming tokens, and it goes positive only when a trajectory's single read was the right one. On five agentic benchmarks under a 16-candidate slate, that lifts a 9B policy from 40.8% to 53.2% trial success, cuts exposure to misleading candidates by two-thirds, and reads fewer skills along the way. The [arXiv page](https://arxiv.org/abs/2608.18852) has the credit-channel details; the [HF paper page](https://huggingface.co/papers/2608.18852) is the place to watch for reproductions.

The production takeaway isn't the benchmark delta — it's that "let the outcome reward sort it out" is the wrong instinct for any decision whose signal is only a few tokens wide. Tool selection, retrieval routing, and model fallbacks all have that shape. If the token carrying your agent's most valuable choice is the one your loss function can barely see, how many of its "bad decisions" are actually bad credit assignment?
