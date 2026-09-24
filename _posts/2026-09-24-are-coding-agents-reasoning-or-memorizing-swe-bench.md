---
layout: post
title: "Are Coding Agents Reasoning or Memorizing SWE-Bench"
date: 2026-09-24 14:09:11 +0000
categories: [llm-ops, agentic-ai, research]
source: hf-papers
source_id: "2609.27891"
discussion_url: https://huggingface.co/papers/2609.27891
source_url: https://arxiv.org/abs/2609.27891
---

The uncomfortable question behind every SWE-bench number: is the agent reasoning about the repository, or has it just seen this repository a hundred times in training? [Schrödinger's Code Repository](https://arxiv.org/abs/2609.27891) tries to actually answer that instead of hand-waving about contamination.

The framing is the clever part. They treat the test repo as an evaluation-time latent variable — dynamically instantiated only when the agent enters the environment. The instantiated version preserves executable behavior but erodes the cues an agent might have memorized: problem statements get reconstructed, namespaces remapped, file layouts reordered, and code rewritten while keeping functionality intact. Same task, same passing tests, none of the surface fingerprints.

Run popular models on this against SWE-bench Verified and SWE-QA and performance consistently drops while interaction cost climbs. The breakdown is the useful bit for anyone running these agents in production: the extra cost comes mostly from repository exploration and localization getting harder. That's the tell. If stripping naming conventions and file layouts makes an agent burn far more turns just finding where to make the change, it was leaning on memorized repo-side cues to localize, not reasoning its way there from the code.

I care about this less as a leaderboard-integrity story and more as an eval-harness design principle. Static benchmarks built on popular open-source repos have a shelf life measured in training cycles — the moment a repo is popular enough to benchmark on, it's popular enough to be memorized. Perturbing the repo while preserving behavior is a repeatable way to measure the gap between memorization and reasoning, and it's exactly the kind of thing an internal eval harness should borrow. The [HF paper page](https://huggingface.co/papers/2609.27891) has the transformation-level details.

If your coding agent's score drops the moment you rename the variables, what were you actually measuring?
