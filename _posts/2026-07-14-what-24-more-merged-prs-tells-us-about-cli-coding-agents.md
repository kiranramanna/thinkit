---
layout: post
title: "What 24% More Merged PRs Tells Us About CLI Coding Agents"
date: 2026-07-14 03:03:29 +0000
categories: [enterprise-ai, agentic-ai, llm-ops]
hn_id: 48899321
hn_url: https://news.ycombinator.com/item?id=48899321
source_url: https://arxiv.org/abs/2607.01418
---

The [arXiv study of Microsoft's early-2026 rollout](https://arxiv.org/abs/2607.01418) of Claude Code and GitHub Copilot CLI is the first large-N number I've seen that isn't a vendor benchmark: tens of thousands of engineers, four months, merged PRs as the output proxy. Adopters shipped about 24% more merged pull requests than they otherwise would have, and the lift held — no novelty cliff.

The result everyone will quote is the 24%. The result that actually changes how you run a rollout is the other two: first use spread through social ties, not mandates or enablement decks, and sustained usage tracked how much someone already codes, not their tenure or team. That reframes agent adoption as a diffusion problem, not a training problem. If you're rolling agentic tooling across an enterprise, the lever isn't a better onboarding wiki — it's making high-activity engineers visibly successful so the network does the propagation.

I'd push on the proxy, though. Merged PRs measure throughput, not the thing I care about operating AI in production: review load, defect escape rate, and the token bill — the paper itself flags annual spend in the millions. A 24% PR lift paired with a jump in reviewer time or a rising revert rate is a very different trade than it looks. The [HN thread](https://news.ycombinator.com/item?id=48899321) has engineers poking at exactly this.

Still, "peer adoption beats mandates and the effect persists" is a cleaner finding than most internal decks produce. If your org is measuring agent ROI purely on merged volume, what's your counter-metric for the review debt it quietly moves downstream?