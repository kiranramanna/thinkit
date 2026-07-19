---
layout: post
title: "When Local Transcription Ships Its Own Eval Harness"
date: 2026-07-19 14:06:21 +0000
categories: [conversational-ai, ai-infrastructure, llm-ops]
hn_id: 48963879
hn_url: https://news.ycombinator.com/item?id=48963879
source_url: https://workshop.cjpais.com/projects/transcribe-cpp
---

Most write-ups of a new inference library lead with model coverage. [transcribe.cpp](https://workshop.cjpais.com/projects/transcribe-cpp)
does too — 16 ASR families, 60-plus models, Vulkan/Metal/CUDA acceleration, a near drop-in
whisper.cpp replacement. But the line that actually earns my attention is buried lower: every
model is numerically verified and WER-tested against its reference implementation.

That's an eval harness baked into an inference engine, and it's rarer than it should be. In
practice, teams treat local ASR as a black box. You pull a quantized `.onnx` file, wire it in,
watch the demo transcribe cleanly, and ship — never confirming the accelerated path still lands
within a WER hair of the reference weights. The author (who maintains Handy, a cross-platform
speech-to-text app) is explicit that this uncertainty is exactly what drove the project: he
wanted a file he could download and *trust* ran as well as the original, on a GPU, on Mac,
Windows, and Linux. The trust is the product; the model list is table stakes.

This lands squarely in conversational-AI territory, because ASR is the front door to any voice
virtual agent. If your transcription silently degrades under quantization or a new accelerator
backend, every downstream stage — intent, slot filling, dialog state — inherits the error, and
you'll spend a week blaming the NLU model for a problem that started at the microphone. Per-model
benchmarks on a Ryzen 4750U and an M4 Max are a nice touch, but the WER validation is the part I'd
actually gate a release on.

The [HN discussion](https://news.ycombinator.com/item?id=48963879) is mostly about breadth of model
support. I think that's the less interesting axis. Here's the real question: when did you last diff
your production ASR's WER against the reference weights — or have you just been assuming the fast path
is the correct one?
