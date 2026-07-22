---
layout: post
title: "The Sampling Knobs You Tuned for Years Just Stopped Working"
date: 2026-07-22 03:02:56 +0000
categories: [llm-ops, ai-infrastructure]
hn_id: 48998606
hn_url: https://news.ycombinator.com/item?id=48998606
source_url: https://ai.google.dev/gemini-api/docs/latest-model
---

The interesting part of Google's [latest-model API notes](https://ai.google.dev/gemini-api/docs/latest-model) isn't a new benchmark — it's that `temperature`, `top_p`, and `top_k` are now deprecated and ignored on Gemini 3.6 Flash and 3.5 Flash-Lite, and future generations return an HTTP 400 if you send them at all.

If you run LLM ops in production, this quietly breaks a pile of assumptions. Half the eval harnesses I've seen treat temperature as a first-class sweep axis, and most orchestration wrappers pass a default `temperature=0` on every call. Those wrappers start throwing 400s the moment a future model release lands — and nobody will have touched a line of their own code.

The deeper shift is philosophical. Google's guidance is to get determinism from a system instruction with explicit rules, structured outputs to pin the format, and `thinking_level` to set reasoning effort — declarative constraints instead of a probability dial. Prefilled model turns are gone too; you move to the Interactions API. The provider is taking the low-level sampling surface away and handing you higher-level knobs it controls.

I think that's the right call for agentic systems, where one stray high-temperature sample nine tool-calls deep is a reproducibility nightmare. But it moves determinism from something you own to something you rent. The "we froze temperature at 0 for the eval" story no longer means what it used to.

The [HN thread](https://news.ycombinator.com/item?id=48998606) is already full of people whose abstraction layers hardcode these params. If you maintain one, now's the time to make temperature a no-op you strip, not a default you send. How many of your prod calls pass a sampling param you never actually tuned?
