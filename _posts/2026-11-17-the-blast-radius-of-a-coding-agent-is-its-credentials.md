---
layout: post
title: "The Blast Radius of a Coding Agent Is Its Credentials"
date: 2026-11-17 03:05:10 +0000
categories: [agentic-ai, llm-ops]
source: hn
source_id: "50526152"
discussion_url: https://news.ycombinator.com/item?id=50526152
source_url: https://blog.antonio.cx/running-agents-with-lend
---

The usual advice for running coding agents safely is "put them in a sandbox." But a sandbox only contains the filesystem and the network. The moment an agent needs your SSH key, your `gh` login, or a cloud CLI that's authenticated as you, the sandbox stops mattering — whatever the agent can authenticate as is the real blast radius.

[Antonio's write-up](https://blog.antonio.cx/running-agents-with-lend) gets this right by keeping agents off the laptop entirely — they run on disposable VMs — and brokering credentials through a tool that lends access without ever exposing the secret:

- 🎯 **Separate the agent from the authority.** The agent runs on a throwaway VM; the keys and vault stay on the laptop.
- 🔑 **Lend, don't copy.** A local broker performs the privileged action over a stable socket, so the secret never lands in the agent's environment.
- ⚠️ **Approval is the control plane.** Every sensitive call surfaces as a prompt the human answers — the agent gets a result, not a token.
- 🔍 **Audit comes free.** Because every request flows through the broker, you can see exactly what each agent asked for and when.

This is the same pattern I keep arguing for in production agent systems: scoped, short-lived, brokered access with a human in the loop, not long-lived secrets mounted into a context window that's also reading untrusted input. The [HN discussion](https://news.ycombinator.com/item?id=50526152) splits on whether approval fatigue kills this the moment you're running five agents at once — which is the real open question. If every action needs a tap, does the broker scale past the demo, or do we end up rubber-stamping exactly the calls we meant to guard?
