---
layout: post
title: "What the Pelican Benchmark Says About Eval Validity"
date: 2026-07-23 03:03:13 +0000
categories: [llm-ops, research]
hn_id: 49010129
hn_url: https://news.ycombinator.com/item?id=49010129
source_url: https://dylancastillo.co/posts/pelicanmaxxing.html
---

Simon Willison's "draw a pelican riding a bicycle" prompt became the internet's favorite LLM smoke test, which makes it exactly the kind of signal a lab would be tempted to overfit. Dylan Castillo's [experiment](https://dylancastillo.co/posts/pelicanmaxxing.html) is worth reading less for its verdict — no evidence of gaming — than for how he got there.

The method is the point. Instead of eyeballing one pelican, he built an 8-animal × 6-vehicle grid (1,008 SVGs across seven frontier models), scored them with an LLM judge, and checked whether the pelican-bicycle cell was an outlier against its neighbors. If labs were pelicanmaxxing, the famous cell would light up while flamingos-on-unicycles stayed flat. It didn't. Difficulty-adjusted, the pelican scenes tracked the rest of the grid.

That's the whole discipline of eval design compressed into one blog post: a single hero prompt tells you nothing about generalization, and the only way to detect overfitting is to hold out neighbors the model wasn't tuned on and measure the gap. We hit the same wall on production eval harnesses — a metric that looks great on the golden set is worthless until you can show it holds on prompts nobody optimized against. Castillo's grid is a hold-out set in disguise, and his LLM judge is doing the micro-scoring work that makes these comparisons tractable at a thousand-plus samples.

The [HN thread](https://news.ycombinator.com/item?id=49010129) argues about whether the result is trustworthy given the judge is itself an LLM — a fair worry, and the real open question. When your benchmark and your grader come from the same family of models, what exactly are you measuring?
