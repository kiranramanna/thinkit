---
layout: post
title: "Agents Need Throwaway Infra, Not Another OAuth Wall"
date: 2026-06-21 03:05:12 +0000
categories: [agentic-ai, ai-infrastructure]
hn_id: 48608394
hn_url: https://news.ycombinator.com/item?id=48608394
source_url: https://blog.cloudflare.com/temporary-accounts/
---

Cloudflare's [temporary accounts for agents](https://blog.cloudflare.com/temporary-accounts/) read like a small product launch, but the interesting part is the constraint it admits out loud: every signup flow we've built — browser OAuth, dashboard clicks, copy-pasted tokens, an MFA prompt with a 60-second timer — is a wall built for a human, and a background agent slams into it face-first. `wrangler deploy --temporary` gives the agent a live Worker for 60 minutes with no account at all, claimable later or left to expire.

- 🎯 **The bottleneck was never compute, it was onboarding.** An agent with no human in the loop can't satisfy a "click here in 60 seconds" step, so it stalls or quietly routes around you.
- ⚡ **Trial-and-error is the whole point.** Agents need a tight write → deploy → verify loop; cheap throwaway targets let them curl their own output and judge whether they got it right.
- 🔍 **Ephemeral by default is also a blast-radius story.** An account that auto-expires in an hour is a smaller credential to leak than a long-lived API token sitting in an agent's context window.
- ⚠️ **The flip side is abuse.** Frictionless, anonymous deploy is exactly what a spam or malware pipeline wants too — the 60-minute expiry and claim step are the only guardrails between "agent productivity" and "free disposable infra for anyone."

This is the same realization I keep hitting in agentic systems: the orchestration logic is rarely the hard part. The hard part is that every downstream tool assumes a human will pause, authenticate, and consent. The [HN discussion](https://news.ycombinator.com/item?id=48608394) is already split between "finally" and "this will get abused in a week," which is the right tension.

My prediction: temporary, scoped, auto-expiring credentials become the default shape for agent access to any platform within a year — and the providers that keep forcing agents through human OAuth will simply get designed around. Which side of that wall is your service on?
