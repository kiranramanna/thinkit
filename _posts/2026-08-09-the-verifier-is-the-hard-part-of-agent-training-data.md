---
layout: post
title: "The Verifier Is the Hard Part of Agent Training Data"
date: 2026-08-09 14:04:18 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.05466"
discussion_url: https://huggingface.co/papers/2608.05466
source_url: https://arxiv.org/abs/2608.05466
---

The headline number in [Recursive Synthetic Terminal Tasks](https://arxiv.org/abs/2608.05466) is 37,484 tasks at roughly $0.05 each, but the number that matters to anyone running an agent eval harness is the one that never makes the abstract: how often the verifier still agrees with the instruction after you've mutated a task fifteen times. That mutual consistency — instruction, environment, reference solution, and grader all describing the same job — is the expensive part of synthetic agent data, and it's exactly what naive LLM generation breaks.

RST's move is to keep the loop honest instead of trusting the generator. Start from a verified seed, extend the reference solution, realign the verifier and instruction to the new workflow, then re-validate in a fresh sandbox before the task is allowed to seed the next round. Rejection at any step means the task never propagates. What falls out is an automatic difficulty curriculum nobody hand-tuned: median solutions grow from 67 to 374 lines, executed commands from 40 to 244, and DeepSeek-V4-Pro pass@4 collapses from 90% at round one to 2.5% by round fifteen.

The [HF paper page](https://huggingface.co/papers/2608.05466) frames this as training data, and the reported SFT and RL gains on Qwen3.5 back that up. But I'd reach for it as an eval generator first. Most agent benchmarks rot the moment your agent overfits their fixed task set; a pipeline that manufactures fresh, sandbox-verified terminal tasks on demand is a target you can't memorize. The open question is whether "verified in a fresh sandbox" survives contact with network state or long-lived services — because the cases where my own graders go flaky are precisely the ones a synthesizer would quietly reject and drop.
