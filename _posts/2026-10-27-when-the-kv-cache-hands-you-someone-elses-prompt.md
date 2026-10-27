---
layout: post
title: "When the KV Cache Hands You Someone Else's Prompt"
date: 2026-10-27 03:05:53 +0000
categories: [llm-ops, ai-infrastructure, enterprise-ai]
source: hn
source_id: "50252159"
discussion_url: https://news.ycombinator.com/item?id=50252159
source_url: https://blog.cloudflare.com/kv-cache-exposure-remediation/
---

The LLM security bugs that keep me up aren't jailbreaks. They're the plumbing. [Cloudflare's write-up](https://blog.cloudflare.com/kv-cache-exposure-remediation/) on GLM-5.3 in Workers AI is a clean example: 155 responses came back carrying KV cache data from *other customers'* earlier requests, and the trigger was mundane — prompts longer than the cache pool the model was actually provisioned for.

- 🎯 **Root cause was a config mismatch, not a model flaw**: a million-token advertised context on top of a ~681K-token prefill KV pool. The gap was known before launch and waved through because the long-context tests returned HTTP 200.
- ⚠️ **The real bug lived downstream**: when a prompt didn't fit, the serving engine swapped in a one-token placeholder instead of erroring, and the admission queue checked "finished?" not "rejected?" — so decode attended over stale KV pages still holding someone else's data.
- 🔍 **HTTP 200 is not success**: every leaking request returned a clean 200. If your monitoring only watches status codes and latency, this failure mode is invisible.
- 💡 **Detection came from outside**: a researcher reported it through HackerOne; the team reproduced cross-account leakage with two independent accounts in 25 minutes and took the model private within the hour.
- ⚡ **The durable fix is structural**: retire a rejected request before any KV transfer happens, and assert KV-pool size against context length for every disaggregated deployment — not just the one model that bit you.
- 📊 **Tag-and-verify is the direction worth watching**: per-page KV tags checked at read time, reportedly under 1% overhead. Isolation you can prove beats isolation you assume.

The [HN discussion](https://news.ycombinator.com/item?id=50252159) has the predictable "how was this not caught in testing" thread, but the honest answer is that correctness tests and isolation tests are different tests — and most serving stacks only write the first kind. If you run multi-tenant inference, when did you last assert that request B cannot see request A's cache?
