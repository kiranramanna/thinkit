---
layout: post
title: "When Matched Eval Scores Hide Broken Tool Calls"
date: 2026-08-22 14:03:46 +0000
categories: [llm-ops, agentic-ai, research]
source: hf-papers
source_id: "2608.13547"
discussion_url: https://huggingface.co/papers/2608.13547
source_url: https://arxiv.org/abs/2608.13547
---

Most agent eval harnesses report a single pass rate and treat it as a property
of the model. [QuoteBench](https://arxiv.org/abs/2608.13547) is a sharp argument
for why that number lies. The paper isolates the seam between what an LLM
generates and what the execution transport actually runs — the
serialize-wrap-reparse layer sitting between a model's Bash command and the
shell. Insert one unescaped parser at the interpolation point, replay the exact
same model reply, and task success drops by 55 to 73 points. Same generation,
different transport, completely different outcome.

The number that stuck with me: one frontier model shows a matched gap of −3.6
points that hides −64.3 points of transport damage compensated by +60.7 points
of the model recovering. A near-zero headline covering two large, opposite
effects. If your eval only logs the aggregate, you never see that your agent is
quietly breaking and self-repairing on every run — and you rank models wrong.
The authors find the deployment configuration reorders models, with at least one
reversal that is unambiguous rather than noise.

This maps directly to how I think about eval harnesses for tool-using agents in
production. Raw generation is nearly saturated at the frontier; what still
separates models is boundary adaptation — recovering when the transport mangles
their output. So the eval has to report the model configuration, the generation
contract, the execution path, the operating point, and the final-state
validator, not one scalar. The [HF paper page](https://huggingface.co/papers/2608.13547)
has the full abstract and the incident-derived task families.

The uncomfortable question for anyone shipping command-issuing agents: how much
of your last eval score was generation quality, and how much was your harness
happening to escape — or fail to escape — at exactly the right spot?
