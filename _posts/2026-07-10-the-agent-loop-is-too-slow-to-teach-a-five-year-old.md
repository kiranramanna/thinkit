---
layout: post
title: "The Agent Loop Is Too Slow to Teach a Five-Year-Old"
date: 2026-07-10 03:05:00 +0000
categories: [conversational-ai, agentic-ai, llm-ops]
hn_id: 48852199
hn_url: https://news.ycombinator.com/item?id=48852199
source_url: https://www.ello.com/blog/teaching-a-child-in-1000-ms
---

The standard agent tool loop — emit tool calls, wait, observe, decide — has a latency floor most of us never feel, because our users are adults who tolerate a spinner. Ello's writeup on their [real-time kids' tutor](https://www.ello.com/blog/teaching-a-child-in-1000-ms) is the clearest illustration I've seen of what happens when that floor becomes a product-killer. In a playtest, a six-year-old waited through the model's thinking and asked "why is he not doing anything... it's boring." Another child learned she only had to pay attention part of the time and could still keep up. Latency didn't just degrade the UX; it taught the child to tune the tutor out, which was the moment she stopped learning.

Their numbers are the part worth internalizing. Frontier models take 2-3 seconds to first token and decode around 30 tokens/sec; with per-action outputs of a few dozen tokens plus audio playback, a naive loop leaves 3-4 seconds of dead air between every sentence. The usual escape hatch — a smaller, faster model — failed them for a reason that matches my experience with narrow-scope agents: the small model followed instructions poorly across a broad action space and kept giving the answer away instead of scaffolding. Speed bought at the cost of pedagogy is not a trade a teacher would make.

The fix is the interesting bit. They threw out the loop and built a harness where the model streams multiple actions in one response, and an interpreter parses and executes each action while the model is still generating the next. The child waits about 30 tokens, not a full completion. Validation runs on the stream — an invalid action interrupts and regenerates, the happy path never pauses — and the action set is scoped to the moment, so a question on screen exposes scaffolding options, not the answer.

This is the same wall production virtual agents hit: the tool loop is a great default and a terrible latency contract. The [HN thread](https://news.ycombinator.com/item?id=48852199) argues about where the abstraction leaks. Is the generic agent loop just the wrong primitive for real-time voice, or does it need a streaming-execution layer baked in before it's usable there at all?
