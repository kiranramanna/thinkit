---
layout: post
title: "The Hard Part of a 24/7 Desktop Agent Isn't the Demo"
date: 2026-07-21 14:05:35 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48981703
hn_url: https://news.ycombinator.com/item?id=48981703
source_url: https://www.kimi.com/products/kimi-work
---

Moonshot's [Kimi Work](https://www.kimi.com/products/kimi-work) pitches a desktop
agent that reads your local files, drives a browser, and runs on a built-in cron
engine — "set it and forget it," 24/7. The demo prompt (find every quarterly-report
PDF in a folder and summarize it) is the easy 20%. The 80% nobody screenshots is
what happens on run 400 at 3am when the browser DOM shifted, a file lock throws, or
the model confidently summarizes the wrong document.

Running agentic systems in production, the capability was rarely the constraint.
The constraint was the operational envelope around it:

- 🎯 **Retries with idempotency** — a cron-driven agent that isn't idempotent will
  happily duplicate work or corrupt state on the second attempt
- ⚠️ **Blast radius** — local file write + browser automation + unattended execution
  is a large surface; the interesting question is what it *can't* touch, not what it can
- 🔍 **Failure observability** — an autonomous loop that fails silently overnight is
  worse than one that never ran; you need traces, not vibes
- 💡 **Confidence gating** — knowing when to stop and ask a human is the feature that
  separates a tool from a liability

None of this shows up on a product page, which is exactly why the [HN thread](https://news.ycombinator.com/item?id=48981703)
is more useful than the launch copy — the sharp questions there are about
permissioning and recovery, not the slide generator.

The demo-to-dependable gap is where agentic products actually get built or die.
Unattended-around-the-clock is a strong claim; it means the reliability engineering
has to be better than the model, not the other way around. When "set it and forget
it" meets a flaky enterprise SaaS UI at scale, does the agent degrade gracefully or
just fail confidently — and how would you even know which one happened?
