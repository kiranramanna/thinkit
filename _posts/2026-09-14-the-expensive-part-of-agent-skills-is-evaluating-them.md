---
layout: post
title: "The Expensive Part of Agent Skills Is Evaluating Them"
date: 2026-09-14 14:09:51 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.11682"
discussion_url: https://huggingface.co/papers/2609.11682
source_url: https://arxiv.org/abs/2609.11682
---

The framing that matters in [COBRA-Skills](https://arxiv.org/abs/2609.11682)
isn't that agents get better with a library of reusable skills — we already
knew that. It's that the bottleneck in building one is the evaluation, not the
generation. Distilling a candidate skill from prior task experience is cheap.
Finding out whether it actually helps means running the agent, and every
rollout costs tokens, latency, and a live harness. Do that exhaustively across
a growing candidate pool and the optimization loop becomes the thing you can't
afford to run.

COBRA-Skills treats that eval budget as the scarce resource and spends it like
one. A contextual bandit (they use LinearUCB over a small NN feature space)
decides which candidate skills are worth a real execution, while an
evolutionary population regenerates, mutates, and crosses over skills using a
teacher model in between. The reported result is a 55–58% cut in optimization
cost against SkillOpt with only 50 unique examples per benchmark, across six
agent benchmarks and three target models. What caught my eye more than the
headline number: it holds up when the harness changes and when the target
model itself does the skill generation.

That last part is the production-relevant bit. In a real agent stack the
harness is never frozen — you swap models, tighten tool schemas, change
retries — and most offline skill-tuning quietly assumes it won't. An optimizer
that allocates evaluations by expected information gain instead of brute-forcing
the whole population is the same discipline we already apply to eval sampling
in LLM ops, just pointed at skill selection. The [HF paper
page](https://huggingface.co/papers/2609.11682) has the ablations if you want
to see how much the bandit specifically buys over random allocation.

If evaluating a skill is the expensive step, why are we still generating
thousands of candidates and grading them uniformly?
