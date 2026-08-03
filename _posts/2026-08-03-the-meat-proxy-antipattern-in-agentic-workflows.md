---
layout: post
title: "The Meat-Proxy Antipattern in Agentic Workflows"
date: 2026-08-03 14:08:09 +0000
categories: [agentic-ai, llm-ops, industry]
hn_id: 49151933
hn_url: https://news.ycombinator.com/item?id=49151933
source_url: https://gruhn.me/blog/2026-08-03/
---

The [essay's](https://gruhn.me/blog/2026-08-03/) surface complaint is social — stop pasting Claude's raw output into Slack and pull requests and calling it a contribution — but the engineering lesson underneath is about where judgment actually lives in an agentic workflow.

When you relay an LLM's answer verbatim, you've inserted yourself as a proxy that adds latency and subtracts accountability. The recipient could have prompted the model themselves, faster, with context they control. What you were supposed to add — reading it, validating it, catching the plausible-nonsense — is exactly the step you skipped. The author's example lands hard: a line like "NATS control-plane events: stream leader election / R3 quorum re-form during pod churn" reads as authoritative and might be entirely wrong, and the person forwarding it can't tell which.

This maps straight onto how I think about human-in-the-loop design. The point of putting a person in an agent loop is that they're a verification node, not a relay. A reviewer who pastes ticket text into a coding agent, ships the diff unread, then feeds reviewer comments back into the same agent hasn't reviewed anything — they've added a hop. The implementation got done by two agents talking through a human who understood neither side.

The uncomfortable part: this is quietly what a lot of "AI-assisted" work already is. The value a human adds isn't proximity to the model — everyone has that now. It's the willingness to read the output, understand it, and re-express it in a form that certifies the reading happened. That certificate is the whole job.

The [post](https://gruhn.me/blog/2026-08-03/) is short and worth reading before your next PR, and the [HN discussion](https://news.ycombinator.com/item?id=49151933) is full of people recognizing themselves on both sides of it.

If your only contribution to a thread is forwarding a model's output, what stops the recipient from cutting you out of the loop entirely?
