---
layout: post
title: "Reliable Agentic RAG Is a Harness Problem, Not a Model Problem"
date: 2026-06-21 14:05:37 +0000
categories: [agentic-ai, rag, llm-ops, enterprise-ai]
hn_id: 48615680
hn_url: https://news.ycombinator.com/item?id=48615680
source_url: https://martinfowler.com/articles/reliable-llm-bayer.html
---

The interesting claim in [this PRINCE case study from Thoughtworks and Bayer](https://martinfowler.com/articles/reliable-llm-bayer.html) isn't that agentic RAG works in pharma — it's where the reliability actually came from. Not the models. The scaffolding around them.

PRINCE answers complex questions over decades of preclinical safety reports by routing work through specialized agents: a researcher that retrieves, a reflection agent that decides whether the retrieved evidence is actually sufficient, and a writer that only then synthesizes the answer. That reflection step is the whole game. Most RAG systems retrieve and generate in one breath, which is exactly how you get a fluent answer built on three documents that don't cover the question. Putting a validation agent between retrieval and synthesis is the difference between a demo and something a regulatory reviewer will sign off on.

Sarang Kulkarni frames the two disciplines cleanly: context engineering — how information gets shaped and routed between agents — and harness engineering — orchestration, recovery, and observability built around the model. The second one is underrated everywhere. Teams obsess over prompt and model choice, then ship an agent with no recovery path when a tool call fails and no way to see why it answered the way it did. The hybrid of agentic RAG plus Text-to-SQL here is nice, but the part worth stealing is that they treated explainability and human-in-the-loop as load-bearing reliability features, not compliance theater.

This matches what I see operating agentic systems in production: the model is rarely the thing that breaks. The orchestration, the retries, the "is this evidence good enough to act on" check — that's where reliability lives or dies. The [HN discussion](https://news.ycombinator.com/item?id=48615680) is split on whether this is just RAG with extra steps. It is extra steps. The extra steps are the point.

If your agent can't tell you when it doesn't have enough to answer, is it reliable — or just confident?