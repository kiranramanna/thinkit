---
layout: post
title: "The Hardest Skill for a Voice Agent Is Silence"
date: 2026-09-29 14:49:59 +0000
categories: [conversational-ai, llm-ops, research]
source: hf-papers
source_id: "2609.31948"
discussion_url: https://huggingface.co/papers/2609.31948
source_url: https://arxiv.org/abs/2609.31948
---

The benchmark that matters here scores an assistant on when it says nothing. [Duplex-MPE](https://arxiv.org/abs/2609.31948) drops a full-duplex speech model into a room with three or four humans across 2,000 scenarios, feeds it continuous audio with no transcripts and no turn boundaries, and grades four behaviors: starting a fresh response, answering correctly, preserving silence, and stopping once a human has already resolved the request. Three of those four are about restraint, not fluency.

That framing is closer to how a voice agent actually fails in production. Most duplex benchmarks assume one designated user talking to the assistant; a real deployment is a meeting, a support call with a supervisor listening in, a kitchen with two people arguing about dinner. The skill that separates a useful participant from an annoying one is knowing whether a request was addressed to you at all. The paper makes this concrete: a transcript-based Gemini 3.1 Pro reference answers explicit requests 64.3 percentage points more often than implicit ones, but the open-weight speech systems show no significant gap. They can't tell "assistant, what's the weather" from two humans wondering aloud about it — so they answer both.

MiniCPM-o 4.5 leads on three of the scored capabilities, but the pattern across systems is the tell: frequent speech coexists with inaccurate answers and failures to stay silent. For anyone building conversational agents, this is the multi-party version of the intent problem — addressing detection from raw audio, not a clean single-speaker channel. The [HF paper page](https://huggingface.co/papers/2609.31948) has the per-system breakdown and audio examples.

If the winning behavior is silence, most turn-taking metrics that reward responsiveness are scoring the wrong thing — how long before "did the assistant know it wasn't being talked to" becomes the headline eval?
