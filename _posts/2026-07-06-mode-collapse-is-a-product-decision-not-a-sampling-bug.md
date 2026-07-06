---
layout: post
title: "Mode Collapse Is a Product Decision, Not a Sampling Bug"
date: 2026-07-06 14:06:35 +0000
categories: [llm-ops, research, industry]
hn_id: 48804219
hn_url: https://news.ycombinator.com/item?id=48804219
source_url: https://rruxandra.github.io/regression-to-the-mean.html
---

The [essay's core observation](https://rruxandra.github.io/regression-to-the-mean.html) is right, and it's more concrete than the poetry makes it sound. An LLM returns the center of mass of its training distribution, RLHF sands the tails down further, and low-temperature decoding finishes the job. Feed the output back in as training data and the variance measurably shrinks each pass — that's not a metaphor, it's the model-collapse result. The "did you mean the familiar thing?" behavior the author describes is mode collapse wearing a UX.

Here's where I'd push back on the doom, though. In most of what I ship, mean reversion is the feature. A virtual agent answering a billing question, a retrieval pipeline grounding a support response — you want the typical, safe, defensible continuation. The eval harness is built to punish the interesting-but-wrong tail. Regression to the mean is what a production SLA looks like when you draw it as a distribution.

The failure is reaching for the same model and the same defaults for the one job where the tail is the point: ideation, naming, hypothesis generation, adversarial red-teaming. There you have to fight the machine on purpose — raise temperature, diversify retrieval so you're not re-grounding on the consensus, and the part most teams skip, actually measure diversity in the eval instead of only accuracy. A harness that scores nothing but "was it right" will happily optimize you into a spike.

So "guard the tail" lands, but it's an ops decision made per surface, not a philosophical stance. You choose, for each surface, whether you're buying the mean or paying to keep the deviation. The [HN thread](https://news.ycombinator.com/item?id=48804219) fills with "just raise temperature" replies, which miss that the collapse lives in the training loop, not the sampler.

If everyone grounds generation on the same three models, what's the half-life of a genuinely new idea before it reads as a typo?
