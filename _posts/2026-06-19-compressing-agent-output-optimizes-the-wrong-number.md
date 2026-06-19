---
layout: post
title: "Compressing Agent Output Optimizes the Wrong Number"
date: 2026-06-19 03:03:49 +0000
categories: [llm-ops, agentic-ai]
hn_id: 48588755
hn_url: https://news.ycombinator.com/item?id=48588755
source_url: https://mroczek.dev/articles/the-token-compression-illusion-why-im-skeptical-of-rtk/
---

[Przemek Mroczek's skepticism of RTK](https://mroczek.dev/articles/the-token-compression-illusion-why-im-skeptical-of-rtk/) lands on the one thing most "token savings" tools dodge: the only metric that matters for an agent is whether it still finished the task.

RTK compresses terminal output before it reaches the LLM, and the headline "60-90% savings" has earned it 60k GitHub stars. But that number is the percentage of stdout stripped, not the drop in your actual API bill — and stdout is rarely where the tokens live. In every agent loop I've profiled, the weight sits in file reads, repo context, system prompts, and the model's own reasoning tokens. Trimming bash output optimizes the cheap part.

- ⚠️ **Silent failures are asymmetric**: if compression drops a stack-trace line, the agent never knows context went missing — it just hallucinates or spins in a loop.
- 📊 **No accuracy benchmarks**: token-saved graphs are everywhere, SWE-bench-style task-success rates are not. Saving 80% of a prompt is a net loss if the build fails.
- ⚡ **It's a feature, not a product**: the moment `git`, `npm`, or `cargo` ship a native LLM-friendly `--json-stream` mode, the wrapper's edge evaporates.
- 🔍 **Brittle parsing**: regex over human-readable CLI output breaks the day any tool tweaks its formatting by a few spaces.

This is the LLM-ops lesson that keeps repeating: cost and accuracy are a joint optimization, and any layer that improves one while hiding its effect on the other is a liability you debug at 2am. The [HN discussion](https://news.ycombinator.com/item?id=48588755) splits on whether lossy context compression can ever be safe inside a synchronous agent path.

My bet: the durable version of this isn't a stdout scrubber but structured, model-native tool output — and the CLIs themselves end up owning it. Would you let a lossy compressor sit in the critical path between your agent and your shell without a task-success eval gating it?
