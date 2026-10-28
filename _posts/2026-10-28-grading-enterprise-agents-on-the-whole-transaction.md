---
layout: post
title: "Grading Enterprise Agents on the Whole Transaction"
date: 2026-10-28 03:05:52 +0000
categories: [agentic-ai, enterprise-ai, llm-ops, research]
source: hf-papers
source_id: "2610.32004"
discussion_url: https://huggingface.co/papers/2610.32004
source_url: https://arxiv.org/abs/2610.32004
---

Most agent benchmarks grade the final answer and call it a day. [CRM-Agent-Bench](https://arxiv.org/abs/2610.32004) argues that's the wrong unit of measurement for anything you'd actually deploy: in a CRM, the agent mutates records, follows operational rules, and carries a multi-turn conversation — a fluent wrong action costs you a customer, not a point on a leaderboard.

- 🎯 **Four facets, one grade**: outcome, trajectory, operational viability, and policy compliance, scored together — because an agent can reach the right end state through a path you'd never let run in an enterprise CSM deployment.
- 🔍 **Contracts, not vibes**: each of the 555 stateful, multi-turn tasks ships an executable contract checking actions, arguments, order, response, target state, and protected state. Success is the strict conjunction — miss one check, fail the task.
- ⚠️ **Protected state is the quiet one**: the "don't touch this" assertion is what separates a demo from something you'd let write to a real record store.
- 📊 **The headline number lies**: sixteen systems land between 64.32% and 83.60% strict success, yet the leaders that cluster at the top diverge sharply on cost and per-domain reliability.
- ⚡ **Cost and latency are first-class**: the harness reports them next to coverage, which is exactly the trade I make when picking a model for a production workflow.
- 💡 **What I'd steal**: the executable-contract idea. Most internal agent evals check the final answer and maybe the tool calls; almost none assert on action order or protected state.

The [HF paper page](https://huggingface.co/papers/2610.32004) has the per-domain breakdown, and the harness is on GitHub. If two agents hit the same success rate but one costs 3x and quietly touches records it shouldn't, which one is actually "better" — and does your eval even measure the difference?
