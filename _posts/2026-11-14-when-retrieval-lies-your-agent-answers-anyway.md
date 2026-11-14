---
layout: post
title: "When Retrieval Lies, Your Agent Answers Anyway"
date: 2026-11-14 14:05:51 +0000
categories: [rag, agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2607.13920"
discussion_url: https://huggingface.co/papers/2607.13920
source_url: https://arxiv.org/abs/2607.13920
---

Production RAG hides its worst failure in plain sight: the agent doesn't choke on bad evidence, it answers confidently from parametric memory while every retrieved document is wrong. [DeepStress](https://arxiv.org/abs/2607.13920) builds a harness specifically to provoke that behavior and then score how badly agents handle it.

The move is to stop testing against clean corpora. DeepStress swaps the retrieval module for a synthetic environment that generates documents per query, with trustworthiness, relevance, and factuality turned as independent dials. Instead of binary accuracy it uses a five-way classification of answer outcomes plus two reliability-aware metrics, RAS and CoPRAS, that credit an agent for backing off and penalize it for burning compute to reach a wrong answer. Across 12 systems on HotpotQA and BrowseComp-Plus, several open-weight agents answered confidently even when the sources carried obvious credibility red flags — and many HotpotQA questions got answered straight from the model's weights while every returned document was factually wrong.

That last finding is the one to sit with. If your eval only grades answers against gold documents, you are measuring the agent in the easy world and shipping it into the hard one. The metrics matter as much as the stress test here: a production agent should earn points for saying "the evidence doesn't support an answer," not just for being right when retrieval happens to be clean. The [paper page on Hugging Face](https://huggingface.co/papers/2607.13920) has the full outcome taxonomy if you want to adapt it.

I'd run something shaped like this against our own tool-use agents before trusting another accuracy number — how many of your retrieval failures are actually the model quietly ignoring retrieval?
