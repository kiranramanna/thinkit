---
layout: post
title: "Handing an Agent a Whole Machine, Not a Container"
date: 2026-07-19 03:06:04 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 48959392
hn_url: https://news.ycombinator.com/item?id=48959392
source_url: https://ykdojo.github.io/claude-controls-mac/
---

The [step-by-step guide for turning a spare Mac into a machine Claude Code fully controls](https://ykdojo.github.io/claude-controls-mac/) reads like a hobbyist how-to, but the decision underneath it is the same one I make on every production agent deployment: where do you draw the blast radius?

The honest line in the post is that `--dangerously-skip-permissions` on your primary machine is the actual risk, and the fix is a separate environment with only the access it needs. That's exactly right. What's interesting is the author explicitly weighs a container against a second physical machine and picks the machine — because a container still runs on the box you care about, and because they want always-on computer use they can talk to from a phone. Convenience and capability won over isolation strength.

For a homelab that's a fine trade. In production it usually isn't. A whole always-on Mac is a fat blast radius: persistent local state, standing network access, whatever credentials you logged in with, and no clean teardown between tasks. The pattern that survives contact with real workloads is the opposite — ephemeral, scoped, disposable per task, credentials injected narrowly and revoked after. The spare-Mac setup is the right instinct (physical separation) reaching for the wrong default (a long-lived, fully-provisioned host).

The threads on the [HN discussion](https://news.ycombinator.com/item?id=48959392) circle the same tension: people love the ergonomics, then immediately ask what happens when a prompt injection convinces the agent to `rm -rf` or exfiltrate an SSH key that's just sitting there.

So here's the question I keep coming back to: if you wouldn't give a new contractor unattended root on a machine with your keys on it, why is an autonomous agent — which can be socially engineered by a web page — a different call?
