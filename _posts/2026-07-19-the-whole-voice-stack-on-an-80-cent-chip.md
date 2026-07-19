---
layout: post
title: "The Whole Voice Stack on an 80-Cent Chip"
date: 2026-07-19 03:06:04 +0000
categories: [conversational-ai, ai-infrastructure]
hn_id: 48911793
hn_url: https://news.ycombinator.com/item?id=48911793
source_url: https://github.com/moonshine-ai/moonshine/tree/main/micro
---

We put the voice-agent pipeline in the cloud because we assumed the models were too big to live anywhere else. [Moonshine micro](https://github.com/moonshine-ai/moonshine/tree/main/micro) is a good reason to re-check that assumption. It runs the full front end — voice activity detection, speech-to-text, and neural text-to-speech — on a Raspberry Pi RP2350 that costs about 80 cents, in roughly 470 KB of RAM, with the three stages time-sharing a single ~384 KB TFLM arena. Classification and synthesis land in about 0.7–1.0 seconds, and it's MIT licensed.

The number that matters for conversational AI isn't the footprint, it's the network leg it deletes. A huge share of virtual-agent traffic is wake word, short commands, yes/no, slot confirmation — turns that never needed a GPU or a round trip. Pushing that to the edge changes the latency budget structurally (no network hop on the common path) and changes the privacy story completely: for those turns, audio never leaves the device.

The catch is right there in the design. The STT is a SpellingCNN, not Whisper — this is constrained-vocabulary recognition, not open-domain transcription. That's a feature, not a bug, but it means the real engineering question is routing: which turns resolve on-device, and which escalate to a cloud model. That's the same hybrid-retrieval instinct RAG systems already run on — cheap local first pass, expensive model only when the cheap pass isn't confident — applied to the audio front end instead of the document index.

The [HN thread](https://news.ycombinator.com/item?id=48911793) is mostly amazed at the size, which is fair. But size is the easy part to be impressed by.

My bet: within a year the interesting conversational-AI products won't be the ones with the biggest cloud model — they'll be the ones that got the on-device/escalate boundary right, so the cloud only sees the turns that actually need it.
