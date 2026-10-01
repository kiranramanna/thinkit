---
layout: post
title: "Your Agent's Memory Is a Claim, Not a Record"
date: 2026-10-01 03:07:51 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2609.36130"
discussion_url: https://huggingface.co/papers/2609.36130
source_url: https://arxiv.org/abs/2609.36130
---

We treat an agent's persistent memory like a log — something that happened, written down. It isn't. Every memory an agent compresses out of its interaction history is a derivation: a claim that something follows from what it saw. And like any derivation, it can be invalid while every individual fact inside it is true.

That's the trap ["Memory Is a Derivation"](https://arxiv.org/abs/2609.36130) names precisely. Compression can stitch two separately-supported facts into a composite statement the history never established, or attach citations that omit the evidence actually backing the claim. So you get two failure modes that look nothing alike: a valid memory that reads as unsupported because its citations are incomplete, and an unsupported memory that reads as fine because its parts all check out. The DerivAudit framework pulls these apart with three questions — is the supporting evidence outside the cited span, does the composed memory introduce meaning on its own, and does write-time admission actually catch the bad ones.

The numbers are the part worth sitting with. Auditing against broader pre-write history recovers support for nearly 60% of memories that looked unsupported from citations alone — so citation-only verification is mostly crying wolf. But 17-21% stay unsupported even after you widen the evidence, and admission gates keep waving them through. On two backbones, expanding the evidence made admission *worse*. That maps straight onto what I see in production: the write path into long-term memory is almost never evaluated as its own stage. We eval retrieval, we eval the final answer, and we trust whatever the agent chose to remember three sessions ago.

The [HF paper page](https://huggingface.co/papers/2609.36130) frames this as a memory problem, but it's really an eval-harness gap. If your agent carries state across sessions, where is the test that the premise it's now reasoning from was ever actually earned?
