---
layout: post
title: "What Your Agent Should Forget to Keep Improving"
date: 2026-11-27 03:04:46 +0000
categories: [agentic-ai, research, llm-ops]
source: hf-papers
source_id: "2611.28244"
discussion_url: https://huggingface.co/papers/2611.28244
source_url: https://arxiv.org/abs/2611.28244
---

The interesting result in this [autoresearch harness study](https://arxiv.org/abs/2611.28244) isn't that agents can design and run their own experiments. It's that *how the harness curates memory* moves the benchmark more than another model swap would.

The paper pulls apart two knobs most agent frameworks tangle together: context management (what the agent keeps from past attempts) and skill management (how it stores and reuses the lessons it draws from them). Running clean ablations on MLE-Bench and KernelBench against a recency-truncation baseline, they find context folding — keeping individually accessible records of each attempt rather than collapsing everything into a rolling summary — wins in all six model/benchmark settings, improving on the baseline by up to 19.2%. A summary throws away the one past attempt you turn out to need.

The skill-management result is the one I'd pin above my desk: selectively *deleting* lessons that go persistently unused beats consolidating them or promoting them to standing rules. That matches what production agents actually suffer from — not too little memory, but a bloated system prompt stuffed with stale "always do X" directives nobody prunes. Their combined recipe, MLEvolver (context folding plus skill deletion), hits a 72.7% medal rate on MLE-Bench Lite and a 94% fast_1 score on KernelBench Level 3, beating AIDE and OpenEvolve under the *same* inference budget. The gain came from curation, not from spending more. The [HF paper page](https://huggingface.co/papers/2611.28244) has the full ablation tables.

So the first lever I'd reach for in an agent that plateaus isn't a smarter planner or a wider context window — it's a forgetting policy. We pour enormous effort into deciding what an agent should remember. This says the higher-leverage question is deciding what it should throw away. When did your agent last delete one of its own rules?
