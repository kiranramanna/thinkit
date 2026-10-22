---
layout: post
title: "Stop Asking Your LLM How Confident It Is"
date: 2026-10-22 14:07:21 +0000
categories: [llm-ops, agentic-ai]
source: hn
source_id: "50176082"
discussion_url: https://news.ycombinator.com/item?id=50176082
source_url: https://rumple.github.io/blog/2026/10/20/asking-llm-for-confidence.html
---

A surprising number of agent designs route, escalate, or auto-approve based on
a confidence number the model produced about its own answer.
[Amrut Joshi's post](https://rumple.github.io/blog/2026/10/20/asking-llm-for-confidence.html)
argues that number is meaningless, and the framing is cleaner than the usual
"models are overconfident" complaint.

His analogy: a real confidence is a calculation from information. A forecaster
who says 70% has combined base rates with today's evidence under a rule that,
applied correctly, two forecasters with the same information must agree on. An
LLM asked "how confident are you?" is doing none of that. It emits a token
sequence that looks like a probability because its training data is full of
text that looks like probabilities — there's no internal quantity being
measured, no ground truth it can check against. You're asking it to grade its
own homework with no answer key.

This matters in production because the self-reported number is seductive: it's
right there, it's cheap, and it feels like a signal. But a confidence you can't
calibrate is one you can't threshold on. If you're gating a human handoff or a
tool call on `model_confidence > 0.8`, you've built escalation logic on a number
that barely moves between an easy case and a genuinely ambiguous one.

The honest alternatives cost more: self-consistency sampling, token log-probs
where the API exposes them, or a small labeled set to actually measure
calibration per task. None of them are free, which is exactly why the verbalized
score stays popular. If you want to argue the point, the
[HN discussion](https://news.ycombinator.com/item?id=50176082) is where it's
playing out. So before your agent trusts a confidence score, ask what
information it could possibly be computing that number from.
