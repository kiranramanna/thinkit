---
layout: post
title: "Blast Radius Is the Only Agent Safety Metric That Scales"
date: 2026-06-04 15:17:13 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 48392082
hn_url: https://news.ycombinator.com/item?id=48392082
source_url: https://www.anthropic.com/engineering/how-we-contain-claude
---

The most honest line in [Anthropic's writeup on containing Claude](https://www.anthropic.com/engineering/how-we-contain-claude) is that agent risk has two independent terms — how likely a bad action is, and how much damage one bad action can do — and only the first trends down with better models. The second term, the blast radius, grows with every capability and every scope you hand the agent. Better training doesn't save you here. Environment design does.

That reframing matches what I keep relearning in production. Teams pour effort into making the model decline the wrong tool call, then ship it holding credentials that can drop a table. You can chase a lower failure probability forever and still own catastrophic tail risk, because the two terms multiply. The cheaper win is almost always capping the second term: scoped tokens, read-only by default, egress allowlists, an execution sandbox the agent can thrash inside without reaching anything that matters.

What stays underrated is that human-in-the-loop approval is itself a blast-radius control, not a correctness control — and it decays. Once an agent issues a hundred permission prompts an hour, the human rubber-stamps, and your "supervision" is theater. The durable version is structural containment that holds when nobody is watching the prompts. The [HN thread](https://news.ycombinator.com/item?id=48392082) has good war stories from people who learned that the expensive way.

So here's my bet for the next year of agent platforms: the differentiating work won't live in the policy model deciding whether an action is safe. It'll be in the boring substrate — the sandbox, the capability tokens, the egress rules — that makes the question of whether the agent "meant" to do something irrelevant. If your agent physically can't cause the damage, you don't need to predict whether it will. Which side of that line is your current deployment on?
