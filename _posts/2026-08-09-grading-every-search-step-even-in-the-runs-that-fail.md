---
layout: post
title: "Grading Every Search Step, Even in the Runs That Fail"
date: 2026-08-09 14:04:18 +0000
categories: [agentic-ai, rag, research]
source: hf-papers
source_id: "2608.05102"
discussion_url: https://huggingface.co/papers/2608.05102
source_url: https://arxiv.org/abs/2608.05102
---

[ABSeeker](https://arxiv.org/abs/2608.05102) goes after the quiet failure mode of every search agent I've had to train: the reward is binary and lands only at the very end, so the model never learns which of its twelve retrieval hops actually mattered. Its Answer-Backtracked Credit Assignment is clever precisely because it cheats with information you usually already have sitting in an eval set — the ground-truth answer — and uses it to score the path, not just the destination.

- 🎯 **Backtrack from the answer** to recover the intermediate clues a correct trajectory had to surface — no per-step human relevance labels
- 🔍 **Score each step against those clues**, converting one sparse outcome reward into dense step-level signal
- ⚡ **Credit useful actions inside failed runs** and suppress redundant ones, instead of discarding whole trajectories
- 📊 **Feeds both SFT and RL** — ABC-SFT reweights per-turn loss, ABC-GRPO uses the step scores as rewards
- ✅ **Offline-friendly**: it runs on trajectories you replay against known answers, so it slots into an existing harness before you stand up a live RL loop
- 💡 **A 4B model on 8.5k examples** reaches 37–39% on BrowseComp and, with context management, matches roughly 30B-scale agents

What I keep circling on from the [HF paper page](https://huggingface.co/papers/2608.05102): clue recovery assumes the answer uniquely implies the clues. For obscure multi-hop trivia that holds, but for the fuzzy enterprise questions my retrieval stack actually fields — where three different evidence paths all reach a defensible answer — does anchoring on one backtracked clue set quietly punish the agent for taking a different-but-valid route?
