---
layout: post
title: "The Missing Skill in Multi-Agent Systems Is Teamwork"
date: 2026-09-26 14:14:58 +0000
categories: [agentic-ai, research]
source: hf-papers
source_id: "2609.22682"
discussion_url: https://huggingface.co/papers/2609.22682
source_url: https://arxiv.org/abs/2609.22682
---

Most multi-agent systems I've built or reviewed put all the engineering into two places: task decomposition and routing. Decide who does what up front, or send each subtask to the best-fit agent. [Self-Organizing Agent Teams](https://arxiv.org/abs/2609.22682) argues the leverage is somewhere we don't usually instrument — the teamwork itself. Instead of fixed protocols, SAT learns reusable strategies for how a team organizes roles, conversational phases, who participates when, and how information flows, then reuses them on problems it has never seen.

The result that makes me stop and reread is the baseline they beat. Across five math and physics benchmarks the teams hit 66.7% accuracy, versus 59.0% for a *perfect* router over the members' independent answers — an oracle that always picks the best individual response. Beating that oracle by 13.4 points on AIME 2026 means the win can't be "select the smartest member." It's what they call collaborative computation: agents exchanging, challenging, repairing, and synthesizing partial reasoning into a solution no single member produced. That's the part routing and voting structurally can't capture, because both assume the answer already exists inside one agent's head.

There's a governance-flavored finding buried in here too. The gains track a construct they borrow from organizational psychology — demonstrability, whether the team can recognize correct reasoning once it appears — at a Spearman ρ of 0.90. In production terms that's a deployment heuristic: multi-agent setups pay off on tasks where a good answer is verifiable in-context, and probably waste tokens where it isn't. The strategies were learned from roughly 40 problems and transferred unchanged, which quietly undercuts a lot of the bespoke orchestration scaffolding we hand-write. Full details are on the [arXiv page](https://arxiv.org/abs/2609.22682) and the [HF paper page](https://huggingface.co/papers/2609.22682).

If a learned interaction pattern from 40 examples generalizes across benchmarks, how much of the orchestration logic we ship by hand is just a frozen, worse version of a strategy the agents could have learned themselves?
