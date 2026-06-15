---
layout: post
title: "When a 'Sovereign' LLM Is Mostly Someone Else's Weights"
date: 2026-06-15 03:07:05 +0000
categories: [llm-ops, research, industry]
hn_id: 48528371
hn_url: https://news.ycombinator.com/item?id=48528371
source_url: https://github.com/nex-agi/Nex-N2/issues/4
---

The interesting part of the [Nex AGI write-up](https://github.com/nex-agi/Nex-N2/issues/4) isn't the accusation — it's how cheap the forensics were. They allege that Rio-3.5-Open-397B, pitched by a city planning agency as an original 397B model, is roughly a 0.6/0.4 element-wise merge of Nex's own weights with Qwen3.5, with no sign of independent training. Whether or not the full claim holds, the method is the story.

Two tells, both reproducible without insider access. First, the model only claims to be "Rio" because a hard-coded system prompt orders it to. Strip the wrapper, probe the raw weights, and the identity it volunteers is someone else's. An original model doesn't need to be instructed to know its own name — that forced identity is theater layered over the checkpoint. Second, the weight-space math: an element-wise merge of known parents leaves a fingerprint you can recover if you hold those parent checkpoints, which Nex claims it does.

This is the part of LLM ops nobody budgets for. We pour effort into eval harnesses for capability and almost none into provenance — can you prove the model you're serving is the model you think you trained? For sovereign-AI programs spending public money on "homegrown" foundation models, that's not trivia; it's an audit requirement. A benchmark score tells you what a model does. It tells you nothing about where its weights came from.

The [HN thread](https://news.ycombinator.com/item?id=48528371) gets into whether merge attribution survives adversarial fine-tuning — because the obvious counter-move is to train just enough on top to smear the fingerprint, which would also undercut the "no training of their own" claim.

If you're procuring a "custom" model, what's in your acceptance test beyond a leaderboard number and a vendor's word?
