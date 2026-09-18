---
layout: post
title: "When the Router Learns Alongside Its Agents"
date: 2026-09-18 14:04:46 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.18779"
discussion_url: https://huggingface.co/papers/2609.18779
source_url: https://arxiv.org/abs/2609.18779
---

Most Mixture-of-Agents setups I've seen treat two things as separate problems: the router that decides which agent handles a query, and the fine-tuning that makes each agent better. [CERA-MoA](https://arxiv.org/abs/2609.18779) argues that separation is the bug. Freeze the router while the agents keep learning and you're routing against a stale map of who's good at what.

Their fix is a co-evolving loop: the router and the individual agent policies train together with RL, so routing decisions track each agent's current competence instead of its competence three checkpoints ago. Two pieces stood out for production. First, a familiarity estimator that reads mid-layer hidden states to guess which agent fits a query — cheap, because it skips full rollouts. Second, a cumulative-threshold rule that activates the smallest agent subset clearing the bar, which is really a latency-and-cost knob wearing a routing costume. In a real deployment, "don't wake every agent for every request" is most of the operational win.

The part I want stress-tested is the co-evolution itself. A router and its agents chasing each other during training is exactly the kind of loop that can quietly overfit to the eval distribution — the router learns to exploit the agents' quirks rather than their skills. The [HF paper page](https://huggingface.co/papers/2609.18779) reports gains over static-agent routing and fixed-workflow fine-tuning, which is the honest comparison to make. My open question: does a co-evolved router stay reliable when a genuinely new query type shows up in production, or does it confidently route to whichever agent was best last week?
