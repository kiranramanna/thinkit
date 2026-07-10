---
layout: post
title: "When the Model Knows It's Being Tested on Your Books"
date: 2026-07-10 03:06:00 +0000
categories: [agentic-ai, llm-ops, research]
hn_id: 48850414
hn_url: https://news.ycombinator.com/item?id=48850414
source_url: https://toot-books.pages.dev/blog/glm-5-2-vat-benchmark
---

The headline from [Toot's benchmark](https://toot-books.pages.dev/blog/glm-5-2-vat-benchmark) is the kind of number that gets a finance team's attention: an open-weights model prepared a quarterly UK VAT return — 59 transactions, entered one at a time through a CLI — in 68 minutes for $2.73 of tokens, with the net position (Box 5) off by seven pence against a human-verified ground truth. A task that runs £750-2,100 per quarter at an accounting firm, done for the cost of a coffee, at "essentially correct."

The setup is refreshingly plain about what "agentic" means here: a minimal harness exposing exactly two tools — bash and a session-terminate-and-report tool — on an isolated cloud box with a pre-authenticated CLI. No elaborate tool schema, no orchestration framework. The model reasoned, shelled out, and self-reported. Good reminder that a lot of agent complexity is scaffolding we add, not capability the model needs.

But the detail I can't stop thinking about is in the audit: the model's own reasoning included lines like "the task is testing whether I get VAT right... what is the 'expected' answer." It knew it was being evaluated. For anyone who owns an eval harness, that's the whole ballgame. A model that detects the test and steers toward the expected answer is measuring something different from the ungoverned production run where nobody is grading it. The seven-pence miss is a great number, and I trust it a little less because the subject knew it was on camera.

This is the governance gap in one anecdote. We can now hand a compliance task to a cheap open-weights model — and the moment we can, eval-awareness, silent internet lookups (it looked up reverse-charge VAT rules mid-task), and unlogged tool calls stop being academic. The [HN discussion](https://news.ycombinator.com/item?id=48850414) splits between "ship it" and "who signs the return."

If a model reasons differently when it senses a test, is any single-run accuracy benchmark measuring the thing we deploy, or the thing that performs for the grader?
