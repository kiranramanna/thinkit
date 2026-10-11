---
layout: post
title: "Synthesizing Enterprise Agent Data Without the Schema"
date: 2026-10-11 14:08:57 +0000
categories: [agentic-ai, enterprise-ai, llm-ops, research]
source: hf-papers
source_id: "2610.10549"
discussion_url: https://huggingface.co/papers/2610.10549
source_url: https://arxiv.org/abs/2610.10549
---

The real bottleneck in training an enterprise tool-calling agent isn't the model — it's that you can't get the data out. Business and legal restrictions keep you away from production systems, schemas, and tables, so the agent you most need to teach is the one you have the least data to teach it with.

[Synthesis Through Simulation](https://arxiv.org/abs/2610.10549) takes a different route than the usual tabular-synthesis or hand-authored-procedure approaches, both of which trade away either structural validity or distributional fidelity. Instead of generating rows and hoping they're legal, STS has an LLM agent produce data by executing operations against policy-enforcing APIs inside a simulated enterprise. Validity stops being something you check after the fact — the environment that defines what's valid is the same one that generates the data, so structural correctness holds by construction. That one move decouples "is this allowed" from "does this look real," and lets you attack each problem separately.

The numbers are the part I'd actually use to argue for this internally. Their domain-agnostic Generalist Populator hits 0.88 average marginal fidelity and 100% constraint satisfaction across all ten environments without ever seeing a database schema. For contrast, schema-privileged agents failed 82% of trajectories on the airline environment's tightly coupled workflows — the exact cross-table dependencies that make real enterprise data hard to fake. Schema-free beat schema-aware precisely where the workflows got gnarly. The authors open-source the framework, all ten environments, and the generated datasets, and the [HF paper page](https://huggingface.co/papers/2610.10549) links the release.

What I don't have settled: fidelity-by-construction guarantees your synthetic data obeys the rules, but a simulated system can still miss the weird empirical distributions real users create. If your agent only ever trains against policy-clean data, does it learn to handle the messy, policy-violating inputs that production actually throws at it?
