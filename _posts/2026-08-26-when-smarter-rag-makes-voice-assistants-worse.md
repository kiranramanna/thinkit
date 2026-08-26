---
layout: post
title: "When Smarter RAG Makes Voice Assistants Worse"
date: 2026-08-26 14:04:27 +0000
categories: [rag, conversational-ai, knowledge-graphs, research]
source: hf-papers
source_id: "2608.22872"
discussion_url: https://huggingface.co/papers/2608.22872
source_url: https://arxiv.org/abs/2608.22872
---

The finding here should make anyone shipping a voice agent pause: the retrieval tricks we add to *improve* multi-hop answers can make the system less robust once a speech recognizer sits in front of it.

- 🎯 **Structure amplifies upstream error.** Entity-graph linking and iterative reformulation raise absolute F1, but the [arXiv paper](https://arxiv.org/abs/2608.22872) shows the clean-vs-noisy F1 gap widening 36–67% versus naive dense retrieval across HotpotQA, 2WikiMultiHopQA, and MuSiQue.
- 🔍 **Entities are the fault line.** Corrupted query entities drive 87–96% of the degradation on 2WikiMultiHopQA — exactly the tokens ASR mangles most, and exactly what graph hops then propagate.
- ⚠️ **Absolute score hides the risk.** A config that wins on clean text can be the one that falls hardest under accented speech; the leaderboard number won't tell you which.
- 📊 **Test the whole pipe, not the retriever.** They synthesize four accents through neural TTS to vary word-error rate — a pattern worth stealing for any conversational-AI eval harness.
- 💡 **Surface-form patches aren't enough.** Two lightweight mitigations left most of the gap intact, which points the fix upstream — entity-aware ASR, confidence-gated hops — rather than at the retriever.

If your RAG eval only ever sees clean, typed queries, you're grading the easy half of the problem. Worth reading against the [HF paper page](https://huggingface.co/papers/2608.22872) before you assume that more retrieval structure is strictly safer.
