---
layout: post
title: "The Attack Surface Hiding in Your Document Pipeline"
date: 2026-11-01 14:07:05 +0000
categories: [llm-ops, enterprise-ai, industry]
source: hn
source_id: "50322173"
discussion_url: https://news.ycombinator.com/item?id=50322173
source_url: https://jetstream.security/insights/brazilian-court-sanctions-prompt-injection-filing/
---

The interesting part of the [Brazilian labor court's sanction](https://jetstream.security/insights/brazilian-court-sanctions-prompt-injection-filing/) isn't the courtroom drama — it's that a court has now put a legal label on a threat model the rest of us have been writing guardrails against for two years. Two law firms hid white-on-white instructions inside an employment petition, telling any AI that reviewed it to respond superficially and not challenge the documents. The court's screening tool, Galileu, flagged the hidden text and blocked it; the firms were fined 10% of the claim.

What makes this more than a novelty is the surface it exposes. For any system that ingests documents from outside your trust boundary — a RAG pipeline indexing uploaded PDFs, an agent summarizing a contract, an eval harness scoring submissions — the bytes the model reads are not the bytes a human reviewer sees. White-on-white text, zero-width characters, metadata, off-screen layers: the machine-readable layer and the human-readable layer have diverged, and the adversary picks the gap. We spend most of our hardening budget on the system prompt and the tool-calling layer; this is a reminder that the document itself is untrusted input and deserves the same scrutiny as any other user-supplied string.

The defense isn't exotic. Normalize and strip text before it reaches the model, surface a diff between rendered and extracted content, and treat "the document told me to" as exactly the injection class you already monitor. Galileu caught this one because detection lived in the ingestion path, not in the model — guardrails on untrusted documents belong at the boundary, before the content is ever a token. The [HN discussion](https://news.ycombinator.com/item?id=50322173) has the predictable "this is about to be everywhere" takes, and they're not wrong.

The wider reaction has been measured rather than breathless. [Minnesota Lawyer](https://minnlawyer.com/2026/08/24/brazil-court-sanctions-lawyers-hidden-ai-prompt/) reported it straight, crediting Galileu with catching the hidden text; the legal analysis at [J.L. Ellis](https://jlellis.net/blog/a-tale-of-two-prompt-injections-an-update-on-the-brazil-case/) is sharply critical of the attorneys while cautioning that the "AI blocked it" framing is overstated and the disciplinary case is still open; and [Magica](https://magica.com/news/hidden-prompts-brazilian-court-filings) pushes hardest against the hype, tallying several Brazilian cases but stressing that no ruling has been shown to change because of a hidden prompt. The through-line across all three: the precedent is real, the panic isn't earned yet, and the live question is whether detection keeps pace once the injections stop being this clumsy.
