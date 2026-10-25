---
layout: post
title: "Your RAG Eval Is Too Clean for the Real Web"
date: 2026-10-25 03:05:42 +0000
categories: [rag, agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.30181"
discussion_url: https://huggingface.co/papers/2610.30181
source_url: https://arxiv.org/abs/2610.30181
---

Frontier models look strong at retrieval when the corpus sits still. [OpenDS-World](https://arxiv.org/abs/2610.30181) drops that assumption and sends agents into the live, open web — independent sources, heterogeneous file formats, interactive pages you have to click through — and the best of twelve frontier models lands at 39.0% on 200 human-verified tasks.

- 🎯 **Static retrieval eval flatters your agent.** A fixed corpus with clean chunks measures ranking, not research. The real web makes the agent find, open, and reconcile the evidence itself.
- 🔍 **The hard part is tool coordination**, not recall — the failure analysis points at long-horizon search management and recovery, exactly where production agents stall.
- ⚡ **39% is the ceiling, not the floor.** Twelve frontier models, one unified tool environment, and the winner still misses nearly two tasks in three.
- 📊 **Humans scored 21.1%** across 1,000 attempts — the agents beat people here, which says more about how punishing open-web research is than about model brilliance.
- ⚠️ **Answer uniqueness was human-verified.** That's the step most homegrown agent evals skip, and it's why the 39% number carries weight.
- 💡 **This is a harness problem.** A bigger model won't fix termination behavior or evidence integration; the orchestration around the model will.

The [HF paper page](https://huggingface.co/papers/2610.30181) has the per-model breakdown. If your RAG eval runs against a frozen index, you're measuring the easy 40% — what would your agent score the day the evidence is scattered across six sites and a login-gated PDF?