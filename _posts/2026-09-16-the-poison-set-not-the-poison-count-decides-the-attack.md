---
layout: post
title: "The Poison Set, Not the Poison Count, Decides the Attack"
date: 2026-09-16 03:11:40 +0000
categories: [llm-ops, agentic-ai, research]
source: hf-papers
source_id: "2609.15029"
discussion_url: https://huggingface.co/papers/2609.15029
source_url: https://arxiv.org/abs/2609.15029
---

The finding that matters in [this poisoning paper](https://arxiv.org/abs/2609.15029)
isn't the attack — it's that the standard way we measure the attack is broken.
Fix the model, the clean data, and the number of poisoned examples, and backdoor
success still swings from 3% to 80% depending only on which poisoned examples you
pick. If your safety eval samples a poison set at random and reports the number,
you're reporting one point on a very wide distribution and calling it the risk.

That's a governance problem before it's a research one. Most fine-tuning security
reviews I've seen run on a poison-count threat model: how many bad rows would it
take? The paper's SAILS method shows count is close to irrelevant next to
composition — it learns a set scorer from a few hundred finetune-and-evaluate
runs, ranks millions of candidate sets, and beats the strongest influence
baselines by 30 points. The uncomfortable part for anyone shipping fine-tuned
models is that it transfers from small-scale probes to full-scale training and
extends to code-generation and agentic backdoors, exactly the surfaces where a
triggered behavior does real damage.

For production LLM ops, the takeaway is about eval design, not paranoia.
Average-case poisoning numbers understate worst-case exposure, and worst-case is
the only case an attacker plans for. If you accept fine-tuning data from vendors,
outside contributors, or an agent's own generated traces, the useful question
isn't the volume you'd catch — it's whether a motivated selector could assemble a
small, clean-looking set that clears your filters. The
[HF paper page](https://huggingface.co/papers/2609.15029) has the full setup if
you want to see how the search is budgeted.

Would your data-provenance checks survive an adversary who gets to choose the
poison, not just how much of it?
