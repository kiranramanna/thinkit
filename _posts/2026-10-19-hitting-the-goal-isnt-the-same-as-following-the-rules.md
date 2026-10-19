---
layout: post
title: "Hitting the Goal Isn't the Same as Following the Rules"
date: 2026-10-19 03:05:41 +0000
categories: [agentic-ai, llm-ops, enterprise-ai, research]
source: hf-papers
source_id: "2610.20424"
discussion_url: https://huggingface.co/papers/2610.20424
source_url: https://arxiv.org/abs/2610.20424
---

Most agent benchmarks grade the final answer and stop there. In production that final green check is the least interesting number I track, and [BizBench](https://arxiv.org/abs/2610.20424) makes the case cleanly: an agent can reach the goal and still trample a constraint on the way — and outcome-only evaluation passes it anyway.

The benchmark is grounded in real procedures from a payments company: 789 knowledge documents, 601 discoverable tools, and 50 multi-turn tasks laced with resource limits, temporal dependencies, prior commitments, and policies that are outdated or contradict each other. Each task is validated by reference execution, and deterministic checks score goal attainment and execution validity *separately*. That split is where the results get uncomfortable. Qwen3.8-27B hits 42% goal attainment but only 32.7% strict success — a real chunk of its "wins" were invalid runs. Claude Opus 5 and GPT-6 Sol land at 64% and 61% strict. DeepSeek-V4.1-Flash averages 191 tool calls per run, roughly 70% more than the reference path.

This is the eval-harness gap I keep running into. If your harness logs task success and nothing else, your reliability dashboard is lying by omission — a constraint-compliant run and a lucky rule-breaking run look identical in the only column you're watching. In payments or anything regulated, the second one is a liability even when it "succeeds." The [paper's page on Hugging Face](https://huggingface.co/papers/2610.20424) frames this as pushing agents past completion toward compliant execution, which is the right target. So the question for anyone running agents today: does your eval measure validity at every step, or are you shipping on the final checkmark and hoping the middle held?
