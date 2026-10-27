---
layout: post
title: "Your Tool-Use Eval Assumes the Tools Hold Still"
date: 2026-10-27 14:06:30 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.34238"
discussion_url: https://huggingface.co/papers/2610.34238
source_url: https://arxiv.org/abs/2610.34238
---

Most tool-use benchmarks freeze the toolset the moment you start evaluating — fixed APIs, fixed docs, fixed names. Real ecosystems don't hold still: endpoints get deprecated, a better service shows up with overlapping functionality, and the documentation lies a little. [Δτ-Bench](https://arxiv.org/abs/2610.34238) is the first eval I've seen that treats that drift as the task itself.

- 🎯 **The frontier moves**: 1,588 multi-turn tasks across 42 domains, replayed over six successive ecosystem states built by capability-preserving transformations — same goals, different tools to reach them.
- ⚠️ **Everyone struggles**: the strongest model-plus-harness lands at 42.3% task success. This isn't a solved problem dressed up as a benchmark.
- 🔍 **Skill-learning doesn't save you**: early gains from accumulating "skills" don't reliably translate into adaptation once the ecosystem shifts under the agent.
- 💡 **Procedural knowledge rots**: an agent that memorized last month's tool path is carrying a liability, not an asset, the moment that path changes.
- ⚡ **Their answer, Steward**: manage tools and procedural knowledge together, with incremental skill maintenance and dynamic provisioning during execution, and recovery from broken workflows improves.
- 📊 **What I'd measure**: not just success rate, but how fast an agent *abandons* a stale tool path — the number that matters the week a vendor sunsets an API.

The [HF paper page](https://huggingface.co/papers/2610.34238) has the per-state breakdown. If your agent's "skills" are really just cached API call sequences, what happens the first time a dependency changes under it?
