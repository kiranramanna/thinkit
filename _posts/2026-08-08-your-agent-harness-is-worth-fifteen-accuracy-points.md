---
layout: post
title: "Your Agent Harness Is Worth Fifteen Accuracy Points"
date: 2026-08-08 14:03:51 +0000
categories: [research, agentic-ai, llm-ops]
source: hf-papers
source_id: "2608.03451"
discussion_url: https://huggingface.co/papers/2608.03451
source_url: https://arxiv.org/abs/2608.03451
---

The number worth pinning to the wall from [DataSpace](https://arxiv.org/abs/2608.03451): swap the agent harness with the model backbone held fixed, and accuracy moves by 15.36 points. The scaffolding — how you plan, route tools, and stitch evidence together — is worth more than most backbone upgrades you're arguing about.

DataSpace evaluates data agents that answer analytics questions over messy, task-local workspaces: 410 cross-language tasks and 7,439 artifacts spanning CSV, JSON, SQLite, Markdown, PDF, and video. The agent gets only a question and a workspace and has to return the complete requested table. What makes it usable as a harness is the deterministic evaluator — header-invariant column alignment, type- and precision-aware normalization, order-aware row comparison. No LLM-judge fuzziness on the final answer; either the table matches or it doesn't. The best frontier configuration reaches 66.34%, so this is nowhere near saturated.

Two findings map straight onto agentic production. First, that harness spread is a warning that eval effort spent only on picking a backbone is misallocated — the same model wins or loses on orchestration. Second, multimodal evidence integration and joins dragged accuracy down across all six backbones tested. The failure mode isn't querying one clean source; it's discovering which sources hold the evidence and joining across them — exactly the part a demo hides and production surfaces on day one.

The quiet contribution here is that deterministic evaluator. If you can define what a correct answer *is* precisely enough to diff it byte-for-byte, you can stop paying an LLM judge to grade every run and start regression-testing your agent like real software. The [HF paper page](https://huggingface.co/papers/2608.03451) has the builder and evaluator details. How much of your agent's eval budget is going to a judge that a strict comparator could replace?
