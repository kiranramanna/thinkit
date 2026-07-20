---
layout: post
title: "When a $25 Agent Finds a $500k WordPress Bug"
date: 2026-07-20 14:04:05 +0000
categories: [agentic-ai, llm-ops, research]
hn_id: 48975665
hn_url: https://news.ycombinator.com/item?id=48975665
source_url: https://slcyber.io/research-center/exploit-brokers-pay-500000-for-a-wordpress-rce-i-found-one-with-gpt5-6/
---

The eye-catching number in [this writeup](https://slcyber.io/research-center/exploit-brokers-pay-500000-for-a-wordpress-rce-i-found-one-with-gpt5-6/) is the arbitrage: a pre-auth SQL injection in WordPress's REST batch endpoint, the kind brokers pay six figures for, surfaced by a model run for about $25. But the number is a distraction. The interesting part is the harness.

The researcher didn't just paste code and ask "find the bug." They ran up to four concurrent agents across different attack surfaces — input parsing, uploads, serialization, race conditions — fed only the source with no git history and no internet, and instructed the model to keep diverse hypotheses alive for hours instead of settling on the first dead end. The actual finding is a classic index-misalignment bug: the batch endpoint validates requests in one loop and executes in another, so you can validate one handler and execute against a different one, slipping a payload past sanitization. A human auditor could find that. The point is that the orchestration found it — parallel exploration plus a refusal to converge early.

That maps almost exactly onto what makes production agent systems work or fail. The failure mode I see most often isn't a weak base model; it's an agent that commits to its first plausible hypothesis and burns the rest of its budget confirming it. Fan-out with independent context, a scoring pass, and an explicit "stay diverse" instruction is the difference between an agent that grinds and one that actually searches. The security framing is what got this on the [HN front page](https://news.ycombinator.com/item?id=48975665), but the reusable lesson is about search strategy, not exploits.

The uncomfortable follow-on: if $25 of orchestrated inference can find a $500k bug in one of the web's most-audited codebases, the economics of both defense and offense just moved. Which side scales the harness faster?
