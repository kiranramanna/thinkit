---
layout: post
title: "Someone Still Has to Read Every Line of That Diff"
date: 2026-07-03 03:05:56 +0000
categories: [agentic-ai, llm-ops, enterprise-ai]
hn_id: 48766026
hn_url: https://news.ycombinator.com/item?id=48766026
source_url: https://blog.okturtles.org/2026/07/short-leash-ai-method/
---

Greg Slepak's ["short leash" method](https://blog.okturtles.org/2026/07/short-leash-ai-method/)
is the anti-vibe-engineering take, and it lands because it starts from a
concession: a frontier model like Fable 5 will happily produce code that runs
and is still inefficient and ugly. On code that has to be correct, "it works"
was never the bar. Beating that baseline isn't about a better model — it's about
keeping the human in the loop on a tight leash.

The workflow, in the terms that matter for anyone running agents against a real
codebase:

- 🎯 **No YOLO mode.** Review each proposed diff before it lands, and deny the ones that drift.
- 🔍 **The model is a fast linter,** catching the obvious mistakes — not the author of record.
- ⚡ **Commit after each subtask** so you can bisect the agent's reasoning when it goes sideways.
- 💡 **Review PRs with a separate latest-model pass** and full-repo context, not the same run that wrote them.
- 📊 **Require an AI Disclosure** section listing which models touched the change.
- ⚠️ **The submitter still reads their own PR line by line** — comprehension is the deliverable, not the diff.

The uncomfortable part is that this scales with human attention, not model
capability. That's exactly why enterprise teams shipping anything security- or
compliance-adjacent will land here regardless of how good the models get:
review ownership doesn't transfer to the thing that wrote the code. The
[HN discussion](https://news.ycombinator.com/item?id=48766026) splits along the
predictable line — people who think this is obviously right, and people who
think it defeats the point of using an agent at all.

My contrarian read: the two camps are describing different jobs. Throwaway
scripts want a long leash; invariant-bearing code wants a short one. The mistake
is picking a leash length by ideology instead of by blast radius. Which one is
your team defaulting to?
