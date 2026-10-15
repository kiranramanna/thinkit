---
layout: post
title: "Agent Memory in Three Tiers, and Why Most Stall at Two"
date: 2026-10-15 03:07:22 +0000
categories: [agentic-ai, rag, research]
source: hf-papers
source_id: "2610.19366"
discussion_url: https://huggingface.co/papers/2610.19366
source_url: https://arxiv.org/abs/2610.19366
---

Most of what ships as "agent memory" is a vector store with a cron job. This [survey](https://arxiv.org/abs/2610.19366) is useful because it gives that intuition a spine: it splits memory management into three tiers — T1 static (reuse a fixed store), T2 dynamic (update through a stable policy), and T3 self-evolving (update through a policy that itself changes with experience). Say it that way and you can place your own system in seconds. Almost everything in production today is T1 or early T2. The retrieval gets refreshed; the policy for what to keep, abstract, or forget is hand-tuned and then frozen.

The framing is multimodal, but the hard problems it names are the ones I already fight in text-only RAG: balancing source fidelity against abstraction, maintaining temporal validity and provenance, and grounding memory use in recoverable evidence. That last one is the whole game for enterprise deployments. A memory the agent can't trace back to a source isn't a feature — it's an unlogged assertion you'll get paged about when it turns out wrong.

Where I'd be cautious is T3. A self-evolving memory policy is the natural next step and also the point where the system stops being auditable the way a governance review expects. If the policy deciding what to remember is itself drifting, "why did the agent believe this?" becomes a question with no stable answer. The authors' principle of grounding in recoverable evidence is the only thing keeping T3 from turning into a slow-motion data-quality incident.

Worth skimming the [HF paper page](https://huggingface.co/papers/2610.19366) for the design patterns even if you never touch another modality. The real question it left me with: before you reach for self-evolving memory, can you even reconstruct why your T2 system retained what it did last week?
