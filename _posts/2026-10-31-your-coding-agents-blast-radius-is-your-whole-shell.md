---
layout: post
title: "Your Coding Agent's Blast Radius Is Your Whole Shell"
date: 2026-10-31 14:13:11 +0000
categories: [agentic-ai, llm-ops, industry]
source: hn
source_id: "50300683"
discussion_url: https://news.ycombinator.com/item?id=50300683
source_url: https://phorion.io/blog/offical-claude-code-vsx-compromise/
---

The [Claude Code extension backdoor Phorion disassembled](https://phorion.io/blog/offical-claude-code-vsx-compromise/) is a small, almost boring piece of malware. What makes it worth your attention is the blast radius: a prepended loader in `extension.js` that runs the moment Node loads the file, before the extension even activates, with no user interaction. The agent tooling we install to move faster now runs with the full privileges of our dev box — and the trust boundary is a marketplace that barely vets.

- 🎯 **The trust model is the marketplace, and it's thin.** A trojanized build of the *official* extension sat on Cursor's marketplace for roughly 11 hours and could have reached up to 5,000 developers.
- ⚡ **Auto-update is the delivery vector.** Nobody had to go install anything; a routine version bump pushed the backdoored release to existing users.
- ⚠️ **Uninstalling doesn't clean up.** It drops an attacker SSH key, a reverse tunnel, and a disguised LaunchAgent that survive removal — and survive the patched update too.
- 🔍 **It beacons your dev identity.** Hostname, OS, git email, public IP, and the names of up to 40 credential-like env vars go out over plaintext HTTP.
- 💡 **The payload was sloppy, and that's luck.** The macOS SSH-enable step silently failed without admin rights. The next crew won't fluff that.

For anyone running coding agents inside an enterprise, the takeaway is uncomfortable: these extensions deserve the same supply-chain scrutiny as any dependency — version pinning, disabled auto-update for anything that touches a shell, and an allowlist. The [HN discussion](https://news.ycombinator.com/item?id=50300683) is full of developers realizing their IDE silently auto-updates extensions with zero review.

The security press converged fast. [BleepingComputer](https://www.bleepingcomputer.com/news/security/malicious-claude-code-extension-on-cursor-planted-ssh-backdoors/) and [The Hacker News](https://thehackernews.com/2026/10/official-claude-code-vs-code-extension.html) reported it straight as a supply-chain compromise; [Help Net Security](https://www.helpnetsecurity.com/2026/10/30/claude-code-extension-ssh-backdoor/) noted the SSH step usually failed without admin rights, so real-world impact was limited; [StepSecurity](https://www.stepsecurity.io/blog/claude-code-extension-trojanized) pushed the other way, flagging both 2.1.312 and 2.1.313 and warning the backdoor persists through uninstall and update. The split tells you where this is heading: the payload was contained this time, but the delivery path — unvetted marketplace plus silent auto-update — is wide open.
