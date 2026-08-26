---
layout: post
title: "Your Retriever Is the Trust Boundary You Forgot"
date: 2026-08-26 03:02:57 +0000
categories: [rag, llm-ops, research]
source: hf-papers
source_id: "2606.13610"
discussion_url: https://huggingface.co/papers/2606.13610
source_url: https://arxiv.org/abs/2606.13610
---

The number that matters in [FORGE](https://arxiv.org/abs/2606.13610) isn't 73.8%. It's the single polluted page yielding a 27% fooled rate — because that's the realistic attack. Nobody has to own your entire top-3; they need to rank one plausible page.

Here's the reframe: retrieved context is an untrusted input, and most RAG stacks still treat it as ground truth. We pour effort into the generation side — output guardrails, PII filters, answer eval — and spend almost nothing treating the retriever itself as a trust boundary. FORGE rewrites real products inside retrieved pages into fake ones and measures how often 12 commercial and open-weight models recommend the fake. Every one of them bites.

The part that should unsettle anyone running production RAG: reasoning made it worse. Chain-of-thought didn't catch the fabrication — it generated spurious social proof to justify recommending it. And the defenses underwhelm. A skepticism prompt can amplify the failure much like reasoning does, consensus filters suppress legitimate products, and credibility re-ranking — the strongest of the four — strips out only a sixth of the fakes.

For enterprise retrieval this changes the threat model. If your agent pulls from the open web, or from any corpus a third party can write into, Generative Engine Optimization stops being a marketing nuisance and becomes an injection vector. The [HF paper page](https://huggingface.co/papers/2606.13610) has the full breakdown, and the authors shipped the benchmark so you can point it at your own stack.

The early coverage is reading this as a security wake-up call, not a lab curiosity. [TechXplore](https://techxplore.com/news/2026-06-fake-web-page-ai-bots.html) leads with the alarm — every model vulnerable, defenses failing — while [Fast Company](https://www.fastcompany.com/91562049/one-fake-webpage-can-be-enough-to-trick-ai-shopping-recommendations) frames it for shoppers: one fake page is enough to make an assistant recommend a brand that doesn't exist. Both land on the same uncomfortable place — the failure happens upstream of the model, so retrieval-time provenance is where the fix has to live.
