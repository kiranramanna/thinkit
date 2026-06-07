---
layout: post
title: "The Sandbox Is the Hard Part of Agent Tool Use"
date: 2026-06-07 03:04:44 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 48425347
hn_url: https://news.ycombinator.com/item?id=48425347
source_url: https://simonwillison.net/2026/Jun/6/micropython-in-a-sandbox/
---

Every demo of an agent that "runs code" quietly skips the part that actually matters in production: where does that code run, and what can it touch? [Simon Willison's micropython-wasm experiment](https://simonwillison.net/2026/Jun/6/micropython-in-a-sandbox/) is worth attention precisely because it refuses to skip that question.

- 🎯 The real threat model isn't the model writing buggy code — it's that code executing with full privileges over your files, network, and secrets.
- ⚡ WASM plus MicroPython is a pragmatic pairing: a genuine Python runtime with no host filesystem or network access unless you explicitly hand it in.
- 🔍 The hard constraints are the boring ones — deny file reads, block outbound connections, cap memory and CPU — not the language semantics everyone obsesses over.
- ⚠️ Calling it a "vibe-coded sandbox" is refreshingly honest; an isolation layer you can't reason about formally is a liability, not a feature.
- 💡 For agentic tool use this is the missing primitive: most frameworks expose a code-execution tool and wave away isolation as someone else's problem.

This is the gap I keep hitting in production agent work — teams ship a code-exec tool, watch the eval numbers climb, and never write down what the blast radius is when the agent calls it on real data.

The [HN discussion](https://news.ycombinator.com/item?id=48425347) keeps circling the same uncomfortable point, and so do I: if your agent can execute arbitrary code, you don't have a tool-use feature — you have an untrusted-code-execution problem you haven't named yet. Who's auditing the sandbox in your stack?
