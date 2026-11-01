---
layout: post
title: "Your Quantized Model Downloaded Cleanly and Still Can't Code"
date: 2026-11-01 03:05:45 +0000
categories: [llm-ops, ai-infrastructure, research]
source: hf-papers
source_id: "2609.05881"
discussion_url: https://huggingface.co/papers/2609.05881
source_url: https://arxiv.org/abs/2609.05881
---

We spend a lot of energy on model provenance — checksums, signed artifacts, SBOMs — and this [arXiv paper](https://arxiv.org/abs/2609.05881) quietly points out that none of it tells you whether the model works. The authors screened every code-capable GGUF tag in the official Ollama library plus popular community files, and the failure mode is the part that should worry you: the broken ones aren't corrupted.

- 🔍 **2.3% of official low-bit tags were non-functional** — seven tags solving at most six of 164 HumanEval+ tasks, all low-bit quants of models at or below 4B parameters.
- ⚠️ **Reproducible is not functional**: five suspect files matched clean rebuilds from the original weights tensor-for-tensor. Your hash verifies, your provenance checks out, and the model still solves zero tasks.
- 💡 **The fix was calibration, not bytes**: adding an importance matrix took three Qwen2.5-Coder-3B builds from 0 to 76-113 solved tasks, same weights and toolchain.
- 📊 **The recipe alone doesn't predict failure**: the identical uncalibrated recipe left the smaller 1.5B model working, so you can't reason your way to "safe" — you have to run it.
- ✅ **A cheap screen catches it**: a 15-task code smoke test flagged every suspect, and none of 66 passing tags turned out broken. They shipped it as `quantcheck`.

This is a supply-chain problem wearing a quality problem's clothes. The whole local-inference ecosystem assumes a registry tag that downloads cleanly is a tag that runs, and this is the first study I've seen that measures how often that assumption is wrong. The [HF paper page](https://huggingface.co/papers/2609.05881) has the audit data if you want to check your own tags.

If you serve quantized models, a functional smoke test belongs in your deployment pipeline next to the checksum — not in the postmortem after an incident. When did "it downloaded" quietly become "it works"?
