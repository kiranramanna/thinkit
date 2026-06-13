---
layout: post
title: "Your Coding Agent Shouldn't Die With the Wi-Fi"
date: 2026-06-13 03:06:47 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 48507020
hn_url: https://news.ycombinator.com/item?id=48507020
source_url: https://ikyle.me/blog/2026/how-to-setup-a-local-coding-agent-on-macos
---

This [local-agent writeup](https://ikyle.me/blog/2026/how-to-setup-a-local-coding-agent-on-macos)
starts from a failure mode that cloud-first setups pretend doesn't exist: the
internet dropped and the coding agent went with it. The fix here isn't nostalgia
for offline tooling — it's that the active-parameter math finally pays off. A
26B model with roughly 4B active params (Gemma 4 26B-A4B), paired with a Q8 MTP
draft head for speculative decoding, runs at genuinely usable speed on a single
M1 Max with 64GB of unified memory.

The detail I'd underline for anyone building agent infrastructure is the
integration boundary: an OpenAI-compatible API, not a bespoke SDK. That one
choice means the local model drops into the same tools you already point at a
hosted endpoint — Pi as the terminal agent in this case, but it could be
anything. Add the multimodal projector and the agent can read a screenshot of
the UI it just generated, which closes the feedback loop that normally drags you
back to a frontier model.

None of this makes local the default. A ~17GB footprint and laptop-bound
throughput won't match a hosted frontier model on hard reasoning, and that's the
real decision — which tier of work each request actually deserves. The
[HN discussion](https://news.ycombinator.com/item?id=48507020) is full of people
drawing that line in different places. My bet: within a year, "does it still run
when the network drops" becomes a stated requirement in agent tooling rather
than a hobbyist flex. What's the first task you'd hand to a model that never
leaves your laptop?
