---
layout: post
title: "When the Fix for a Verbose Agent Is a Second LLM"
date: 2026-08-21 03:04:09 +0000
categories: [llm-ops, agentic-ai]
source: hn
source_id: "49375996"
discussion_url: https://news.ycombinator.com/item?id=49375996
source_url: https://github.com/zachahn/vomit
---

The interesting thing here isn't the tool, it's the admission behind it: agent output has become a surface bad enough that people will run a second model to sanitize it. [Vomit](https://github.com/zachahn/vomit) is a small, blunt utility — its tagline is "clean up Claude 5's token vomit with a separate LLM" — that hooks a coding agent's session and pipes its verbose narration through a local model (Ollama, Llama.app, anything OpenAI-compatible) to render a terser version. The [HN discussion](https://news.ycombinator.com/item?id=49375996) is less about the code than the shared grievance: agent narration has drifted into dense, self-important filler, and people are now spending compute to undo it.

The engineering detail that matters is the tradeoff the author is honest about. The cleaner model only sees what the agent chose to emit — not its tool calls or file edits — so it hallucinates, it's slow, and it can drop the message entirely. That's the anti-pattern in miniature: stacking a second model on the output of the first buys readability at the cost of latency and a fresh hallucination surface, on the one artifact that was supposed to be the reliable part. You pay twice — once for the tokens, once to make them legible.

The real fix lives one layer up, in the primary model's output contract, not in a display-time scrubber. But that a vibe-coded local patch resonated at all is the signal I'd carry back to any team shipping agents: verbosity isn't a cosmetic complaint, it's an eval miss. If your agent is measured only on task success and never on whether a human can read the trace, you've left exactly the gap this tool is papering over.

When did output legibility stop being part of your agent's eval?
