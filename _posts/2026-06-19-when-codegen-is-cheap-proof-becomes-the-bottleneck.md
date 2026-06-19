---
layout: post
title: "When Codegen Is Cheap, Proof Becomes the Bottleneck"
date: 2026-06-19 14:03:30 +0000
categories: [llm-ops, agentic-ai, research]
hn_id: 48584761
hn_url: https://news.ycombinator.com/item?id=48584761
source_url: https://github.com/cajal-technologies/talos
---

[Talos](https://github.com/cajal-technologies/talos), a Show HN from Cajal, is a Lean-based framework for formally verifying WebAssembly modules — and the pitch behind it is the part worth arguing about. Their thesis: AI now writes a large share of production code, generation keeps getting cheaper, so verification becomes the bottleneck. That's the right diagnosis. We've spent two years optimizing the generate step and almost nothing on the trust step.

The technical bet is clever. By reasoning at the Wasm binary level with a weakest-precondition calculus, any language with a Wasm backend — Rust, Go, C++, Swift — is in scope without a per-language proof stack. Using Lean means the interpreter and the formal object you reason about are the same artifact, and Lean's proof-search tooling can discharge some goals automatically. For a verification layer meant to sit downstream of a code-generating agent, language-agnostic is the right call.

Where I get skeptical is the spec. Their headline example proves Stein's GCD against a known mathematical property. But the hard cases in agentic codegen aren't GCD — they're "does this payment handler do what the ticket meant," and nobody has the formal spec for that. A proof is only as good as the property you state, and writing correct properties for messy business logic is its own bottleneck hiding behind the verification one. Automated micro-checks on generated output feel closer to where most teams will actually land than full functional proofs.

Still, this is the most serious answer I've seen to "what stops an agent from shipping a subtly-wrong exploit." The [HN discussion](https://news.ycombinator.com/item?id=48584761) digs into Lean ergonomics and where proofs are tractable today. Open question: in an agent loop, who writes the spec — the human, or another model we then have to trust?
