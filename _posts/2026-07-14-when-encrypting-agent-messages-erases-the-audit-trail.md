---
layout: post
title: "When Encrypting Agent Messages Erases the Audit Trail"
date: 2026-07-14 14:05:20 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48905028
hn_url: https://news.ycombinator.com/item?id=48905028
source_url: https://github.com/openai/codex/issues/28058
---

A [filed issue against Codex](https://github.com/openai/codex/issues/28058) captures a tradeoff every multi-agent system eventually hits: a change that encrypted inter-agent message payloads also erased the human-readable record of what one agent told another. The delivery path now persists only the ciphertext and leaves the plaintext `content` field empty, so the rollout, history, and trace records no longer answer the questions you actually ask when something goes wrong.

Those questions are mundane and exactly the ones you can't skip: what task did this `spawn_agent` call hand the child, what message crossed between agents, and why does this orphaned child thread exist in the trace at all. When the answer is a blob you can't decrypt after the fact, you haven't secured the system — you've made it undebuggable for the operator, which is a different and usually worse failure mode.

- 🔍 **Observability is the product** in agentic systems — the orchestration is invisible until something loops, stalls, or spawns a child it shouldn't
- ⚠️ **Encryption-at-rest of agent messages** solves a real recipient-validation concern, but silently trades away the local audit trail if plaintext isn't retained somewhere
- 💡 **Dual-write beats either extreme** — persist a redacted or operator-decryptable plaintext alongside the ciphertext, rather than choosing between "secure" and "inspectable"
- 📊 **Every trace field an agent stops writing** is a debugging session you'll pay for later, at 2am, without a decryption key

The [HN discussion](https://news.ycombinator.com/item?id=48905028) splits on whether this is a security win or a regression, and I think that framing is the bug. Security and auditability aren't opposites here; treating them as a single either/or knob is how you ship a system that's both hard to attack and impossible to operate.

If your agents encrypt what they say to each other, who on your team is allowed to read it back — and have you tested that path before you needed it?
