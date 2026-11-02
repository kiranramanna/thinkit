---
layout: post
title: "An Orchestrator That Keeps Deleting Its Own Skills"
date: 2026-11-02 14:27:16 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.22740"
discussion_url: https://huggingface.co/papers/2610.22740
source_url: https://arxiv.org/abs/2610.22740
---

Most agent-orchestration training I've watched gets stuck on two unglamorous problems, and [this paper](https://arxiv.org/abs/2610.22740) names both. When every rollout of a task reaches the same outcome — all pass or all fail — the advantage signal collapses and there's nothing to learn from. And when you score a skill with one noisy number, you can't tell a genuinely useful skill from a lucky run. R²Orch's answer is to stop hand-designing the curriculum and let the system propose its own tasks.

The mechanism is a loop inside a loop. The inner loop is self-play: the orchestrator improves on tasks it chose. The outer loop improves how the inner loop improves — a Proposer is rewarded (they call it Recursive Learnability) for picking tasks whose rollouts keep reaching different outcomes as skills get pulled out from under them. That "pulled out" part is what I find genuinely interesting:

- 🎯 **Skill Withdrawal**: a skill is removed once a controlled test inside self-play shows the orchestrator does just as well without it — the opposite of the usual "add another tool" reflex.
- 🔁 **Failures to skills to parameters**: scaffolding gets distilled inward, so the system trends toward zero-skill deployment — the harness dissolving into the weights.
- 📊 **Twelve datasets** across QA, math, code, and interactive tasks, ahead of orchestration, RL, and skill-evolution baselines.
- ⚠️ **Advantage collapse is the real enemy** — the Proposer exists to manufacture discriminative tasks, which beats cranking reward shaping by hand.
- ✅ **The code is public**, so the self-play loop is reproducible rather than a diagram.

Where I'd push back: zero-skill deployment is a lovely north star, but in production the scaffolding is often where the guardrails, auth, and audit logging live. I don't want those distilled into weights I can't inspect. The research direction is right; the operational version keeps some skills explicit on purpose. The [arXiv abstract](https://arxiv.org/abs/2610.22740) has the objective details, and the [HF paper page](https://huggingface.co/papers/2610.22740) has the thread.

If your agent's best trick is one your eval can't separate from luck, is it a skill or a coin flip?
