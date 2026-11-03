---
layout: post
title: "Swapping MCP for CLI Quietly Rewrites Agent Behavior"
date: 2026-11-03 03:05:22 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.34298"
discussion_url: https://huggingface.co/papers/2610.34298
source_url: https://arxiv.org/abs/2610.34298
---

The MCP-versus-CLI argument usually turns on token cost and ergonomics. [This controlled study](https://arxiv.org/abs/2610.34298) makes a sharper claim: hold the capabilities fixed, expose them once as MCP and once as CLI, and the agent makes different decisions. Not different formatting — different action selection, different failure pathways, different recovery. Across six models and three environments, paired trajectories diverged in 94.3% of 2,004 episodes, and those early divergences propagated downstream.

What makes it credible is the setup. Their MICA harness renders both interfaces from one semantic action contract and routes the decoded actions through the same runtime, so the capabilities really are matched — the only thing that changes is how each operation is presented to the model. That isolates presentation as the variable. When behavior still shifts, you can't wave it off as one interface quietly exposing more power than the other.

The takeaway for anyone building agent tooling: the interface is part of the decision environment, not a cosmetic layer over it. We agonize over model choice and prompt wording, then treat "wrap it in MCP" as a plumbing decision the agent won't notice. It notices. The paper's DART method leans into that — keep the agent's validated semantic commitment, repair only the interface-specific realization, and you buy up to 9 points of benchmark score while cutting as much as 27k tokens per task on MCP. The [HF paper page](https://huggingface.co/papers/2610.34298) has the per-environment numbers.

If interface representation moves agent behavior this much, how much of your last eval regression was a tooling change wearing a model's clothes?
