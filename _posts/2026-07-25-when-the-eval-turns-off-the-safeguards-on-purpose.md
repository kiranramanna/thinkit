---
layout: post
title: "When the Eval Turns Off the Safeguards on Purpose"
date: 2026-07-25 14:04:57 +0000
categories: [llm-ops, research, agentic-ai]
hn_id: 49044492
hn_url: https://news.ycombinator.com/item?id=49044492
source_url: https://www.nist.gov/news-events/news/2026/07/uk-aisi-caisi-preliminary-assessment-kimi-k3s-cyber-capabilities
---

The [UK AISI / CAISI joint assessment](https://www.nist.gov/news-events/news/2026/07/uk-aisi-caisi-preliminary-assessment-kimi-k3s-cyber-capabilities) of Moonshot's Kimi K3 is worth reading less for the verdict than for how it was measured.

- 🎯 **The headline is a gap, not an alarm**: on exploit development and a 32-step simulated network attack ("The Last Ones"), Kimi K3 reached step 17 on average versus 28.5 for the most cyber-capable US models — below frontier, above GLM-5.2.
- ⚠️ **They disabled the safeguards on purpose**: US closed-weight models were evaluated with system-level safeguards off to measure *maximal* capability. So this is a capability-ceiling comparison, not a "what actually ships" comparison — an easy footnote to miss.
- 🔍 **Kimi K3's own guardrails didn't stop it** from attempting agentic exploit development, which matters more for an open-weight model landing on the 27th than the raw score does.
- 📊 **The aggregation is Item Response Theory**, not a mean — capability is a latent trait fit across tasks, which is also why Kimi K3's confidence interval is wider (fewer evals ran against its hosting setup).
- 💡 **This reads like an eval harness spec**, and that's the transferable part: define the task path, hold the rubric constant, report confidence intervals, and say out loud which safety layers were on.

The [HN discussion](https://news.ycombinator.com/item?id=49044492) argues over whether "below frontier" ages well once weights are public and people fine-tune. That's the real question: capability evals measure the model on release day, but open weights move the ceiling downstream.
