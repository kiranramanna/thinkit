---
layout: post
title: "Your Next Text Classifier Might Not Be Worth Fine-Tuning"
date: 2026-09-30 03:14:18 +0000
categories: [conversational-ai, llm-ops, industry]
source: hn
source_id: "49891203"
discussion_url: https://news.ycombinator.com/item?id=49891203
source_url: https://magazine.sebastianraschka.com/p/classifier-history-and-jev
---

For a decade the reflex for a new text-classification task was automatic: fine-tune an encoder, own the weights, serve it cheap. Raschka's walk [from bag-of-words to Jev](https://magazine.sebastianraschka.com/p/classifier-history-and-jev) is really a story about when that reflex stops paying off.

The humbling part is the baseline. Bag-of-words with logistic regression hits ~89.9% on IMDb for almost nothing; a fine-tuned BERT-style encoder gets you to ~95%; and Jev, a general classifier used without any task-specific fine-tuning, lands 96.47% for about $0.65 and a 22-minute run. When a general API closes the gap to a specialist you'd otherwise have to train, host, and babysit, the build-vs-call math flips for the long tail of one-off classifiers nobody wants to maintain — which, in most conversational and NLU systems, is most of them.

The detail I'd actually chase is calibration, not headline accuracy. Jev's pitch leans on training for calibrated decisions — rewarding answers that are correct *and* well-calibrated, not just correct. That matters because a classifier's label is rarely the end of the pipeline: you route, escalate, or abstain on a confidence threshold. A model that's 96% accurate but overconfident on its wrong 4% is worse in production than a slightly less accurate one that knows when it's unsure. That's the number vendors don't lead with and the one your eval harness should be measuring.

Raschka's own advice still holds: start with logistic regression to get a baseline before reaching for anything large. The [HN discussion](https://news.ycombinator.com/item?id=49891203) is worth a skim for the practitioner take on trusting a closed model trained on synthetic data. The question I keep coming back to: if the baseline is ~90% for free and the frontier is ~96% for a price, how many of your classifiers actually live in the six points you'd be paying for?
