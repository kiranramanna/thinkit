---
layout: post
title: "The Sandbox Is the Easy 10% of Agent Infrastructure"
date: 2026-11-19 03:05:42 +0000
categories: [agentic-ai, ai-infrastructure, llm-ops]
source: hn
source_id: "50549188"
discussion_url: https://news.ycombinator.com/item?id=50549188
source_url: null
---

Everyone shipping agent infrastructure this year is selling you a sandbox. The [Maritime Launch HN](https://news.ycombinator.com/item?id=50549188) makes a sharper point than the usual pitch: the sandbox is maybe 10% of the problem. The other 90% is the operational scaffolding nobody puts in a demo.

That tracks with what I see running agents in production. Spinning up an isolated VM is the easy part. Keeping a fleet of them alive, cheap, and recoverable is where the engineering quarters actually go:

- 🔁 **Lifecycle is the real product**: sleep/wake, persistent state, triggers, per-user routing, spend caps, health checks, and rolling updates across thousands of VMs without downtime
- 🧩 **Environments are never uniform**: one agent wants Windows, the next needs a browser with a persistent session, on-prem network reach, or a locked-down egress policy
- 💸 **Idle burn wrecks the unit economics**: a $0.04/hour sandbox left running is ~$29/month against a $20 subscription, so you end up building scale-to-zero, copy-on-write base images, and snapshot tiering anyway
- ⚡ **Every gap "leads to building more infrastructure"** — the exact tax [Maritime](https://maritime.sh) is betting teams would rather outsource

The interesting question isn't whether a managed agent cloud can be built. It's whether agent workloads are different enough from generic serverless to justify a new platform, or whether this collapses back into Lambda and Fargate once the novelty wears off. My read: per-agent spend tracking, login handoffs, and sub-second wake-from-snapshot are the pieces that genuinely don't exist elsewhere, and that's a thin but real wedge.

So is "agent-native" a durable infra category, or a feature set the hyperscalers quietly absorb in eighteen months?
