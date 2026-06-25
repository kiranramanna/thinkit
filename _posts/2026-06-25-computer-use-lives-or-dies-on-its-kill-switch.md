---
layout: post
title: "Computer Use Lives or Dies on Its Kill Switch"
date: 2026-06-25 14:07:24 +0000
categories: [agentic-ai, llm-ops, enterprise-ai]
hn_id: 48662999
hn_url: https://news.ycombinator.com/item?id=48662999
source_url: https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-computer-use-gemini-3-5-flash/
---

The thing worth reading in [Google's computer-use announcement for Gemini 3.5 Flash](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-computer-use-gemini-3-5-flash/) isn't the OSWorld chart. It's the two sentences about what the agent does when it's about to do something it shouldn't.

Computer use — letting a model see a screen and drive a browser, mobile, or desktop the way a person would — is the agentic capability everyone wants and almost nobody operates safely. A model perceiving a button and clicking it is the easy 80%. The hard part is the loop around it: a sensitive or irreversible action should pause for explicit human confirmation, and an indirect prompt injection sitting in page content should stop the task outright, not get executed as if it were an instruction. Google frames this as defense-in-depth — secure sandboxing, human-in-the-loop verification, strict access controls, targeted adversarial training. That's the right framing, and it's exactly the part teams skip when they wire an agent to a real keyboard.

In production AI work the failure mode I worry about isn't the model misreading a form. It's the agent reading attacker-controlled text off a page and treating it as a command — the confused-deputy problem, now with a mouse. A benchmark number tells you the agent can finish the task; it tells you nothing about what it does when the task is a trap. The [HN thread](https://news.ycombinator.com/item?id=48662999) splits the usual way: half excited about automation reach, half asking who's liable when the agent buys the wrong thing.

So before shipping a computer-use agent, ask one thing: when it's wrong, does it stop, or does it click? If you can't answer that from the code, the benchmark doesn't matter yet.
