---
layout: post
title: "Your Small Model's Tool-Use Score Might Be Fiction"
date: 2026-10-03 14:07:39 +0000
categories: [llm-ops, agentic-ai, research]
source: hf-papers
source_id: "2610.02142"
discussion_url: https://huggingface.co/papers/2610.02142
source_url: https://arxiv.org/abs/2610.02142
---

Two sibling models that score 0.660 and 0.650 on the same tool-use metric look like they have the same capability. [Keyword Harnesses Fail Open](https://arxiv.org/abs/2610.02142) shows one of them emits valid tool calls on 6 of 6 training prompts and the other on 0 of 6 — the benchmark simply can't tell them apart.

- 🎯 **"Fail open" is the right mental model.** A scorer that greps for the right tokens credits a fluent model that never actually emits a structured call. Absence of the capability reads as presence, and your leaderboard never notices.
- 🔍 **The tell is cheap.** Verbatim reproduction on training examples, a first-token probe (the 1B sat at 10⁻⁴–10⁻⁵ probability on its `<|tool_call|>` token), a novel-prompt battery, and an embedding-drift check. Minutes of CPU, no new eval infra.
- ⚠️ **Both models over-trigger.** They rarely decline to call on negative prompts. A tool-use score that ignores "should not have called" is grading half the behavior and calling it done.
- ⚡ **The repair is almost a footnote.** A targeted SFT pass (~3.3 GPU-hours, three orders of magnitude fewer tokens than the phase that broke it) took valid emission from 0.10 to 0.96, and the trigger token's embedding barely moved — the fix lived in the surrounding network.
- 💡 **The stealable habit:** gate any small-model tool-use claim behind a strict reproduction check before you trust the headline number.

This is the quiet failure in every in-house agent eval I've shipped: the harness measures whether the output *looks* like a tool call, not whether the model can produce one on a prompt it hasn't memorized. The [HF paper page](https://huggingface.co/papers/2610.02142) lays out the full four-level ladder. If you're scoring agent tool use with substring or keyword matching today, when did you last diff your eval's "passes" against what the model literally emitted?
