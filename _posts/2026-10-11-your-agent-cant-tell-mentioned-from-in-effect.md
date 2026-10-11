---
layout: post
title: "Your Agent Can't Tell 'Mentioned' from 'In Effect'"
date: 2026-10-11 03:07:36 +0000
categories: [conversational-ai, agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.06496"
discussion_url: https://huggingface.co/papers/2610.06496
source_url: https://arxiv.org/abs/2610.06496
---

Every conversational-AI team has hit this failure and few have named it. A user floats a change mid-task — "actually, make that Postgres" — then takes it back a turn later, and the model keeps acting on the instruction it already retracted. The [paper behind Intent-Eval](https://arxiv.org/abs/2610.06496) calls this *mentioned-as-in-effect confusion*: the model can't separate what was said in the conversation from what is actually still in force.

That distinction is cheap to ignore in a single-turn prompt, where you own the state. It gets expensive the moment the dialogue history *becomes* the state. In a multi-turn tool or agent loop, every requirement the model has ever seen reads as live, so a superseded constraint doesn't cause one wrong turn — it compounds. The benchmark spans tool actions, code, databases, and math, and the telling result is that accuracy keeps degrading as the interaction continues. These are exactly the long-horizon sessions where production agents earn their keep, and exactly where this bug is hardest to spot.

Their fix, Intent-OPSD, is a decision-conditioned self-distillation setup: a frozen teacher sees only the active intent from the resolved task and supervises a student training on the full, messy dialogue. It's a reasonable training-time answer, but the operational lesson lands before the distillation trick does. If your agent's context is its memory, you need an explicit representation of *superseded* versus *active* — not just an ever-growing transcript you trust the model to parse correctly every turn. I've watched this exact pattern surface as an agent re-applying a config the user reverted three messages ago. The [HF paper page](https://huggingface.co/papers/2610.06496) has the full Intent-Eval breakdown.

Here's the uncomfortable part: most multi-turn eval harnesses only grade the final answer on a clean happy path. How many of your production regressions are just the model dutifully obeying something the user already walked back?
