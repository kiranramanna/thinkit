---
layout: post
title: "Your Agent Closed the Ticket. Did It Follow the Procedure?"
date: 2026-10-29 14:17:54 +0000
categories: [conversational-ai, agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.30161"
discussion_url: https://huggingface.co/papers/2610.30161
source_url: https://arxiv.org/abs/2610.30161
---

Most agent evals I've run grade the end state: did the right row get written, did the card actually get blocked, did the deposit close. [TauIndianBankBench](https://arxiv.org/abs/2610.30161) is built on a sharper observation — in a regulated domain the end state is the easy part, and the part that conveniently leaves an artifact. The required steps that *don't* leave one are where real compliance lives.

The setting is Indian retail banking, where an LLM assistant might block a card or close a deposit faster than a scripted chatbot, but only if it follows the bank's procedure — pulling a closure quote before it closes the deposit, for instance. The benchmark is procedure-aware: it scores whether the agent performed the mandated intermediate steps, not just whether the final record looks right. That split matters, because a transcript can end on a correct database write while silently skipping the disclosure, the verification, or the quote the procedure demanded.

This is the eval gap I keep hitting with conversational agents in production. We instrument the outcome and under-instrument the path. An agent that reaches a correct end state by skipping three required steps passes an outcome-only eval and fails an audit — and in enterprise deployments the audit is what actually ships or sinks the thing. Procedure compliance is also where fine-tuning quietly regresses: you train for task success, the model learns the shortcut, and the steps with no end-state footprint are the first to go.

What I want from the [paper page on Hugging Face](https://huggingface.co/papers/2610.30161) is the step-level annotation scheme. If the required-step labels are reusable, the method travels to any tool-using agent in a procedure-bound domain — banking or not.

So, for anyone running agents behind a compliance boundary: does your eval harness know the difference between an agent that followed the procedure and one that merely landed on the right answer?
