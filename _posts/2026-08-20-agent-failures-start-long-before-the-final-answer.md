---
layout: post
title: "Agent Failures Start Long Before the Final Answer"
date: 2026-08-20 03:03:23 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.16002"
discussion_url: https://huggingface.co/papers/2608.16002
source_url: https://arxiv.org/abs/2608.16002
---

Most uncertainty signals we bolt onto agents are watching the wrong moment. Token probabilities, predictive entropy, per-step confidence — they all score the final answer, or the step you happen to be on. [RUPA](https://arxiv.org/abs/2608.16002) argues that agent failures usually originate several reasoning or tool-call steps earlier, and by the time your local confidence signal dips, the trajectory is already lost. Anyone who has debugged a multi-agent workflow knows the feeling: the last step looks fine, the answer is wrong, and the real mistake was a tool result three hops back that everything downstream trusted.

RUPA's structure is the part worth stealing. It represents an execution history as a directed trajectory graph — reasoning states, tool interactions, and environment feedback as nodes, joined by temporal and semantic dependency edges — then propagates uncertainty across that graph so risk introduced early surfaces in the confidence estimate for the whole run. It's the difference between asking "how sure is the model right now" and "how much accumulated risk is this trajectory carrying." Evaluated on τ-2, Terminal-Bench 2, and GAIA across six open models, it beats local UQ methods on accuracy and, more usefully, flags failures earlier.

Earlier detection is the operational payoff I care about. If uncertainty crosses a threshold at step 4 of a 20-step task instead of at the end, you can escalate to a human, fall back to a deterministic path, or abort before burning tokens on a doomed run. Latency and cost budgets on long-horizon agents live or die on exactly that early exit. The [HF paper page](https://huggingface.co/papers/2608.16002) has the graph-construction details.

The catch: a trajectory graph is only as good as the dependency edges you draw, and "semantic dependency" is doing heavy lifting there. Get those edges wrong and you propagate confident nonsense — which is the exact failure mode this was supposed to catch.
