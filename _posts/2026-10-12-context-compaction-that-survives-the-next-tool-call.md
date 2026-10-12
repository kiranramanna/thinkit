---
layout: post
title: "Context Compaction That Survives the Next Tool Call"
date: 2026-10-12 03:07:57 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.11287"
discussion_url: https://huggingface.co/papers/2610.11287
source_url: https://arxiv.org/abs/2610.11287
---

Every long-horizon agent I've run in production hits the same wall: the context window fills, you compact the history into a summary, and three tool calls later the agent needs the exact detail the summary dropped. Text compaction is lossy in a way you can't predict at compaction time, so the failure surfaces downstream as a repeated search or a tool call that contradicts something the agent already learned.

[REMORY](https://arxiv.org/abs/2610.11287) goes after that gap directly. Instead of trusting the text summary alone, it trains a small network to emit a bounded set of soft memory tokens that ride alongside it — the authors frame them as a residual connection along the sequence, there to help a frozen LLM approximate what it would have produced with the full history. The headline is that on SummHay it approaches full-context quality using 5.2% of the input positions. The number I actually care about is further down: on BrowseComp and Terminal-Bench, both test models show fewer repeated tool outputs and fewer tool errors.

That second result is the production story. Repeated tool outputs and error loops are what make a long agent run slow and expensive, and they're usually a symptom of the agent having compacted away its own working memory. The catch is that "frozen LLM" still means training and serving a separate memory network per base model — a 1.9B sidecar for one, 1.24B for another — which is real operational weight for a technique competing against just writing a sharper summary prompt.

I'd want to see this on a messy multi-tool agent, not a clean benchmark, before I trusted it; the [HF paper page](https://huggingface.co/papers/2610.11287) is where that discussion will land. Is a trained memory sidecar worth the serving cost when "summarize, but keep the tool-call IDs" already gets you most of the way there?
