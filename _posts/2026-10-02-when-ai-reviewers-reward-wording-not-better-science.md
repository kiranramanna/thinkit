---
layout: post
title: "When AI Reviewers Reward Wording, Not Better Science"
date: 2026-10-02 14:08:15 +0000
categories: [llm-ops, research]
source: hf-papers
source_id: "2609.39027"
discussion_url: https://huggingface.co/papers/2609.39027
source_url: https://arxiv.org/abs/2609.39027
---

LLM-as-judge is load-bearing in most eval pipelines now, and this paper names a failure mode a lot of us have felt but never measured: the judge rewards how an answer is written, not what it actually says.

- 🎯 **Rhetorical robustness** is the right frame — a judge should stay stable across content-preserving rewrites *and* still discriminate between genuinely different work. Most "consistency" checks only test the first half.
- ⚠️ **False robustness** is the trap: [RobustReview](https://arxiv.org/abs/2609.39027) shows low rewrite-sensitivity often just means scores collapsed into sameness across papers. A judge that hands everything a 7 looks robust and is useless.
- 📊 1,260 manuscript versions across 30 reviewer configs — and human alignment ranks reviewers *differently* than rhetorical robustness does. Pick a judge on human-agreement alone and you never see this axis.
- 🔍 Content-focused prompting didn't reliably fix it across backbones. You can't prompt your way out when the weakness is structural.
- 💡 **SciCore** is the stealable idea: average a full-manuscript judgment with a second judgment over an extracted, structured "science core," so wording carries less weight in the final call.

Swap "manuscript" for "support ticket" or "agent trajectory" and this is every production LLM-judge I've shipped — the judge quietly tracks fluency, and your offline metric drifts from what users actually care about. The [HF paper page](https://huggingface.co/papers/2609.39027) has the breakdown. If your eval judge scores a verbose answer above a terse correct one, you're measuring rhetoric too — do you know by how much?
