---
layout: post
title: "Your Multi-Agent Prompt Is Two Prompts Pretending to Be One"
date: 2026-11-02 14:27:16 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.34722"
discussion_url: https://huggingface.co/papers/2610.34722
source_url: https://arxiv.org/abs/2610.34722
---

The useful idea in [this paper](https://arxiv.org/abs/2610.34722) is almost boring once you see it: in a multi-agent system, the prompt you keep tuning is really two prompts wearing one coat. Part of it coordinates — who runs when, how results hand off, what the shared rules are. Part of it executes — the actual task instructions for this one agent. Most prompt optimizers treat the whole blob as one search space, so every time you fix an executor instruction you perturb coordination, and the reverse.

CEPO splits them: a shared coordinator prompt every agent inherits, plus agent-specific executor prompts, with each update routed to whichever layer owns the behavior. It doesn't replace your optimizer — it hands the optimizer a structure to search over. Across 11 benchmarks in four domains, layering it on four existing optimizers improved all of them.

- 🎯 **Coordination is a cross-cutting concern** — a routing or hand-off rule belongs in one place, not copy-pasted (and drifting) across five agent prompts.
- ⚡ **Budget efficiency**: refining the coordinator rule once instead of once per agent reached the same quality in fewer optimization steps.
- 📊 **It scaled with agent count** in their document-understanding study — exactly where the one-big-prompt approach falls apart.
- 💡 **Optimizer-agnostic**: you keep whatever search you already run; CEPO only reshapes what gets searched.
- 🔍 **The split is the insight**, not a new algorithm — which is why it composes with work you've already shipped.

The honest caveat: this pays off only if you have a real coordinator/executor split to begin with. Plenty of "multi-agent" systems are one orchestrator with glorified function calls, and there's no shared coordination prompt to factor out. If yours genuinely carries shared rules — retry policy, hand-off format, escalation — this is the refactor I'd reach for. The [arXiv paper](https://arxiv.org/abs/2610.34722) has the ablations, and the [HF paper page](https://huggingface.co/papers/2610.34722) collects the discussion.

If your coordination logic currently lives as duplicated sentences across every agent's system prompt, how would you even measure the drift?
