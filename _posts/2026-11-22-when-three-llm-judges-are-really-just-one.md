---
layout: post
title: "When Three LLM Judges Are Really Just One"
date: 2026-11-22 14:12:59 +0000
categories: [research, llm-ops]
source: hf-papers
source_id: "2611.26286"
discussion_url: https://huggingface.co/papers/2611.26286
source_url: https://arxiv.org/abs/2611.26286
---

Most teams running LLM-as-judge treat high agreement between graders as a quality signal. [This paper](https://arxiv.org/abs/2611.26286) is a careful argument that agreement can be the bug, not the win.

The setting is academic peer review, but the mechanism is the one sitting under any eval harness. The authors measure how much reviewers' critiques overlap, and at ICLR that overlap climbed from 12.0% in 2026 to 21.3% in 2027, with the same rise at NeurIPS, ICML, and a couple of journals. The marginal reviewer is worth less, too: a third review added 5.46 new problems on top of the first two in 2027, down from 6.12 a year earlier. Then they run MELD, an LLM-text detector, over every review — and two reviews it flags as model-written are measurably more alike than two it doesn't, by up to 5.4 points across journal sources. Reviewers leaning on the same model produce less distinct critiques.

That is the failure mode I worry about with judge ensembles. The entire reason you run three graders instead of one is that they fail independently and catch different things; a panel earns its cost only when the members disagree for real reasons. Stand up three judges on the same base model with near-identical rubrics and you don't have three judges, you have one judge sampled three times — and your dashboard will happily report the resulting consensus as high inter-rater reliability. We measure agreement and accuracy constantly and critique diversity almost never, which is precisely the number this paper shows moving. The [HF paper page](https://huggingface.co/papers/2611.26286) has the per-venue breakdown if you want to see how fast it's shifting.

So here's the uncomfortable question for anyone with an LLM-judge panel in production: if your graders quietly converged on the same model tomorrow, which metric on your eval dashboard would even move?
