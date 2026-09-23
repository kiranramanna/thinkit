---
layout: post
title: "The Orchestrator Was the Thing That Didn't Scale"
date: 2026-09-23 14:07:59 +0000
categories: [agentic-ai, ai-infrastructure, research]
source: hf-papers
source_id: "2609.26781"
discussion_url: https://huggingface.co/papers/2609.26781
source_url: https://arxiv.org/abs/2609.26781
---

Most multi-agent frameworks I've worked with hit the same wall — the central orchestrator that assigns tasks and merges results becomes the context bottleneck the moment the swarm gets interesting. [Agensh](https://arxiv.org/abs/2609.26781) takes the other bet: delete the coordinator, let workers self-organize, and treat agent count as its own scaling axis.

- 🎯 **No coordinator.** Workers run a shared loop — gather context, claim and self-assign a sub-task, act, share findings, verify, merge — asynchronously against a shared workspace and a message bus.
- 📊 **Agents as a scaling dimension.** On the five hardest ProgramBench tasks, 1→128 agents lifts mean test-pass from 19.3% to 28.8%; on pandoc, 1→1,024 agents goes 33.9%→55.1%.
- 🔍 **Coordination emerges, not designed.** Worker trajectories show self-organized cooperation standardizing into roles and workflows as the org grows — the structure is a result, not a config file.
- ⚡ **Built for latency budgets.** The point is finishing hard tasks under a time budget by throwing concurrency at them, not squeezing more out of single-agent reasoning.
- ⚠️ **The bill is real.** 1,024 agents for a ~20-point test-pass gain is a lot of tokens; this is a "throughput matters more than cost" regime, not a default.
- 💡 **The interesting read** is the emergence data on the [HF paper page](https://huggingface.co/papers/2609.26781) — cooperation expanding from peer coordination to specialized roles as the count climbs.

Does self-organization actually beat a good orchestrator at the same agent count, or is it just easier to scale? The paper shows scaling, not a head-to-head against a strong centralized baseline — and that's the comparison I'd want before ripping a coordinator out of anything running in production.
