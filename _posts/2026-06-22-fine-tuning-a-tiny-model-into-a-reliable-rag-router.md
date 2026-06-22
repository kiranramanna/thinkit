---
layout: post
title: "Fine-Tuning a Tiny Model Into a Reliable RAG Router"
date: 2026-06-22 03:03:30 +0000
categories: [rag, conversational-ai, llm-ops]
hn_id: 48623434
hn_url: https://news.ycombinator.com/item?id=48623434
source_url: https://www.teachmecoolstuff.com/viewarticle/fine-tuning-a-local-llm-to-categorize-questions
---

The interesting result in this [household-chatbot writeup](https://www.teachmecoolstuff.com/viewarticle/fine-tuning-a-local-llm-to-categorize-questions) isn't the chatbot — it's the query router. The part that decides which metadata slice of the vector index to search runs fine on a 0.6B model once you fine-tune it. Most RAG stacks spend a frontier model on this and never notice.

- 🎯 **Routing is classification, not generation.** Mapping "when did we replace the pool pump?" to `pool` before retrieval, to shrink the candidate set, is intent classification wearing a RAG hat.
- ⚠️ **Prompting a tiny model fails hard.** Qwen 3:0.6B scored 10% (13/131) zero-shot — overusing broad labels and inventing categories outside the allowed list.
- ✅ **Fine-tuning got it usable.** Unsloth + QLoRA on ~850 examples took accuracy to 79%, though it still emitted fragments like `ac/air` instead of `hvac`.
- 💡 **Output schema did the rest.** Remapping categories to opaque two-letter codes with no semantic overlap pushed it to 92%. The fix wasn't more data — it was removing the model's room to be "almost right."
- 🔍 **The residual errors are ontology, not noise.** Tankless water heater keeps landing in `pool`. No fine-tune papers over a labeling problem.

I keep seeing teams reach for the big model on the intent layer because it's already in the stack. This is the counter-argument: a 600M classifier you run locally, evaluate against a 131-case battery, and retrain on user feedback. The [HN discussion](https://news.ycombinator.com/item?id=48623434) argues over where that line sits.

If a two-character code buys 13 points over semantic labels, how much of your own eval gap is the model versus the shape of what you're asking it to emit?
