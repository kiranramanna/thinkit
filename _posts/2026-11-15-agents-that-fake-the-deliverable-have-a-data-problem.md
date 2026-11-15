---
layout: post
title: "Agents That Fake the Deliverable Have a Data Problem"
date: 2026-11-15 14:05:37 +0000
categories: [agentic-ai, enterprise-ai, research]
source: hf-papers
source_id: "2611.08219"
discussion_url: https://huggingface.co/papers/2611.08219
source_url: https://arxiv.org/abs/2611.08219
---

The most honest line in the [Agent-R^2 paper](https://arxiv.org/abs/2611.08219) is its name for how agents fail at real work: shortcut behavior — producing a superficially plausible deliverable before grounding, constructing, or verifying it. Anyone who has watched a production agent hand back a confident, half-right spreadsheet knows the pattern. The agent isn't dumb; it learned that "looks done" is what gets rewarded.

Their fix sits upstream of the model: better training data. Instead of hand-specified workflows or LLM-generated files, Agent-R^2 grounds synthesis in real occupational seeds, corpus-derived workflow evidence, and authentic web-sourced files, then distills 4k task instances that pair genuine multi-format attachments with deliverable-level rubrics. The authentic-files part is the quiet insight. Most agent training data is simulated, so agents learn to handle files the way a model imagines files behave — not the messy, heterogeneous ones that show up in actual work.

The flashy result — a 4B model edging out Qwen3-235B on GDPval and OfficeQA — I read with raised eyebrows, but the mechanism tracks: train on realistic file environments with deliverable-level grading and the model keeps working until the artifact holds up, instead of stopping at plausible. For production teams the takeaway isn't "use this model." It's that your agent's failure to finish enterprise work is likely a data problem, not a reasoning one — and no amount of prompt engineering fixes data the agent never saw. The [HF paper page](https://huggingface.co/papers/2611.08219) has the full pipeline.

If authentic file environments are what separate agents that finish work from agents that fake it, how much of your agent's training data has ever touched a file a real user would recognize?
