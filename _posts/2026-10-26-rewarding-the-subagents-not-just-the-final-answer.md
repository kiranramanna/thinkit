---
layout: post
title: "Rewarding the Subagents, Not Just the Final Answer"
date: 2026-10-26 14:19:41 +0000
categories: [agentic-ai, research, llm-ops]
source: hf-papers
source_id: "2610.23234"
discussion_url: https://huggingface.co/papers/2610.23234
source_url: https://arxiv.org/abs/2610.23234
---

The part of [MultiAgent-OPD](https://arxiv.org/abs/2610.23234) worth your attention isn't the 38.68% macro avg@4 — it's where the training signal comes from. In a Leader-Searcher-Answerer team, the final answer only tells a subagent whether the whole run worked. That's almost no signal for the Searcher that fetched the wrong document three steps earlier, which is exactly why jointly training the team end to end normally stalls.

- 💡 **The hard problem, named directly**: final-answer reward is too indirect to teach the subagents, so credit never reaches the hop that actually broke.
- 🎯 **Local process supervision**: a frozen Teacher scores the student's search and summary tokens, so Searchers learn from their own intermediate behavior, not just the team's end result.
- 🔍 **Judge-as-supervisor, done cleanly**: the Teacher is trained first on answer correctness, then frozen to grade process — not an online judge whose own scores drift while the students it's grading are still moving.
- ⚡ **One shared-parameter team**: a single model plays Leader, Searcher, and Answerer, trained together with RL plus on-policy distillation — fewer moving parts than three separately tuned models.
- 📊 **The deltas**: +4.06 points over Prompted Critic and +2.61 over a trained cascaded multi-agent baseline across seven datasets, and it solves more questions within four attempts.

What makes this land for production isn't the method, it's the diagnosis. Most multi-agent orchestration I've run gives credit only at the end — a subagent that's quietly bad never gets a gradient to fix it, so you watch the final answer degrade and go hunting for which hop broke. Pushing supervision down to the step that went wrong is the right instinct. The [HF paper page](https://huggingface.co/papers/2610.23234) has the per-dataset breakdown; the open question it leaves me with is whether a frozen Teacher stays a good judge once the students start outperforming it.
