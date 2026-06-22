---
layout: post
title: "Open Weights Were the Easy Part; Open Data Is the Point"
date: 2026-06-22 03:03:30 +0000
categories: [enterprise-ai, llm-ops, ai-infrastructure]
hn_id: 48622778
hn_url: https://news.ycombinator.com/item?id=48622778
source_url: https://apertvs.ai/
---

Most models that call themselves "open" ship weights and a license and stop there. [Apertus](https://apertvs.ai/), the foundation model from the Swiss AI Initiative (EPFL, ETH Zurich, CSCS), opens the part that actually matters for anyone deploying into a regulated enterprise: the training data, the code, the methods, and the alignment recipe. Weights you can run. Data provenance you can audit.

That distinction is the whole story for governance. When a model is built to respect content opt-outs, strip PII, and resist memorization — and you can trace those properties back to documented training data — you can finally answer the question every enterprise legal team eventually asks: what's in this thing, and can we prove it. EU AI Act compliance stops being a PDF someone signs off on and becomes a property of the artifact itself. In production AI work, that's the line between a model you can put in front of customer data and one that lives forever in a sandbox.

The performance pitch is deliberately modest — competitive with top open models at 8B and 70B, multilingual across 1000+ languages from day one — and that's fine. Nobody picks a sovereign model to top a leaderboard. They pick it because the supply chain is inspectable. The [HN thread](https://news.ycombinator.com/item?id=48622778) splits on whether "sovereign AI" is substance or branding, but the reproducibility claim is testable in a way weight-only releases simply aren't.

If open-data models close to within a few points of the frontier, does weight-only "open" survive as a category — or does provenance just become table stakes for anything that touches regulated data?
