---
layout: post
title: "Coding Agents Hit a Wall When the Change Crosses Repos"
date: 2026-09-29 14:49:59 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.33382"
discussion_url: https://huggingface.co/papers/2609.33382
source_url: https://arxiv.org/abs/2609.33382
---

The number that should stop you: across seven agent configurations, full task success on WideSWE tops out at 42.5%, and the floor is 10.83%. The catch is what the benchmark measures. [WideSWE](https://arxiv.org/abs/2609.33382) doesn't score another single-repo bug fix — it mines 120 real tasks from 103 software ecosystems where a feature or fix only lands if coordinated changes hit multiple repositories at once.

That's the gap between the SWE-bench world and the one most of us actually operate in. A change to a shared client library ripples into the services that consume it; the API repo and its downstream repos all have to move together or the task isn't done. The paper's trajectory analysis names three failure modes I recognize from production: agents that never identify all the repos that need to change, agents that spot the change and leave it half-finished, and agents that edit every right repo but still don't satisfy the request.

The operationally useful finding is the joint-vs-independent comparison. Working one repo at a time mostly recovers omitted work — the "I forgot that repo existed" class of error — but it's weak at fixing an attempt that was already wrong. Joint execution can pull signal from a sibling repo to guide both the implementation and the verification. For anyone wiring up multi-repo coding agents, that argues against a naive per-repo fan-out: the context that lets an agent get it right lives in the other repositories, not just the one it's editing. The [HF paper page](https://huggingface.co/papers/2609.33382) has the full scorecard.

If cross-repo coordination is where agents fall over, is the next benchmark just "add a fourth repo," or do we need agents that plan the change graph before touching a single file?
