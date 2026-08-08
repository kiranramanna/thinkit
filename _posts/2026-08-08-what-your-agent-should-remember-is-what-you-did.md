---
layout: post
title: "What Your Agent Should Remember Is What You Did"
date: 2026-08-08 03:04:14 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2608.05784"
discussion_url: https://huggingface.co/papers/2608.05784
source_url: https://arxiv.org/abs/2608.05784
---

The insight in [Activity Frames](https://arxiv.org/abs/2608.05784) is almost embarrassingly simple: an agent's memory today records what the user *said*, not what the user *did*. So a computer-use agent pays full frontier inference to re-derive a routine you already ran an hour ago.

Their fix is a deterministic, zero-model compiler. It segments a local screen-capture stream into typed "activity frames" — bounded episodes carrying application, site, timing, input volume, and pointers back to the raw rows. No LLM in the loop, which is the part I care about: the output is byte-identical, cacheable, and mechanically auditable. Anyone who has tried to debug an LLM-summarized memory in production knows the pain of non-reproducible context. A memory you can diff is a different kind of primitive.

The numbers on their single-user corpus are strong — a day of capture compressed 86x into a prompt-ready block in 68 ms, and an agent reading that block answers questions about the day at 98.4% accuracy versus 66-80% for an LLM summary of the same capture. A mid-tier model reading the compiled block matches a frontier one. That last point is the real cost story: better context beats a bigger model.

The second half doubles the compiler as a demand-side cost instrument, reporting a Routine Overhead Ratio of 60-343x and a delegable recurrence near 8% — the slice of work an agent could replay deterministically at zero model tokens. Schema, compiler, and eval harness are open on the [HF paper page](https://huggingface.co/papers/2608.05784).

My one reservation: this is n=1, a single professional's 51 days. The mechanism is sound; generalization across messy multi-user workflows is unproven. Still, if your agent stack treats memory as "summarize the transcript," this reframes the question — why is anything deterministic and recurring going through a model at all?
