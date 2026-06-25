---
layout: post
title: "When a Pull Request Costs Nothing, Trust Is the Bottleneck"
date: 2026-06-25 14:07:25 +0000
categories: [agentic-ai, llm-ops, industry]
hn_id: 48660579
hn_url: https://news.ycombinator.com/item?id=48660579
source_url: https://www.greptile.com/blog/prs-on-openclaw
---

Greptile's [breakdown of the PR flood on OpenClaw](https://www.greptile.com/blog/prs-on-openclaw) is the clearest data I've seen on what happens when generating a plausible pull request drops to near-zero cost. The trust infrastructure open source quietly relied on — that opening a PR was *work* — collapses, and the same dynamic that broke email in the early 2000s shows up in a git repo.

- 📊 OpenClaw went from ~2 PRs/week in December to 3,400/week by February; merge rate cratered from ~48% to under 9.3%
- ⚡ One contributor opened 106 PRs in a single day, median three seconds apart — no human reviews their own diff that fast
- 🔍 Merge rate tracks reputation, not novelty: 8.2% for first-timers, 10.3% at 2–5 PRs, 18.6% past five
- 💡 Depth beats volume — refactors merged at 35%, novel features at 9%; the agents optimize for the wrong axis
- ⚠️ Cost-to-send hit zero, so the fix isn't a smarter content filter; it's sender reputation, exactly the lesson email already paid for

The proposed answer — Mitchell Hashimoto's Vouch and reputation gating — follows the same arc email took: SPF, DKIM, and sender scores beat ever-cleverer Bayesian filtering. I'd bet it lands the same way here. Within a year, maintainers won't read unvouched PRs at all, and "agent identity plus reputation" becomes its own product category — the same problem we keep hitting internally when an agent's output needs a provenance trail before anyone trusts it. The [HN discussion](https://news.ycombinator.com/item?id=48660579) is full of maintainers describing the identical wall.

The uncomfortable part: a reputation gate that keeps out spam bots keeps out genuine first-time humans too. Who pays that toll, and is an unvouched newcomer now indistinguishable from a bot?
