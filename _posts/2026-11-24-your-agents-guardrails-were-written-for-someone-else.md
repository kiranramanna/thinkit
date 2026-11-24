---
layout: post
title: "Your Agent's Guardrails Were Written for Someone Else"
date: 2026-11-24 14:05:19 +0000
categories: [agentic-ai, llm-ops, enterprise-ai]
source: hn
source_id: "50627340"
discussion_url: https://news.ycombinator.com/item?id=50627340
source_url: https://michaelharley.net/posts/2026/11/01/llm-agents-work-for-their-parent-companies-not-for-you/
---

The sharp part of [this essay](https://michaelharley.net/posts/2026/11/01/llm-agents-work-for-their-parent-companies-not-for-you/) isn't the refusal — it's what the refusal exposes. A coding agent wouldn't help route around a broken Bandcamp API, then happily pulled the same track off YouTube, which pays the artist nothing. The guardrail wasn't protecting the user or the artist. It was protecting the vendor's liability surface, and the author caught the asymmetry.

In production agent systems, this is the thing you stop pretending about. A hosted model's refusals, its tool-use defaults, its "I can't help with that" boundaries — none of them are neutral. They encode the provider's risk tolerance, not your use case. Build enterprise agents on top of someone else's model and you inherit a policy layer you didn't write and can't fully inspect, one that fires at the worst moment: mid-workflow, on a legitimate task, because some input tripped a liability heuristic. The answer isn't jailbreaking. It's owning the policy layer yourself — your own guardrails, your own allow/deny logic, an eval harness that treats a vendor refusal as a measurable failure mode instead of an act of God.

The author's instinct to pull the model into his own homelab is honest, but "open" isn't the same as "aligned to me." Training data shapes refusals as much as weights do, so a local model still carries whoever's values were in the corpus. The real question for anyone shipping agents is whether you actually know which of your agent's "no"s come from your policy and which come from the vendor's. The [HN discussion](https://news.ycombinator.com/item?id=50627340) is full of people realizing they don't.

My bet: the next real differentiator in enterprise agents isn't the base model — it's whose policy layer sits on top, and whether you can audit it.
