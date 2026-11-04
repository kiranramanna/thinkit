---
layout: post
title: "Routing Is a Signal Problem, Not a Model Problem"
date: 2026-11-04 14:13:41 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.05275"
discussion_url: https://huggingface.co/papers/2611.05275
source_url: https://arxiv.org/abs/2611.05275
---

The useful result in [Route Anything](https://arxiv.org/abs/2611.05275) isn't the AGI framing in the abstract — it's a theorem most teams running a model gateway have felt without naming: a router's attainable performance is bounded by the information it gets about each request. You can't route your way past a signal you never captured.

- 🎯 **Oracle routing beat the best single candidate by 5.4 points** — the ceiling for picking the right model per input is real, not a rounding error.
- ⚡ **Routing raised efficiency ~8.8x on average** against the reference model; that's a larger lever than most teams' next model upgrade.
- 🔍 **Learned routers edged past the oracle by 0.3–2.1 points** on some tasks while using 24% less policy time — exploiting signal the oracle's per-input view doesn't carry.
- 📊 **The real contribution is the data**: 374,401 scored runs across 452 candidate configs and 25 benchmarks spanning text, image, video, speech, coding, and robotics, laid out on the [HF paper page](https://huggingface.co/papers/2611.05275).
- ⚠️ **Omni-modal routing is still mostly headroom** — the gap between oracle and learned routers is where the next year of work lives.

What I take from this: the question isn't "which model is best," it's "what do I actually know about this request at routing time, and is it enough to tell the candidates apart." Most production routers I've seen decide on a crude feature or two and leave the rest of that 8x on the table.

If a learned router can beat a per-input oracle by reading signal the oracle can't see, how much of your routing budget belongs on bigger models versus on better request features?
