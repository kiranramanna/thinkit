---
layout: post
title: "When Agents Assemble a Secret Nobody Handed Them"
date: 2026-10-24 03:07:17 +0000
categories: [agentic-ai, enterprise-ai, llm-ops, research]
source: hf-papers
source_id: "2610.30418"
discussion_url: https://huggingface.co/papers/2610.30418
source_url: https://arxiv.org/abs/2610.30418
---

I've stopped treating document-level access controls as a complete confidentiality story for agents, and the [Agent Mosaic study](https://arxiv.org/abs/2610.30418) is a clean explanation of why. The failure mode it measures — the "mosaic effect" — is an agent that retrieves several individually harmless documents and then states a sensitive conclusion that lived in none of them. The composite is the leak, and it didn't exist until the model wrote it.

The numbers are what make this worth your attention. Under benign queries designed to be answerable from a single document — no jailbreak, no adversarial prompt — the best model tested still disclosed forbidden composites in about 7% of answers. Adding visible classification headers and explicit aggregation rules helped a lot, and yet unsafe disclosures still showed up in roughly a third of simulated answers across all intents. Two live open-source agent harnesses did worse than the controlled simulation, which is the usual direction reality moves. And refusing isn't a clean escape hatch: a refusal phrased as "I can't combine those two facts" can confirm the prohibited conclusion while pretending to protect it.

The reframe I'm taking from this is that confidentiality for agents is an inference-control problem, not a retrieval-permissions problem. Your ACLs can be perfect — the agent had legitimate access to every piece — and you still leak, because the control you actually need is on what the agent is allowed to derive and say, not on what it can read. That's a much harder thing to specify, and almost nobody's eval harness tests for it yet. The [HF paper page](https://huggingface.co/papers/2610.30418) has the harness and model breakdown.

If a cooperative user surfaces a forbidden conclusion 7% of the time by accident, what's the real number once someone is trying?
