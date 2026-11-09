---
layout: post
title: "When to Hand Your Agent Off to a Cheaper Model"
date: 2026-11-09 14:13:46 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.35959"
discussion_url: https://huggingface.co/papers/2610.35959
source_url: https://arxiv.org/abs/2610.35959
---

Most agent cost-control I've run operates at the query level: route this request to the cheap model, that one to the frontier model, done. [AgentBaton](https://arxiv.org/abs/2610.35959) asks a sharper question — inside a single long-horizon task, can a capable model and a cheap one split the work by taking turns?

The useful finding is which direction the handoff should go. Starting cheap and escalating to capable ("efficient-to-capable") barely saved anything and often hurt: the cheap model digs a hole the expensive one then has to climb back out of. The reverse — let the capable model do the early reasoning, then hand *down* to an efficient model once the trajectory is on rails — preserved accuracy and cut API cost by about 66% across 11 model pairs. Sometimes accuracy went up, because the cheaper model is less inclined to second-guess a plan that's already working.

The part that lands for anyone running orchestration in production is that a single, well-timed handoff was enough. No continuous arbitration, no per-step router adding its own latency and failure modes. AgentBaton is a lightweight (~2B) detector that watches task progress and fires once. That is a far easier thing to operate than a dynamic routing policy you have to keep retraining as your model mix shifts.

The open question for me is whether "well-timed" survives contact with messier real workloads. Their handoff point is learned from recurring progress patterns on two benchmarks, and my agents fail in ways that don't look like smooth progress at all. If your task's hard part is genuinely front-loaded, hand down early and pocket the savings — but how do you detect the hard part *moving*? The [HF paper page](https://huggingface.co/papers/2610.35959) has the per-pair numbers worth checking against your own routing setup.
