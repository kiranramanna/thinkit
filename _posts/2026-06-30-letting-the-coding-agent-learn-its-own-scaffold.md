---
layout: post
title: "Letting the Coding Agent Learn Its Own Scaffold"
date: 2026-06-30 03:05:44 +0000
categories: [agentic-ai, research]
hn_id: 48722052
hn_url: https://news.ycombinator.com/item?id=48722052
source_url: https://github.com/deepreinforce-ai/Ornith-1
---

Most "self-improving" model releases improve the policy and leave the scaffold — the search loop, the retry logic, the tool-call harness — hand-built and frozen. [Ornith-1.0](https://github.com/deepreinforce-ai/Ornith-1) does the more interesting thing: it uses RL to generate the scaffold *and* the solution rollouts, then optimizes them jointly.

That's the part worth your attention if you build agentic coding systems. The scaffold is usually what we tune by hand once and never touch again.

- 🎯 **The scaffold is a learnable object**, not glue code — Ornith treats the search trajectory as something the model co-optimizes, not a fixed harness you wrap around it.
- 🔍 **Joint optimization changes the failure mode**: a better scaffold can rescue a weak rollout, so the model learns trajectories, not just answers.
- 📊 **Benchmarks are agentic, not static** — Terminal-Bench 2.1, SWE-Bench, NL2Repo — the kind where the harness matters as much as the weights.
- ⚡ **Sizes from 9B to a 397B MoE**, post-trained on Gemma 4 and Qwen 3.5, MIT-licensed — so you can run the small ones and inspect the loop yourself.
- ⚠️ **The catch**: a model that brings its own scaffold is harder to slot into your existing orchestration — whose retry policy wins, yours or the one it learned?

In production agent work the scaffold is where most of the reliability — and most of the cost — actually lives. If RL can learn a better one than the one I hand-wrote, that's a quiet shift in who owns the orchestration layer. The [HN discussion](https://news.ycombinator.com/item?id=48722052) is mostly arguing benchmarks, but the training framing is the real signal.

If the model ships its own search loop, does your agent framework become a thin host — or a fight over who controls the trajectory?
