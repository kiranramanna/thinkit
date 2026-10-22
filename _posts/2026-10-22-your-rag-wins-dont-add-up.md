---
layout: post
title: "Your RAG Wins Don't Add Up"
date: 2026-10-22 14:07:21 +0000
categories: [rag, llm-ops, research]
source: hf-papers
source_id: "2610.29722"
discussion_url: https://huggingface.co/papers/2610.29722
source_url: https://arxiv.org/abs/2610.29722
---

Every RAG paper benchmarks one knob at a time — a better reranker here, query
augmentation there, context compression somewhere else — and reports a clean
double-digit lift. The question nobody answers is whether those lifts survive
when you stack them. [This paper](https://arxiv.org/abs/2610.29722) says they
mostly don't: three retrieval techniques that each looked strong predicted a
+47% combined gain and delivered +17% when used together.

That matches what anyone running a production retrieval stack has felt but
rarely measured. The authors pre-declare three hypotheses and push 450
configurations through LASAGNA, their open-source harness, across eight
benchmarks and corpora from 5K to 200K documents. Two findings land harder
than the headline: retrieval quality and answer faithfulness don't favor the
same design choices — tuning one can degrade the other — and the winning
composition shifts as the corpus grows. The combination that tops a 5K-doc
eval isn't the one that wins at 200K.

The operational takeaway is about eval discipline, not any single technique.
If your harness scores components in isolation, you're measuring a number that
won't predict production behavior, and you'll ship "improvements" that cancel
each other out or quietly trade recall for faithfulness. Test the full stack at
the corpus scale you actually serve, and re-test when that corpus doubles.

Worth reading the [HF paper page](https://huggingface.co/papers/2610.29722) if
you own a retrieval pipeline past toy scale. The uncomfortable part: how many
of the reranker and compression gains in your own changelog were ever measured
against the full surrounding stack — and not just in isolation, on a corpus a
fraction of today's size?
