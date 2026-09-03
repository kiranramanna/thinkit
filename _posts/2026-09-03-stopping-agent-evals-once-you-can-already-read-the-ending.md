---
layout: post
title: "Stopping Agent Evals Once You Can Already Read the Ending"
date: 2026-09-03 14:09:38 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.02783"
discussion_url: https://huggingface.co/papers/2609.02783
source_url: https://arxiv.org/abs/2609.02783
---

The bill for a single SWE-bench-shaped agent eval pass is often measured in the low four figures, and I've watched teams burn a real slice of a quarter's budget just to learn that their new prompt template is 1.4 points better than the old one. The interesting move in [EarlyEval](https://arxiv.org/abs/2609.02783) is not another benchmark distillation — it's a killswitch on individual runs.

The setup is small on purpose. Two LightGBM classifiers — one predicting success, one predicting failure — run over the agent's intermediate trace: behavioral features, textual features, a whiff of reference-solution signal. When either crosses a calibrated confidence threshold, the harness halts the run and records the predicted outcome. Reported numbers on SWE-bench Verified, TerminalBench, and Toolathlon: 13-26% fewer steps, up to 44% fewer input tokens and 29% fewer output tokens, with resolve rates perturbed by only one or two points on average.

That last clause is where the operational tradeoff lives. In my world an eval that shifts pass rate by two points is not a free efficiency win — it's a shift in the ranking metric that a downstream reranker or gating harness may actually key on. The gain is real, but it lands on the "reject when you need statistical parity across a model rev-lock, accept when you're prompt-sweeping" side of the decision matrix.

- 💡 **Instrument the trace first** — behavioral features are only cheap if you were already emitting them
- 📊 **Calibrate per benchmark**, not once per suite; SWE-bench and Toolathlon have different failure signatures
- ⚠️ **Watch the two-point drift** — it kills tight-margin A/B comparisons between adjacent prompt revisions
- 🎯 **Great fit for iteration loops** where absolute cost dominates and rank preservation is the only property you need

The [HF paper page](https://huggingface.co/papers/2609.02783) has the results table if you want to see how the classifiers behave near the edge of their calibration.

What's the first eval in your harness you'd be willing to trade two points of resolve rate for a 40% token cut on?
