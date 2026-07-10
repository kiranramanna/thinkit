---
layout: post
title: "Running a 744B Model by Streaming Experts off Disk"
date: 2026-07-10 14:06:17 +0000
categories: [ai-infrastructure, llm-ops]
hn_id: 48842459
hn_url: https://news.ycombinator.com/item?id=48842459
source_url: https://github.com/JustVugg/colibri
---

The interesting claim in [colibri](https://github.com/JustVugg/colibri) isn't
"744B model on a laptop" — it's the observation that makes it possible: in a
sparse MoE, only ~11 GB of the activated weights actually change from token to
token. Keep the dense attention and shared experts resident at int4, leave the
21,504 routed experts on disk, and stream them on demand with an LRU cache and the
OS page cache as a free second tier. That's a memory-hierarchy argument dressed up
as an inference engine, and it reframes what "model size" costs you at serving time.

- 🎯 **Sparsity is a storage problem, not a RAM problem** — ~40B active params per
  token, but the working set that turns over is tiny. Design your cache around that.
- ⚡ **Speculative decoding has a cold-start tax**: the native MTP head only helps
  (2.2–2.8 tokens/forward) once the expert cache is warm; cold, it routes to *more*
  experts and loses time. The engine ships an adaptive guard to turn it off.
- 🔍 **Quantization isn't uniform** — the draft head needs int8 or acceptance
  collapses to single digits, while the body runs int4. Precision is per-component,
  not per-model.
- 📊 **Compressed KV-cache** (MLA, 576 floats/token vs 32,768) is doing quiet work
  here; without it the streaming trick still drowns in cache.
- 💡 **"Zero dependencies, one C file"** is a real ops feature — no BLAS, no Python
  at runtime means a deploy surface you can actually reason about.

None of this makes disk-streamed inference fast enough for production serving. But
the [Show HN thread](https://news.ycombinator.com/item?id=48842459) is a good
reminder that the expensive part of a giant MoE is mostly cold — and cold weights
belong on cheap storage, not in your latency budget.

If routed experts are effectively cold storage, why are we still pricing these
models as if every parameter is hot?
