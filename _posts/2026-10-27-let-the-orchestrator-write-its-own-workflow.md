---
layout: post
title: "Let the Orchestrator Write Its Own Workflow"
date: 2026-10-27 14:06:30 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.34467"
discussion_url: https://huggingface.co/papers/2610.34467
source_url: https://arxiv.org/abs/2610.34467
---

The thing most multi-agent systems get wrong is treating the collaboration graph as architecture — you wire up a planner, a few workers, and a verifier, then freeze the topology before you've seen a single task. [DynaFlow](https://arxiv.org/abs/2610.34467) argues the graph should be an output, not a config: the main agent decides *when* collaboration is even needed and generates a task-specific program that coordinates sub-agents through sequential or parallel calls, structured hand-offs, and verification.

More interesting than the headline number — 88% accuracy in Forced mode, about 11 points over the strongest baseline on the same Qwen3.5-27B backbone — is the training choice. They fine-tune only the orchestrator and leave every sub-agent fixed. That cleanly separates learning to orchestrate from making the executors smarter, which is the split most production teams can't make, because their orchestration logic is hand-written glue rather than a learned policy. You can't improve glue with data.

The part worth stealing is the refinement pass. After the initial supervised pass on distilled trajectories, they filter for unsupported premises, biased verification, and information-flow defects, then train on what survives. Their own analysis credits the win to cross-stage information flow: after training the agent actually uses, verifies, and refines upstream outputs instead of letting them vanish between steps. That matches what I see — most multi-agent failures aren't bad sub-agents, they're sub-agents that never got told what the last one found. The [HF paper page](https://huggingface.co/papers/2610.34467) has the full benchmark spread.

If orchestration is a learnable policy, how long before "prompt your sub-agents well" stops being an engineering chore and becomes a training-data problem?
