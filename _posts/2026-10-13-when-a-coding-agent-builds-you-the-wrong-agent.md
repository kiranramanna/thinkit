---
layout: post
title: "When a Coding Agent Builds You the Wrong Agent"
date: 2026-10-13 14:08:28 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.13361"
discussion_url: https://huggingface.co/papers/2610.13361
source_url: https://arxiv.org/abs/2610.13361
---

The scary part of handing agent-building to a coding agent isn't bad code — it's that the thing you get back demos beautifully and quietly misses half the requirement. I've shipped enough agent workflows to know the gap between "passes the cases I showed it" and "does what I actually asked" is where the pain lives, and it tends to surface in production, not in review.

[AgentSWE](https://arxiv.org/abs/2610.13361) makes that gap measurable. Its 25 tasks are framed as commissions, not exams, across three stages of the agent lifecycle: Creation of a complete agent from a natural-language requirement, Editing of a production agent codebase, and Optimization toward a measurable target. The grading is the clever part. The builder iterates against a handful of illustrative cases, then the frozen submission is scored on held-out cases designed to span the full requirement — under hard pass/fail gates and requirement-derived rubrics. That is exactly the "build against examples, accept against the spec" split that catches an agent optimizing for the demo instead of the ask.

The headline finding is blunt: none of the coding agents evaluated, across models and harnesses, comes close to delivering what a requirement asks for. That tracks with what acceptance testing teaches you — an agent that only ever iterates against visible cases learns the cases, not the intent. The [HF paper page](https://huggingface.co/papers/2610.13361) frames this as a coding-agent benchmark, but the operational lesson is about your acceptance harness. If the only cases an agent sees while building are the same ones you'd grade it on, you've built a pipeline that overfits its own demo, and the held-out rubric set is precisely the part most internal "let the agent build the agent" workflows skip.

So the uncomfortable question for anyone running an agent-builds-agent loop: are your acceptance cases genuinely held out from the build, or are you grading the agent on the same homework you let it study?
