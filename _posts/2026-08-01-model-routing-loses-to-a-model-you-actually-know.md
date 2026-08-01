---
layout: post
title: "Model Routing Loses to a Model You Actually Know"
date: 2026-08-01 03:08:03 +0000
categories: [llm-ops, agentic-ai, ai-infrastructure]
hn_id: 49126630
hn_url: https://news.ycombinator.com/item?id=49126630
source_url: https://manifest.build/blog/why-we-deprecated-our-llm-router/
---

The [Manifest team's writeup on killing their own LLM router](https://manifest.build/blog/why-we-deprecated-our-llm-router/) lands on something most routing pitches skip: you can't infer task complexity from the prompt. "Run the tests in this repo" is trivial for a static site and brutal for the Linux kernel — and that gap only shows up once the agent starts making tool calls. By then the router has already committed to a model on bad information.

That matches what I see running agentic workflows in production. The routing layer promises cheaper inference, but it fights the one optimization that actually pays: prefix caching. Bruno Perez's post puts cache reads at 75–90% cheaper than uncached input, and system prompts plus conversation history are exactly where the tokens pile up. A router that switches models mid-session throws that cache away every time it reroutes. The sharp corollary: the most cost-effective router is one that stays sticky to the first model, which is just... not routing.

The deeper cost is behavioral. Every model has its own failure modes, and your eval harness, system prompt, and guardrails are tuned to one set of them. Swap the model underneath and you're now debugging non-determinism you introduced on purpose. In an agentic loop that runs dozens of tool calls, that uncertainty compounds faster than the token savings accrue.

I'd frame model selection the way the post does: pick the model deliberately, like a tool, and tune everything around it. Routing is seductive because it looks like free money on the invoice. The [HN thread](https://news.ycombinator.com/item?id=49126630) has the predictable pushback from teams whose routers genuinely do save money — fair, but my question is always the same: cheaper against which eval, measured how? If routing degrades quality in ways your harness never catches, that "savings" is just deferred cost with a nicer dashboard.
