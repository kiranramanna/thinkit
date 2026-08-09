---
layout: post
title: "When the Judge Rubber-Stamps Your Agent's Failures"
date: 2026-08-09 03:03:44 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2607.28609"
discussion_url: https://huggingface.co/papers/2607.28609
source_url: https://arxiv.org/abs/2607.28609
---

If you evaluate computer-use agents with a VLM-as-judge, your reported pass rate is inflated in a specific, predictable direction. That's the uncomfortable finding in OSReward: the model grading your agent trajectories carries a systematic leniency bias, accepting failed runs as successes far more often than it rejects real ones. A judge that mislabels failures is worse than a noisy judge — it fails in the direction that makes your dashboard look good.

The [arXiv paper](https://arxiv.org/abs/2607.28609) benchmarks VLM judges against real cross-platform agent trajectories with multi-stage human ground-truth verdicts, then isolates the genuinely hard cases into a challenge set. Even state-of-the-art judges fall short of an ideal one there. The judges reliable enough to trust are too expensive to run at scale; the affordable open models trail badly. To close the gap the authors release an open corpus of reasoning-annotated verdicts and train open reward models that reportedly match commercial judges at 30–60% lower cost. The [HF paper page](https://huggingface.co/papers/2607.28609) links the code, benchmark, and checkpoints.

The cost story is the headline, but the diagnosis is the part I'd act on. In production, an LLM-as-judge that rubber-stamps failures doesn't just overstate a number — it poisons everything downstream that trusts the verdict. Data curation keeps bad trajectories. RL rewards the wrong behavior. Regression looks like progress because the judge grades the agent's self-assessment, not the outcome. Any eval harness that verifies agent runs with a model judge should first measure the judge's leniency against a human-labeled hard set, before quoting a single agent metric.

So here's the question worth asking of your own stack: do you know your judge's false-success rate, or are you reporting your agent's pass rate on faith?
