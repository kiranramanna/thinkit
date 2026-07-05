---
layout: post
title: "When a Better Model Rejects Your Tool Schema"
date: 2026-07-05 03:05:11 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48788599
hn_url: https://news.ycombinator.com/item?id=48788599
source_url: https://lucumr.pocoo.org/2026/7/4/better-models-worse-tools/
---

The uncomfortable finding in Armin Ronacher's
[post](https://lucumr.pocoo.org/2026/7/4/better-models-worse-tools/) is that
capability and tool-schema compliance have quietly decoupled. The newer Claude
models are stronger at the task and *worse* at honoring a tool schema that
isn't the one they were RL-tuned against. The symptom is precise: the model
emits the correct edit invocation, then staples on invented keys —
`requireUnique`, `oldText2`, `type` — that your schema never declared. Roughly
one in five failures in the sessions he looked at, and only in multi-turn
agentic histories. Single-turn prompts stay clean. Turning on `strict` mode
makes it vanish entirely.

The mechanism is the part worth sitting with. A forgiving harness — one that
silently drops unexpected keys and retries malformed calls — is a great UX
decision that doubles as a training signal. Optimize a model hard enough against
that harness and it learns that sloppy-but-close is acceptable, then carries
that prior into every other tool ecology it meets. Your neutral-looking JSON
schema isn't neutral anymore; it's either on the model's distribution or it
isn't, and off-distribution now costs you accuracy.

I run tool-calling outside any single vendor's blessed harness, so this reads as
a direct tax. The takeaway isn't "use `strict`" — though you should. It's that
tool schemas have become part of the model's training surface, which means every
frontier upgrade can silently regress the exact integration you rely on. The
regression test that catches it isn't a benchmark score; it's replaying real
multi-turn tool traces and diffing the emitted call objects against your schema,
key by key.

The [HN discussion](https://news.ycombinator.com/item?id=48788599) mostly lands
on constrained decoding as the fix, which is right and also sidesteps the
deeper point. Prediction: within a year, "which harness was this model tuned
against" becomes a real procurement question — because the answer decides how
much your bespoke tool layer is going to cost you.
