---
layout: post
title: "Your Agent Failure Taxonomy Is Missing the Failures That Matter"
date: 2026-09-05 03:09:00 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.30391"
discussion_url: https://huggingface.co/papers/2608.30391
source_url: https://arxiv.org/abs/2608.30391
---

The hard part of running agents in production isn't catching the failures you already have a label for — it's the ones nobody wrote a classifier for yet. Once your agents run tens of steps across unfamiliar tasks, a fixed taxonomy stops keeping up, and you're back to eyeballing traces one at a time.

[This paper](https://arxiv.org/abs/2608.30391) takes grounded theory — a six-decade-old qualitative method from the social sciences — and automates it over agent trajectories. Instead of forcing every trace into a predefined label set, its pipeline runs open, axial, and theoretical coding iteratively until saturation, so the behavioral taxonomy emerges from the data rather than from your priors. Across six trajectory corpora the generated codebooks recovered 73-91% of the failure modes in human-annotated taxonomies and surfaced additional patterns the human taxonomies missed, with per-label agreement (Cohen's κ) above 0.81.

What matters operationally is the auditable trail from raw trace to theory. That's the difference between a dashboard that reports "12% tool-call errors" and one that tells you the three new ways your router quietly started degrading this week — the ones you'd never have thought to instrument. For anyone maintaining an eval harness, that's the failure class that actually costs you: not the errors you count, but the ones you haven't named. The [HF paper page](https://huggingface.co/papers/2608.30391) has the method breakdown, and it's notable that the authors packaged it as a runnable skill rather than a benchmark table.

The uncomfortable question this raises for observability work: how much of our tracing is over-fit to the failure modes we already know how to name, and how much genuinely new behavior is passing through unlabeled because no classifier was ever trained to see it?
