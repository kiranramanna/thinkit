---
layout: post
title: "Your Voice Agent Fails Before the Tool Ever Fires"
date: 2026-11-23 03:05:36 +0000
categories: [conversational-ai, agentic-ai, research]
source: hf-papers
source_id: "2611.25773"
discussion_url: https://huggingface.co/papers/2611.25773
source_url: https://arxiv.org/abs/2611.25773
---

The number everyone will quote from [Duopra](https://arxiv.org/abs/2611.25773) is the Pass@1 jump from 4.7% to 44.7%. The number worth sitting with is where the failures were hiding: on Full-Duplex-Bench v3, most of the task failures happened *before* any domain tool executed. The model held a fluent, interruptible conversation — turn-taking, backchannels, the works — and then never issued the backend request that would actually do the thing the user asked for. That's the gap most voice-agent demos paper over. Sounding natural and completing a task are different skills, and the second one is where production breaks.

The framing is the part worth stealing. Duopra treats the backend as a tool — a self-contained natural-language request — so a direct tool call and a delegated backend call share one action interface. That matters operationally because the failure modes get concrete instead of vibes: an unsent request can't execute, and an incomplete one misdirects whatever runs it. The three-stage recipe (protocol SFT, then full-duplex RL that rewards timely *and* complete execution, then a projector-only repair so the talker doesn't degrade after the reasoning model is retrained) is really an admission that you can't bolt tool use onto a full-duplex model without the dialog control regressing. Anyone who has shipped a virtual agent knows that tension — every time you make it better at doing things, it gets worse at listening.

The [HF paper page](https://huggingface.co/papers/2611.25773) reports the model reaching 47.7% calling tools directly and 49.3% with a DeepSeek backend — still under half, which is the honest read on how hard timely tool invocation under live speech really is. For anyone building conversational agents, the takeaway is to stop collapsing dialog fluency and task completion into one score. A benchmark that tells you failures cluster *before* the tool call is far more useful than one that only reports end-to-end success. So which half of your voice agent are you actually measuring — the talking, or the doing?
