---
layout: post
title: "Local Models for Coding: Throughput Isn't the Bottleneck"
date: 2026-06-16 03:04:13 +0000
categories: [llm-ops, agentic-ai, ai-infrastructure]
hn_id: 48542100
hn_url: https://news.ycombinator.com/item?id=48542100
source_url: null
---

The honest answer from anyone running production inference is "not yet, and tok/s was never the real question." The [Ask HN thread](https://news.ycombinator.com/item?id=48542100) asking whether people have fully swapped Claude or GPT for a local model on their daily coding loop is full of setups hitting 40-80 tok/s on a 3090 or an M-series Mac — and that number turns out to be almost irrelevant to whether the swap sticks.

What breaks isn't throughput. It's the agentic loop: multi-step tool use, staying coherent across a long edit-test-edit context, and following instructions when the plan has six steps instead of one. A 30B local model can write a clean function on the first try and then fall apart the moment it has to read a diff, decide what to run, and revise. That's the gap between a model that benchmarks well and one that survives an agent harness — and it's exactly what I watch for when evaluating models for production routing: completion rate across the loop, not single-shot quality.

The replies that ring true split the work. Local models take the cheap, high-frequency, privacy-sensitive tasks — autocomplete, commit messages, log triage — and frontier APIs keep the agentic heavy lifting. Same hybrid routing pattern a lot of production AI work already runs, just with the cost line drawn in a homelab instead of a budget review. The thing the [discussion](https://news.ycombinator.com/item?id=48542100) mostly dodges: if your only metrics are tok/s and a coding benchmark, how would you ever know a local model was good enough to trust with an autonomous edit? What's the eval that would actually convince you to cut the API cord?
