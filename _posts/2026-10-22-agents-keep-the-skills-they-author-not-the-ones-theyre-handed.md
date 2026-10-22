---
layout: post
title: "Agents Keep the Skills They Author, Not the Ones They're Handed"
date: 2026-10-22 03:05:49 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.17860"
discussion_url: https://huggingface.co/papers/2610.17860
source_url: https://arxiv.org/abs/2610.17860
---

The useful result in [Socratic Skill Learning](https://arxiv.org/abs/2610.17860) isn't the leaderboard number — it's that handing an agent a finished, expert-written skill turns out to be the weaker option.

Most skill libraries I've seen get built the obvious way: a strong model or a person writes the procedure, and every downstream agent reads it. SSL inverts that. An Educator guides the investigation, but the Student stays the only thing touching the environment and the only author of the skill — it questions the advice, tests it, and rewrites the package itself. Interleaving that teaching with practice beats both expert authoring and post-hoc "here's what you should have done" teaching across three model pairs. Fixed-Window SSL reaches 0.801 utility on the main cohort, against 0.723 with no skill and 0.761 for trajectory distillation.

That tracks with something I keep relearning in production: a procedure a model never exercised is a liability. A skill written from a single successful run encodes the happy path and quietly omits the conditions of use — which is exactly the part that breaks on the next variation. The agent has to hit the edge itself before it can write that down.

The part that makes this operational is the cost curve. Fixed-window review keeps paying a teacher to look at every revision long after the lessons dry up. Their Issue-Guided variant instead tracks unresolved questions across revisions and spends review only where something is still open — 0.805 utility with 61.7% fewer Educator tokens. That's the gap between a teaching loop you can afford to run across a whole skill catalog and one you can't.

The [SkillTransferBench setup on the HF page](https://huggingface.co/papers/2610.17860) — held-out evaluation in fresh solver sessions — is the right test, because reuse on the training task proves nothing. So the real question for anyone maintaining an agent skill library: are you authoring skills *for* your agents, or paying to let them author their own — and have you measured which one actually transfers?
