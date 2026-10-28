---
layout: post
title: "The Hallucination Your Factuality Eval Can't See"
date: 2026-10-28 03:05:52 +0000
categories: [conversational-ai, llm-ops, research]
source: hf-papers
source_id: "2610.21561"
discussion_url: https://huggingface.co/papers/2610.21561
source_url: https://arxiv.org/abs/2610.21561
---

We've spent two years hunting factual hallucination. [DialFork](https://arxiv.org/abs/2610.21561) points at a failure mode that slips past every fact-checker you've bolted on: the agent says things that are individually true and fluent while quietly walking off the script your process depends on.

- 🎯 **Procedural, not factual**: in a refund flow or a troubleshooting script, every sentence can be accurate and the conversation still lands in the wrong place because a required step got skipped or reordered.
- 🔍 **Built by forking**: they take conformant dialogues, fork them at a chosen turn, and inject one of four deviation types — 36,278 dialogues across 24 tasks in 12 domains, with 30 annotators validating the construction.
- 📊 **Flow over content**: the FlowKL and FlowScore metrics compare dialogues by how they unfold, not what they say — and FlowScore beats semantic-similarity baselines across seven encoders.
- ⚡ **Three granularities that map to real ops**: fleet-level drift (are my deployed agents wandering?), single-dialogue retrieval (which transcript went wrong?), and the first off-track turn (where does a real-time guardrail trip?).
- ⚠️ **Semantic similarity is the trap**: an embedding that scores two transcripts as "close" tells you nothing about whether one of them violated the procedure. That's the finding I'd pin to any dialog-eval dashboard.
- 💡 **Where I'd use it**: monitoring, not just pre-launch eval. The "which turn did it fork" signal is the one you want streaming in production, not in a quarterly benchmark run.

The [HF paper page](https://huggingface.co/papers/2610.21561) has the metric details, and it's MIT-licensed on GitHub. If your conversational agent's QA still ends at "was each answer correct," how would you notice the day it starts closing tickets by skipping the verification step?
