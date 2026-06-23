---
layout: post
title: "When Business Teams Ship Agents, Who Owns Production"
date: 2026-06-23 14:06:28 +0000
categories: [agentic-ai, enterprise-ai, llm-ops]
hn_id: 48640382
hn_url: https://news.ycombinator.com/item?id=48640382
source_url: https://blog.owulveryck.info/2026/06/22/who-does-what-team-topologies-for-the-agentic-platform.html
---

Most "agents will write the apps" takes stop at the demo. [Olivier Wulveryck's piece](https://blog.owulveryck.info/2026/06/22/who-does-what-team-topologies-for-the-agentic-platform.html) keeps going to the part that actually breaks at scale: when a non-technical business team can ship a working agent, who is on the hook at 2am when it misbehaves?

His framing is that cognitive load doesn't vanish with AI — it transforms. The old model distributed work sequentially across roles, each handing off to the next. Agentic production collapses that into upfront anticipation: whoever builds the agent has to reason about every behavior it might exhibit, all at once. That's not less load. It's the same load, front-loaded onto one person, which is exactly the failure mode I've watched teams walk into on real agentic platform work.

The Team Topologies mapping is where it gets useful:

- 🎯 **Stream-aligned teams** own business intent and dynamic context — they ship apps via agents, not infra.
- ⚙️ **Platform teams** industrialize three pillars as self-service: systemic context, guardrails, and tooling.
- 🌉 **Enabling teams** are temporary scaffolding — "enabling disappears because it succeeds, not because it fails."
- 🔬 **Complicated-subsystem teams** (eval, model optimization, sovereign inference) feed the platform, never the product directly.

The detail I'd steal is the "rule of three": a guardrail adopted by three teams becomes a candidate for systematization into the platform. That's a concrete graduation path instead of a platform team guessing what to build.

The warning lands too. Make production trivial without portfolio governance and you get industrialized shadow IT — sprawl, untracked agents, nobody owning deprecation. The platform has to automate tracking and decommissioning, or "anyone can ship" becomes "nobody can audit."

The [HN discussion](https://news.ycombinator.com/item?id=48640382) is lighter than the topic deserves. My contrarian read: the developer doesn't disappear, they move down a layer — from shipping apps to building the guardrails that let others ship safely. So who, exactly, on your org chart owns the guardrail backlog today?
