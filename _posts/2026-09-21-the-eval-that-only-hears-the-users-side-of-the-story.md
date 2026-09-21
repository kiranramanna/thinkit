---
layout: post
title: "The Eval That Only Hears the User's Side of the Story"
date: 2026-09-21 03:08:41 +0000
categories: [conversational-ai, llm-ops, research]
source: hf-papers
source_id: "2609.17496"
discussion_url: https://huggingface.co/papers/2609.17496
source_url: https://arxiv.org/abs/2609.17496
---

Most social-reasoning benchmarks hand the model a clean, third-person account of a situation and ask it to reason. [Fuse](https://arxiv.org/abs/2609.17496) breaks that assumption on purpose: the assistant only ever hears the user's version. A target agent acts with a hidden motive, a user agent observes and then consults the assistant — so the ground truth (the motive) is verifiable by construction, but everything the assistant knows arrives already filtered through one subjective narrator.

That framing is why this matters for anyone shipping a virtual agent. Real consultation traffic — "my manager did X, what should I do" — is never the raw event log; it's one person's telling of it, with all the omissions and slant that implies. The [HF paper page](https://huggingface.co/papers/2609.17496) reports the results that follow from taking that seriously: across 12 models, none clears 81% on the first message where humans reach 88%, biased framing alone costs 6.9–12.5 points, and — the finding I'd pin above my desk — extra dialogue turns don't reliably close the gap. More conversation is not more understanding.

For an eval harness, the move worth borrowing is the verifiable-simulation trick: a hidden-motive setup gives you a hard label for something that normally has none, so you can score "did the assistant see through the framing" instead of hand-rating vibes. The honest limit lives in the same sentence — a motive you constructed is not the messy, underdetermined intent of a real person, and passing Fuse proves robustness to one failure mode, not social competence. Still, if you're building anything that gives interpersonal advice, a Fuse-style probe belongs in front of the ship gate: it targets exactly the bias your happy-path test set will never surface. What would your current assistant score if the only witness it ever got was the one with a reason to shade the story?
