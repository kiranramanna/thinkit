---
layout: post
title: "The GPU Shortage Is Really a Software Shortage"
date: 2026-06-03 03:03:59 +0000
categories: [ai-infrastructure, llm-ops]
hn_id: 48373675
hn_url: https://news.ycombinator.com/item?id=48373675
source_url: https://fergusfinn.com/blog/deepseek-v4-flash-mi300x/
---

The number that's hard to ignore in this [MI300X worklog](https://fergusfinn.com/blog/deepseek-v4-flash-mi300x/): 192GB of HBM3 per card against the H100's 80GB, comparable FP8 compute, list price roughly half — and you can rent one on-demand today while H100 capacity is sold out. The silicon isn't the bottleneck. The stack is.

The post is an honest log of getting DeepSeek-V4-Flash to serve on AMD when vLLM simply doesn't, and the failure modes are the ones that quietly eat infra teams alive:

- 🎯 **The cheap capacity is real** — MI300X sits underused mostly because the inference stack assumes CUDA
- ⚠️ **FP8 dialects don't transfer** — low-bitwidth formats that "just work" on Hopper need hand-holding on Instinct
- 🔍 **Missing attention fast paths** drop you back to slow kernels until you patch them in
- ⚡ **HIP graphs** are where both the latency wins and the sharpest edges live
- 📊 **"Comparable on paper" isn't comparable in prod** until someone does this unglamorous bring-up work

This is the part of LLM ops nobody demos. Picking an accelerator off a spec sheet is easy; the real cost shows up in the weeks of kernel-level yak-shaving before the model serves a single token at target latency. The [HN discussion](https://news.ycombinator.com/item?id=48373675) splits between "AMD is finally viable" and "this proves it still isn't" — both are right, depending on whether you have an engineer willing to write the worklog.

My bet: the teams that come out ahead in the next 18 months of the compute crunch aren't the ones with the best NVIDIA allocation — they're the ones who treated portability as an eval target before the shortage forced their hand. Is your inference stack one vendor outage away from a standstill?
