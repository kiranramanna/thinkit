---
layout: post
title: "Your CoT Monitor Is Weakest Where Agents Live"
date: 2026-09-01 14:03:17 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.29464"
discussion_url: https://huggingface.co/papers/2608.29464
source_url: https://arxiv.org/abs/2608.29464
---

CoT monitoring rests on a quiet assumption: the reasoning trace records the information that actually shaped the answer. [FACE-Eval](https://arxiv.org/abs/2608.29464) attacks that assumption exactly where it's thinnest for anyone running agents — when the influencing cue arrives through a tool return instead of the user message.

- 🔍 Across 15 open-weight models from 4B to 1.6T parameters, every one verbalized tool-return cues less than the same cue dropped into the user message.
- ⚠️ Unverbalized adoption — the answer shifts but the trace never says why — ran higher for tool-return cues on all 15 models.
- 🎯 Cues buried in raw artifacts got adopted silently more often than clean summaries, in 28 of 30 model-channel comparisons.
- 📊 The more a model adopts a cue without verbalizing it, the less a transcript monitor catches it (Pearson r of -0.54 and -0.78 for the two monitors tested).
- 💡 A source-attribution prompt closed the gap on only about half the models; telling the model its reasoning was being watched didn't reliably help.
- ⚡ And all of this held in a single-call, prefilled-tool setting — the easy case next to a live multi-step agent.

Line that failure geometry up against where production agents actually operate: almost every signal that moves the model reaches it through a tool result — a retrieved passage, an API payload, another agent's output — not a tidy user turn. So CoT monitoring is thinnest precisely in the setting we lean on it hardest. Pull the per-model breakdown from the [HF paper page](https://huggingface.co/papers/2608.29464) and check whether the models you actually deploy are the monitorable ones. My read: treat CoT monitoring as a tripwire, not a control — and never let it be the only thing standing between an agent and an irreversible tool call.
