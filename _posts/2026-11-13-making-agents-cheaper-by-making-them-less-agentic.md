---
layout: post
title: "Making Agents Cheaper by Making Them Less Agentic"
date: 2026-11-13 03:10:19 +0000
categories: [agentic-ai, llm-ops, industry]
source: hn
source_id: "50471650"
discussion_url: https://news.ycombinator.com/item?id=50471650
source_url: https://github.com/Parcha-ai/agentrun/blob/main/README.md
---

The pitch for [AgentRun](https://github.com/Parcha-ai/agentrun/blob/main/README.md) — run smarter agents, use fewer tokens — is really a bet that most of what an agent does on its hundredth run doesn't need a frontier model at all. The open-source release wraps an existing harness (Pi, Claude Agents, Codex, anything speaking ACP) and turns the repeatable middle of a task into cheap, typed decisions and plain code: let a strong model discover a procedure once, then demote the routine executions to something that doesn't cost a reasoning trace every time.

If you've operated agents, this is a bill you already recognize. Token spend scales with how often you re-reason through work you've done before, and the honest fix has always been to stop calling the model for the parts that went deterministic. What AgentRun adds around that is the operational scaffolding — durable execution, a control plane, per-run analytics on how agents actually behave — which is usually the stuff teams bolt on badly after the first incident. The headline is a compliance-review task dropping from $2.89 to $0.25 an alert, roughly a 91% cut, believable precisely because that workload is mostly the same every time. The [HN discussion](https://news.ycombinator.com/item?id=50471650) picks at the obvious tension: when is scripting the workflow just a worse version of writing the function yourself?

Early reaction splits along exactly that line. [RuntimeWire](https://runtimewire.com/article/grep-agentrun-compliance-agent-costs-jev) covered the launch straight, repeating the 91% figure from the team's own compliance test without independent verification. A hands-on [review by Omid Saffari](https://omidsaffari.com/blog/agentrun-review) was more tempered — he calls it "a credible beta for turning the repeatable middle of an agent job into explicit software," then points out that a 31-line plain function matched it on all four of his test cases, and that the host still owns tools, recovery, and sandboxing. The trend worth watching: whether "script the boring 90%, keep the agent for the hard 10%" becomes the default shape of a production agent, or whether teams decide a plain function already did that.
