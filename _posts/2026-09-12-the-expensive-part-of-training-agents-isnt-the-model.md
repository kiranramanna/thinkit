---
layout: post
title: "The Expensive Part of Training Agents Isn't the Model"
date: 2026-09-12 03:11:00 +0000
categories: [research, agentic-ai, llm-ops]
source: hf-papers
source_id: "2608.12564"
discussion_url: https://huggingface.co/papers/2608.12564
source_url: https://arxiv.org/abs/2608.12564
---

Most agent-RL papers sell you a bigger model or a cleverer reward. [WMRL](https://arxiv.org/abs/2608.12564) makes a quieter, more useful point: when you train research agents with RL, the money doesn't go where you think. Token generation batches across the whole rollout and shares compute; environment execution doesn't — every trajectory gets its own sandbox and burns real machine time, and as tasks grow longer that execution becomes the dominant training cost. The bottleneck is the world, not the policy.

Their fix is to stop running the world. WMRL replaces environment execution with a learned world model, then patches the two things that would otherwise wreck training — a debiasing term for the model's systematic errors and inverse-variance denoising for its noise. The payoff is 3-4x faster training, and post-trained 4B and 9B agents that beat open-weight 48B and 120B agents on held-out tasks. The [HF paper page](https://huggingface.co/papers/2608.12564) has the ablations if you want to see how much of that hangs on the two mitigations.

I don't train 120B agents, but this reframes something that shows up in every agent system I do run: the eval and training loop is bottlenecked by the environment — spinning up sandboxes, calling real tools, waiting on verifiers — long before it's bottlenecked by the LLM. A world model good enough to stand in for execution is a strong claim, and that debiasing scaffolding is doing a lot of load-bearing work. The interesting question is where the simulation quietly diverges from reality, because the failure mode isn't slow training — it's an agent that's sharp against the model of the world and useless against the real one. How would your eval even catch that?
