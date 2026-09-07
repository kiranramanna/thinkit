---
layout: post
title: "Making Hallucination Detection Cheap Enough to Ship"
date: 2026-09-07 14:09:16 +0000
categories: [llm-ops, rag, research]
source: hf-papers
source_id: "2609.00581"
discussion_url: https://huggingface.co/papers/2609.00581
source_url: https://arxiv.org/abs/2609.00581
---

The reason factuality checks rarely run inline in production isn't accuracy — it's cost. [Enoki](https://arxiv.org/abs/2609.00581) starts from that constraint. Claim-level hallucination detectors decompose a response and verify each unit with a stack of LLM calls; span-level detectors run their own pass to highlight the offending text; and bridging the two needs a separate claim-to-span alignment step. Three pipelines to answer one question — is this grounded, and where isn't it — is why a lot of teams ship without the guardrail at all.

Enoki's move is to make one representation do both jobs. It pulls text-anchored OpenIE triples out of each sentence, verifies those facts against the retrieved evidence, then projects the unsupported ones straight back onto their spans. Claim-level verification and span-level localization fall out of the same structure, so the expensive alignment pass disappears. In RAG terms this is the check you actually want sitting between retrieval and the user: not just "the answer is partly unsupported," but which clause the retrieved context never backed.

What makes it deployable is the graceful degradation. The same interface runs LLM-based, encoder-based, or rule-based extraction, so you trade accuracy against inference cost instead of choosing between a slow detector and no detector. The authors report staying competitive with strong claim-level systems at lower resource use, and better fine-grained span- and entity-level localization. They also release EnokiQA, a dual-granularity dataset with aligned claim- and span-level annotations — which matters, because you can't tune a guardrail you can't measure at the granularity you'll enforce it.

Details and the dataset are on the [HF paper page](https://huggingface.co/papers/2609.00581). The shift worth noticing is treating hallucination detection as a latency-budget problem, not a modeling one. My bet: the guardrails that survive contact with production SLAs are the ones with an encoder or rule-based fallback tier — because the LLM-judge-per-claim design is the first thing cut when the p99 bill comes due.
