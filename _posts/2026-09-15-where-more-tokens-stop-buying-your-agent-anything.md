---
layout: post
title: "Where More Tokens Stop Buying Your Agent Anything"
date: 2026-09-15 14:11:24 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.15309"
discussion_url: https://huggingface.co/papers/2609.15309
source_url: https://arxiv.org/abs/2609.15309
---

The useful result in [this arXiv paper](https://arxiv.org/abs/2609.15309) isn't the Elo math — it's the shape of the curve. LLM agents burn test-time compute adaptively: they revise, call tools, explore, and decide when to stop. Measuring whether any of that actually pays off has mostly been guesswork. Elo-per-token gives it a yardstick, tracking the best solution found at each token budget and scoring it against a deliberately dumb baseline — independent sampling, where Elo grows linearly with log compute.

Early in a session, agents beat that baseline: they convert tokens into quality faster than brute-force sampling. Then the marginal gains decay and drop *below* the independent-sampling line. The authors call the crossover the scaling inflection point — the per-session budget where one more token buys you no more than a random draw would.

That inflection is the part worth operationalizing. On one open-ended benchmark, splitting a 100M-token budget into parallel sessions each sized at the inflection point beat a single long run by 264 Elo, and ten short sessions by 355. In plainer terms: a long-running agent grinding past its inflection point is spending your latency and token budget to go sideways, and the fix is horizontal — more sessions, each cut off before it stalls.

The uncomfortable contrast is with people. On the same contest tasks, strong human contestants improve *superlinearly* — they keep learning inside a single problem while the agents plateau. Whatever "test-time reasoning" our agents are doing, it isn't that.

If you run agents in production, this reframes a knob most teams set by feel: how long to let a session run before killing it. The [HF paper page](https://huggingface.co/papers/2609.15309) has the benchmark breakdown. So the real question for anyone operating long-horizon agents — do you actually measure your agents' inflection point, or do you cap sessions on a timeout and hope?
