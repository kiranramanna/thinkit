---
layout: post
title: "Stop Tuning Agents, Start Evolving the Team"
date: 2026-11-05 03:06:03 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.39813"
discussion_url: https://huggingface.co/papers/2610.39813
source_url: https://arxiv.org/abs/2610.39813
---

The premise of [EvoTeam](https://arxiv.org/abs/2610.39813) is one most people building multi-agent systems learn the hard way: making each agent smarter doesn't make the team better. You can tune every sub-agent's prompt and skill set and still watch the system fail on coordination — the planner hands off badly, the critic and the executor talk past each other, the retries pile up. The failure lives in the interactions, not the parts.

EvoTeam evolves the collaboration layer directly. It jointly adapts team organization, inter-agent interaction rules, and individual skills from execution experience, and — the part I find genuinely useful — keeps a library of reusable teams. Collaboration experience accumulates inside compatible team contexts while individual skills stay portable across teams. That's a cleaner separation than most frameworks offer, where a change to the orchestration graph quietly invalidates every prompt you tuned against the old one.

In production this maps to a problem I keep hitting: we have no good abstraction for "a team that works." We version prompts and tools, but the winning configuration — who talks to whom, in what order, under which interaction rules — lives in tribal memory or a brittle config file. A promoted, reusable team with its own interaction contract is the right shape. The open question is the one the abstract flags: does collaboration experience actually transfer across heterogeneous tasks, or does the "compatible team context" constraint fragment the library until every task needs its own bespoke team? The [HF paper page](https://huggingface.co/papers/2610.39813) and the released code are where I'd go to see whether the reuse holds.

If this line of work pays off, the unit we evolve stops being the agent and becomes the org chart.
