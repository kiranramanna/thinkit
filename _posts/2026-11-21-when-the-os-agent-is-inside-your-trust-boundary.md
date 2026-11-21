---
layout: post
title: "When the OS Agent Is Inside Your Trust Boundary"
date: 2026-11-21 03:05:36 +0000
categories: [agentic-ai, llm-ops, industry]
source: hn
source_id: "50572348"
discussion_url: https://news.ycombinator.com/item?id=50572348
source_url: https://signal.org/blog/protecting-your-privacy/
---

The interesting thing about [Signal's decision to wall off OS-level AI agents](https://signal.org/blog/protecting-your-privacy/) isn't the privacy politics — it's that an encrypted app just formally declared the operating system an untrusted party. For anyone building agents, that's the trust boundary getting redrawn in public.

Signal now blocks screenshots on iOS 27 and turns on its "Screen security" setting on Android the moment it detects an assistant reading the screen; on macOS it says it can't, because the APIs to refuse don't exist. The claim underneath is the one worth sitting with: once an OS agent can read a decrypted conversation off the screen, end-to-end encryption is irrelevant to that data — the agent is already inside the boundary the encryption was built to defend. Every capability we advertise for agents (it sees the screen, acts across apps, carries context between them) is simultaneously a description of what it can exfiltrate.

That's the governance gap I keep running into from the builder's side. We pour effort into what an agent is allowed to do and almost none into a clean, auditable way for the apps it touches to say "not me." Signal is asking platform vendors for precisely that — a documented opt-out letting a sensitive app mark itself off-limits to agents. It's the agent equivalent of a robots.txt the agent can't quietly ignore, and today it mostly doesn't exist. The [HN discussion](https://news.ycombinator.com/item?id=50572348) has the builder-side reaction, and it's a long way from settled.

If the app boundary is the control surface agents are about to erase, does agent safety really belong in the model and the harness — or does it have to live in the OS, where the screen actually gets read?