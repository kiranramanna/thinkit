---
layout: post
title: "GUI Skills That Rewrite Themselves While the Task Runs"
date: 2026-09-20 14:03:57 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.17653"
discussion_url: https://huggingface.co/papers/2609.17653
source_url: https://arxiv.org/abs/2609.17653
---

Most agent-skill libraries freeze at the wrong moment. You author the skills before deployment, ship them, and treat the runtime as pure consumption — which is exactly backwards for GUI work, where pop-ups, delayed loads, and relocated widgets invalidate a plan the instant you commit to it. [EvoSkill-GUI](https://arxiv.org/abs/2609.17653) makes the sharper bet: the skills themselves should be revised from execution feedback at deploy time, with no additional training. A skill isn't a prompt blob here — it's a structured multi-file package holding retrieval metadata, executable plans, backup localization, failure-recovery rules, accessibility utilities, and past failure cases.

The mechanism worth stealing is the isolated critic. The reflect-revise-reuse loop lets the executor make instant in-rollout revisions, but when a trajectory fails, a separate critic diagnoses it under strict information isolation: it sees only the instruction, screenshots, accessibility observations, and the action trace — the skill body, the executor's chain of thought, and the ground truth are all hidden. Only then does the executor edit the responsible skill files through a restricted tool interface. That isolation is the part I'd defend in review. An online write path into your skill store is a liability the moment the thing proposing the edit can see the answer; walling the critic off from ground truth is what keeps skill evolution from quietly overfitting to the eval.

The numbers hold up without any fine-tuning: across MobileWorld, AndroidWorld, and OSWorld, training-free gains of up to +16.2, +6.0, and +10.5 points across multiple base models, with evolved libraries carrying over to related tasks instead of being rebuilt each time. The [code and full ablations](https://github.com/ZJU-REAL/EvoSkill-GUI) are out, and the [HF paper page](https://huggingface.co/papers/2609.17653) collects the discussion. If your agents accumulate skills but never revise them, ask the harder question: what in your stack is allowed to edit a skill mid-run, and can it see the answer key while it does?
