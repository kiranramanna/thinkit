---
layout: post
title: "Distilling Knowledge from a Teacher You Can't See Inside"
date: 2026-06-29 03:06:35 +0000
categories: [research, llm-ops]
hn_id: 48712420
hn_url: https://news.ycombinator.com/item?id=48712420
source_url: https://arxiv.org/abs/2401.07013
---

[Proxy-KD](https://arxiv.org/abs/2401.07013) tackles a problem every team running smaller models eventually hits: you want to distill frontier-class behavior into a model you actually own, but the teacher is a black box. No logits, no hidden states — just text out. Classic white-box knowledge distillation assumes you can match the teacher's internal distributions. With an API teacher, you can't.

- 🎯 The move: train a proxy model to imitate the black-box teacher, then distill from the proxy's *accessible* internals — a bridge between API-only outputs and gradient-friendly signals.
- 📊 They report Proxy-KD beating black-box KD baselines and traditional white-box KD, which is the surprising claim, since white-box distillation has strictly more information to work with.
- ⚠️ The caveat every distillation paper buries: results live or die on the transfer set. "Surpasses white-box" is a statement about their benchmarks, not a general law.
- 🔍 For RAG and agent stacks this matters because the unit economics of calling a hosted frontier model on every tool hop don't survive contact with real latency and cost budgets.
- 💡 Owning the weights is the whole point — you can quantize, fine-tune on your domain, and meet an SLA, none of which an API teacher will ever let you do.

The [HN thread](https://news.ycombinator.com/item?id=48712420) flags this as a 2024 paper resurfacing, which is worth a question of its own. My read: as open base models got good enough to serve as proxies, black-box distillation stopped being academic and became a procurement strategy. Here's the one that keeps me up — when your teacher is an API you don't control, how do you version a distillation pipeline whose teacher silently updates underneath you?
