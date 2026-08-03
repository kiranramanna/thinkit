---
layout: post
title: "A Frog, a Habsburg Jaw, and What SVG Benchmarks Reveal"
date: 2026-08-03 03:05:36 +0000
categories: [llm-ops, research]
hn_id: 49147622
hn_url: https://news.ycombinator.com/item?id=49147622
source_url: https://frogs.vaguespac.es/
---

Single-prompt "vibe" benchmarks get mocked, and mostly they earn it. But [the Habsburg-frog benchmark](https://frogs.vaguespac.es/) is a sharper instrument than it looks: one fixed prompt — generate an SVG of a frog with a Habsburg jaw — run against 14 models, three tries each per month. Forty-two runs, forty-two produced valid SVG. The scoring isn't "which frog is prettiest"; it's what that prompt forces a model to do.

- 🎯 It's an instruction-following test: "Habsburg jaw" is prognathism the model has to render as geometry, not a token it can pattern-match to a stock frog.
- 🧩 It's a compositional spatial-reasoning test — coordinates, paths, and gradients that all have to add up to a recognizable frog carrying one specific deformity.
- 🔁 Three samples a month makes it a drift tracker: same prompt, same model family, watch the output shift as weights get updated underneath you.
- 🔍 The annotations leak reasoning — Opus 5's SVG comments editorialize ("massive protruding mandible," an upper lip "tucked behind the jaw") instead of just labeling shapes.
- 📊 Everything is inspectable: raw SVG source, byte size, latency per run. That's more eval hygiene than a lot of "serious" leaderboards ship.

This is the pelican-on-a-bicycle lineage, and it works for the same reason. Saturated benchmarks stop discriminating, so people reach for weird, underspecified prompts where instruction-following and spatial composition still separate the field. It's no substitute for a real eval harness — no rubric, tiny n, no statistical power. But as a cheap, reproducible probe you can rerun monthly, it beats chasing another MMLU point. The [HN discussion](https://news.ycombinator.com/item?id=49147622) argues over contamination and taste. My question: how long until a model trains specifically on frog-with-a-Habsburg-jaw and the probe goes dark?
