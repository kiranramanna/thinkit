---
layout: post
title: "The 67-Cent ARC-AGI Score Hides an Eval Question"
date: 2026-09-01 14:03:17 +0000
categories: [llm-ops, ai-infrastructure, research]
source: hn
source_id: "49519939"
discussion_url: https://news.ycombinator.com/item?id=49519939
source_url: https://mvakde.github.io/blog/44-on-arc-1/
---

The headline number — [44% on ARC-AGI-1 for 67 cents](https://mvakde.github.io/blog/44-on-arc-1/), from an 8-layer transformer trained from scratch in about 90 minutes on a single GPU — is the least interesting thing in the write-up. The interesting part is buried in the caveats: the model is trained at test time on the evaluation puzzles' inputs (not their labels), and the author is refreshingly uneasy about it, flatly saying they dislike the augmentations they leaned on to get there.

That tension is the whole story for anyone who runs evals for a living. Test-time training sits in a gray zone — is "transductive reasoning" over the eval inputs a legitimate capability, or is it quietly fitting the benchmark? ARC-AGI was built to resist exactly this, and a sub-dollar run scoring 44% says the line between "solved the task" and "adapted to the test distribution" is thinner than a single leaderboard cell can show. The honest tell is one of the author's own ablations: removing input-token training improved the score while worsening test loss. When your loss and your metric point in opposite directions, you're measuring something other than what you think you are.

The cost angle is real too — good representations (3D RoPE plus per-task embeddings) carried most of the gains, not scale — and that's a useful signal if you're deciding where a compute budget should go. But the durable lesson is about eval hygiene, not price. Cheap enough to run a hundred variations is also cheap enough to overfit your own benchmark a hundred ways.

The [HN discussion](https://news.ycombinator.com/item?id=49519939) splits along the predictable line: impressed by the efficiency, wary of the test-time-training asterisk. Which camp is right turns on the question ARC keeps forcing on us — if a model has to train on the test to pass it, what exactly did the test measure?
