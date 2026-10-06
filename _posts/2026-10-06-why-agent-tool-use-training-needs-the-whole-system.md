---
layout: post
title: "Why Agent Tool-Use Training Needs the Whole System"
date: 2026-10-06 03:07:20 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.36887"
discussion_url: https://huggingface.co/papers/2609.36887
source_url: https://arxiv.org/abs/2609.36887
---

The quiet claim in [WEFT](https://arxiv.org/abs/2609.36887) is one I keep relearning in production: when an agent's tool use underperforms, the model is usually the last thing to blame. Most recent work scales *executable environments* — more tools, more sandboxes — on the theory that richer environments make better agents. WEFT's argument is that the environment is one of four coupled parts: environment, task, agent harness, and evaluator. Scale one in isolation and the learning signal gets noisier, not stronger, because the reward only means something when all four stay coherent.

What makes this more than a framing exercise is the self-evolution loop. WEFT uses execution traces and state evidence to attribute a failure to the component that caused it, revises that component, then runs fresh rollouts to check whether the change actually helped — evidence that feeds the next round. That's the debugging discipline I'd want from a human on-call: don't patch the prompt because it's easy, find which part of the loop produced the bad trace. Two engineering details stand out — atomic-turn credit assignment, so the learning signal lands on the turn that caused the problem instead of smearing across the whole trajectory, and MegaMCP keeping isolated, recoverable state across concurrent rollouts over shared tool services. Anyone who has run parallel agent rollouts against stateful tools knows that second one is where the bodies are buried.

The numbers back the framing: WEFT-14B beats a matched Agent-World-14B baseline by 6.41, 2.23, and 12.27 points on BFCL V4, τ²-Bench, and Claw-Eval, with the larger gains showing up on long-horizon workflow benchmarks. The [arXiv page](https://arxiv.org/abs/2609.36887) has the ablations and the [HF paper page](https://huggingface.co/papers/2609.36887) has the discussion.

My bet: the teams that win at agentic tool use over the next year won't be the ones with the most tools — they'll be the ones who treat the harness and evaluator as part of the model they're training, not scaffolding around it.
