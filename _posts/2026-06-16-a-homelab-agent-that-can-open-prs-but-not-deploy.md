---
layout: post
title: "A Homelab Agent That Can Open PRs but Not Deploy"
date: 2026-06-16 03:04:13 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 48542433
hn_url: https://news.ycombinator.com/item?id=48542433
source_url: https://rsgm.dev/post/ai-dev-platform/
---

The [homelab writeup](https://rsgm.dev/post/ai-dev-platform/) reads like a hobby project, but buried in it is a governance pattern enterprise AI teams are still arguing about: how much autonomy do you hand a coding agent, and where's the hard stop?

- 🎯 The agent gets **its own git identity** with dedicated SSH keys — it can clone repos and push branches, but cannot push to the deploy branch. Least-privilege for a non-human actor, wired up in a homelab before most orgs have a written policy for it.
- ✅ **PR review is the hard stop**: the agent writes the change, a human merges it, and it never touches what ships. That's the entire safety story in one sentence.
- ⚡ The trigger was economic — vendor **token limits squeezing** the value out of Claude Code pushed the author toward vendor-agnostic tooling. Expect more of this as per-seat AI pricing tightens.
- 🔍 The first real use wasn't writing features, it was **reading release notes and adding healthchecks** — the unglamorous ops toil AI is genuinely good at compressing from hours to minutes.
- 💡 Running the agent as a **persistent server with sessions synced across devices** is the quietly important bit: the agent becomes infrastructure, not a chat window you reopen.

The design scales from this homelab to a regulated enterprise unchanged: give the agent an identity, scope its permissions, and keep every irreversible action behind human review. The [HN discussion](https://news.ycombinator.com/item?id=48542433) runs the usual "why not just run it locally" debate, but the access-control model is the part worth copying. If an agent has its own SSH keys and its own git user, isn't it time we threat-modeled agents the way we threat-model service accounts?
