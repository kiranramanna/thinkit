---
layout: post
title: "When Your Agent's Retry Charges the Card Twice"
date: 2026-10-06 14:08:35 +0000
categories: [agentic-ai, llm-ops, enterprise-ai, research]
source: hf-papers
source_id: "2610.05622"
discussion_url: https://huggingface.co/papers/2610.05622
source_url: https://arxiv.org/abs/2610.05622
---

The number in [UndoBench](https://arxiv.org/abs/2610.05622) that should worry anyone running tool-using agents in production: nominal task competence hit 83.5%, but conditional recovery success fell to 46.7%. The agents could do the work. They couldn't clean up after a fault halfway through it. And naive retry — the default most frameworks ship — produced duplicate external effects in 53% of trials. In an enterprise workflow that means the refund issued twice, the ticket reopened twice, the record written twice.

What makes the benchmark useful rather than just alarming is that it stops conflating two things we usually measure as one. Most agent evals grade whether the task finished. UndoBench runs counterfactual paired trials under identical seeds, injects a fault mid-execution, then asks a separate question: can the agent recover without leaving duplicate side effects behind? That competence-versus-recovery split is exactly the gap I see between a demo that works and an agent you'd actually let touch a system of record.

The phase-dependent result is the part I'll be stealing for my own eval harness. Recovery difficulty depends entirely on *when* the fault lands. Before any mutation, everything looks fine. During partial mutation, the usual safeguards — per-call idempotency, zero-privilege journaling, plain retry — all collapse on composite workflows. Only after commit, in the lost-acknowledgment window, do verification and server-side idempotency actually help. That maps onto how I think about tool-call boundaries: the dangerous state isn't failure, it's a half-applied mutation the agent can't see. The [arXiv page](https://arxiv.org/abs/2610.05622) has the paradigm breakdown and the [HF paper page](https://huggingface.co/papers/2610.05622) collects the discussion.

So the question for your own stack: if you killed the process mid-tool-call tomorrow, would your agent know what it had already done — or would it just try again?
