---
layout: post
title: "When the Model and the Harness Have to Co-Evolve"
date: 2026-09-27 14:08:22 +0000
categories: [agentic-ai, research, llm-ops]
source: hf-papers
source_id: "2609.29892"
discussion_url: https://huggingface.co/papers/2609.29892
source_url: https://arxiv.org/abs/2609.29892
---

The headline number in [Qwen-Planner-Agent](https://arxiv.org/abs/2609.29892) — best overall on MobilePA-Bench — is the least interesting thing in it. What earns a read is the "action-feedback-verification contract" that treats the planner model and its harness as one system that improves together, instead of two teams lobbing releases over a wall.

- 🎯 The split it attacks is the one I see everywhere in production: the planner model gets all the attention while the harness — tools, persistent memory, reusable skills, sub-agent routing — quietly rots into glue code. Co-evolving them is the right framing, not a nicety.
- 🔁 The data flywheel is human-gated. Specialized agents build tasks and collect trajectories, but a person stays in the loop on curation — the exact step most "self-improving agent" pitches skip past.
- ⚡ Their CARE reward-and-advantage engineering optimizes for reasoning and tool-use *cost*, not just task success. Anyone running agents against a latency and token budget lives in that trade-off daily.
- 🔍 Deployment feeds preserved failure traces back into both the model and the harness. Treating failure traces as a first-class training signal is underrated — most stacks log them and throw them away.
- ⚠️ It's mobile-GUI-planning specific and still trails the strongest baseline on the skills axis, so read it for the loop, not the leaderboard. The transferable asset is the architecture, not the score.

The [HF paper page](https://huggingface.co/papers/2609.29892) frames this as model–harness co-evolution, and that's the claim I'd pressure-test first: does the contract hold on a messier tool surface than a phone screen, or does co-evolution just relearn the harness every time the base model moves? If you're running agents in production today, would you spend the next quarter on a better base model or on making your harness improvable at all?
