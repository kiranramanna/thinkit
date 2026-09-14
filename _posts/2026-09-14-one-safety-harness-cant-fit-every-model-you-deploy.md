---
layout: post
title: "One Safety Harness Can't Fit Every Model You Deploy"
date: 2026-09-14 03:05:49 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.05903"
discussion_url: https://huggingface.co/papers/2609.05903
source_url: https://arxiv.org/abs/2609.05903
---

The interesting claim in [EvoSafeHarness](https://arxiv.org/abs/2609.05903) isn't that agents need a safety layer — we've all wired one in by now. It's that the layer is the thing you should be tuning per deployment, not the model. A harness strict enough to stop one model's bad tool calls will over-block another until it's useless, and a policy that reads fine for a filesystem agent has no vocabulary for, say, a transaction that shouldn't clear. Safety is deployment-dependent, and most of us are still shipping one expert-written harness across every model and every domain we run.

What the paper does is treat the harness as something to optimize. It jointly searches a natural-language policy and the executable code that enforces it on each tool call, for a frozen model in a target domain, with a fresh-context adversarial reviewer that throws out rules which only pass because they memorized the benchmark. The numbers are the part worth stealing: on DecodingTrust-Agent it drops average attack success rate from 45.6% to 10.0% for a 3.3-point utility cost, and on AgentDojo it reaches 82.8% utility at 0.0% attack success — twice CaMeL's utility at the same operating point — and transfers to unseen suites unchanged.

That last result matches what I keep hitting in production: the domain tells you which safety relations and trajectory state matter, and the model's runtime behavior tells you how hard to enforce them. Those are two separate knobs, and hand-writing one harness collapses them into a single guess. The [HF paper page](https://huggingface.co/papers/2609.05903) has the full breakdown by victim model.

The open question for me is operational, not academic: a harness that co-evolves with your model and domain is one more artifact that drifts. When your model version bumps or your tool surface grows, does the evolved policy quietly go stale — and would your eval harness even catch it?
