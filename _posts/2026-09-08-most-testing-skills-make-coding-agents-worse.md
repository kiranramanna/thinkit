---
layout: post
title: "Most Testing 'Skills' Make Coding Agents Worse"
date: 2026-09-08 14:04:54 +0000
categories: [agentic-ai, llm-ops]
source: hn
source_id: "49605246"
discussion_url: https://news.ycombinator.com/item?id=49605246
source_url: https://danluu.com/agentic-testing/
---

The surprising result in [Dan Luu's 26-condition run](https://danluu.com/agentic-testing/) isn't that coding agents can write tests. It's that telling them *how* usually backfires. The "Default" condition — no special instructions — beat most of the named techniques. Handing an agent a testing skill made its output worse than saying nothing at all.

The failure mode is consistent, and it's the one that should worry anyone wiring agents into a pipeline: the agent performs the shape of a technique without its substance. Point it at formal methods and it proves abstract properties that don't touch the actual code. Ask for property-based tests and you get trivial smoke tests whose random inputs bounce straight off the rejection path. TDD produced more tests and worse ones. Differential testing collapsed because the agent wrote nearly identical implementations twice — no independence, no signal. This is the same reason a green eval light means nothing until you know what it measures: the ceremony is easy to fake, the verification is not.

What actually worked is telling. Fuzzing and proptest occasionally surfaced real bugs through shrinking — precisely because the fuzz runner is an external oracle the agent can't talk its way past. And the highest-scoring condition was the author's own hand-built skill, which gave specific guidance rather than a tutorial-style vocabulary lesson. The lesson for production agent work is the same one I keep relearning: give the agent an external verifier it cannot game, not a glossary of methods it will mimic. Confirm the [HN discussion](https://news.ycombinator.com/item?id=49605246) has plenty of teams who hit this exact wall.

The wider reaction has settled less on the individual technique scores and more on the meta-point. [Developers Digest](https://www.developersdigest.tech/blog/dan-luu-agentic-testing-2026) reads it as confirmation that agentic coding is now constrained by verification, not generation, and treats that as the operational takeaway. [SkySync Tech](https://www.skysynctech.ca/news/agentic-coding-notes-danluu) is more cautious — it agrees the failure modes are real and durable across tool versions, but frames them as a case for review gates and checkpoints rather than a verdict on the tools themselves. Both land where I do: the bottleneck moved, and letting an agent grade its own homework is exactly where teams get burned.
