---
layout: post
title: "Intelligence Per Watt Makes Local Inference an Ops Call"
date: 2026-09-16 14:09:07 +0000
categories: [llm-ops, ai-infrastructure, research]
source: hn
source_id: "49694035"
discussion_url: https://news.ycombinator.com/item?id=49694035
source_url: https://arxiv.org/abs/2511.07885
---

The useful move here isn't "local models are good now" — it's giving the local-versus-cloud argument a number you can put in a budget. Task accuracy per watt turns a vibes debate into a routing policy.

- 🎯 **IPW = task accuracy per unit of power** — one metric that folds capability and efficiency together, which is exactly how you'd size an inference tier rather than picking a model by leaderboard.
- 📊 **Local LMs (≤20B active) already answer ~88.7%** of single-turn chat and reasoning queries in their eval; the frontier isn't required for most traffic.
- ⚡ **IPW climbed 5.3× in two years** — roughly 3.1× from models and 1.7× from accelerators — so the curve is compounding on both axes at once.
- ⚠️ **Local silicon still trails**: at least 1.4× lower IPW than cloud accelerators running the same model, so "local" is not free efficiency yet.
- 💡 **Hybrid routing is the real headline** — oracle routing cuts energy, compute, and cost by 70–80%, and even an 80%-accurate router keeps ~60% of the savings with cloud fallback covering quality.
- 🔍 The [arXiv paper](https://arxiv.org/abs/2511.07885) spans 20+ local models and a million real queries, which is enough substance to argue about — and the [HN discussion](https://news.ycombinator.com/item?id=49694035) is already doing exactly that.

The wider read has been optimistic. [Tomasz Tunguz](https://tomtunguz.com/intelligence-per-watt) frames it as the mainframe-to-PC moment for inference; [Snorkel AI](https://snorkel.ai/blog/intelligence-per-watt-a-new-metric-for-ais-future/) argues the metric should actively steer routine workloads to the edge; and a [Substack breakdown](https://bhakthan.substack.com/p/intelligence-per-watt-measuring-intelligence) reads local inference as a practical complement to the cloud through hybrid routing. I didn't find anyone pushing back hard yet — the consensus is that the live question has shifted from "can local models do this" to "where do you set the routing threshold," and that is a much healthier place for the argument to sit.
