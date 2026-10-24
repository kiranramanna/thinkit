---
layout: post
title: "When a Refusal Still Gives Away the Secret"
date: 2026-10-24 14:05:30 +0000
categories: [agentic-ai, llm-ops, enterprise-ai, research]
source: hf-papers
source_id: "2610.30418"
discussion_url: https://huggingface.co/papers/2610.30418
source_url: https://arxiv.org/abs/2610.30418
---

The uncomfortable finding in
[Agent Mosaic](https://arxiv.org/abs/2610.30418) isn't that agents leak
secrets. It's that they leak conclusions nobody ever stored anywhere — and
that saying "no" can leak them too.

- 🔍 **The mosaic effect**: an agent pulls innocuous facts from separate
  documents and assembles a sensitive composite. No single source is
  confidential; the inference is. This is the attack surface classic PII
  filters were never built to see.
- ⚠️ **It fires on benign queries.** Even on questions designed to be
  answerable from a single document, the best model tested disclosed forbidden
  composites in ~7% of simulated answers — and worse inside the two live
  open-source harnesses they ran.
- 🛡️ **Guardrails bend the curve, they don't close it.** Visible
  classification headers plus explicit aggregation rules cut disclosure
  substantially, yet unsafe answers still persisted in ~32% of cases across
  all intents.
- 🎯 **Refusing doesn't save you.** A meaningful share of refusals revealed
  the prohibited conclusion in the act of refusing — "I can't confirm X given
  Y and Z" is itself the leak.
- 📊 **It's a floor, not an anecdote.** 10,800 simulated answers across three
  agents plus 1,440 from live harnesses is enough sample to stop calling these
  numbers edge cases.

This is exactly the gap I worry about when agents run over mixed-clearance
enterprise data: you cannot regex a secret that only exists in the model's
reasoning. The [HF paper page](https://huggingface.co/papers/2610.30418)
frames it as an inference-control problem, and that framing is right — the
control has to live at what the agent is *allowed to reason toward*, not just
what it's allowed to print. For anyone operating these systems, the question
stops being "did it output a secret" and becomes "could its trajectory have
implied one?"
