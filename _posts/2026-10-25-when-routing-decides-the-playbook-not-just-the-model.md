---
layout: post
title: "When Routing Decides the Playbook, Not Just the Model"
date: 2026-10-25 14:05:52 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.19705"
discussion_url: https://huggingface.co/papers/2610.19705
source_url: https://arxiv.org/abs/2610.19705
---

The routing systems I've shipped answer exactly one question — which model handles this query — and quietly hardcode everything else. The number of rounds, whether to fan out into an agentic loop, when to fall back: all of that lives in orchestration code a human wrote once and rarely revisits. [RouteWeaver](https://arxiv.org/abs/2610.19705) argues that the execution shape is itself a routing decision, and learns it jointly with model selection inside a single policy.

That reframing is the part worth sitting with. A router that can only swap models adapts to *difficulty*; a router that also chooses between single-round, multi-round, and agentic execution adapts to *the shape of the work*. The training recipe, COMET-GRPO, decouples the trajectory-level advantage into separate signals for mode selection and within-mode execution — so the policy earns credit for picking the right paradigm distinctly from executing it well. Without that split, one reward is teaching two very different decisions, and the credit smears across both.

The detail I'd pin to the wall is the ablation: drop their "progressive exploration" schedule — which lets the router master each mode under external assignment before it's allowed to choose — and the policy collapses entirely to single-round execution. That's the failure mode every adaptive orchestration layer flirts with. Give a router a cheap, usually-good-enough option and a reward that doesn't carefully price the hard cases, and it learns to always take the cheap path. The 61.4% average across math, coding, knowledge, logic, and recall — an 11% relative lift — matters less to me than that collapse warning. The [HF paper page](https://huggingface.co/papers/2610.19705) frames this as unified routing; I read it as a reminder that an orchestration policy will exploit any shortcut your reward leaves open. If a learned router collapses to single-round without a training crutch, how confident are you that your hand-tuned one isn't already doing the same thing — just silently?
