---
layout: post
title: "When Your MCP Server Ships Invisible Instructions"
date: 2026-07-23 14:04:07 +0000
categories: [agentic-ai, llm-ops, research]
hn_id: 48989006
hn_url: https://news.ycombinator.com/item?id=48989006
source_url: https://brightsec.com/research/detecting-ansi-escape-sequence-injection-in-mcp-servers-with-dast/
---

The interesting part of Bright Security's [writeup on ANSI escape injection](https://brightsec.com/research/detecting-ansi-escape-sequence-injection-in-mcp-servers-with-dast/) isn't the exploit — it's the asymmetry it weaponizes. A terminal renders escape sequences (that `0x1B` byte and friends) into cursor moves and color; a language model reads them as literal text. So a payload that looks like blank space to a human operator arrives at the model as a fresh instruction. Human-in-the-loop review sees nothing wrong. The agent sees an order.

That gap matters because MCP tool results are the least-scrutinized text in most agent stacks. We spend enormous effort hardening system prompts and almost none on the bytes coming back from a fetch tool or a resource read. The stored variant is the one that should worry anyone running a shared knowledge base: a single poisoned record, written through an HTTP endpoint, activates later when a different entrypoint reads it into an MCP context. One write, many sessions, crossing the protocol boundary — exactly the blast radius you don't want in a multi-tenant agent.

Their detection approach is the part worth stealing. Instead of inspecting rendered output, they check raw bytes, target only model-consumable fields (tool results, resource reads, prompt templates), and require three signals to fire together: the escape byte, an instruction phrase, and a unique trigger marker. That last constraint is what keeps a scan from drowning in false positives — the same discipline a good eval harness needs.

The mitigation is unglamorous: strip control bytes from external text before it reaches the model, and treat tool output as hostile by default. We already do this for user input; tool output deserves the same suspicion. The [HN thread](https://news.ycombinator.com/item?id=48989006) has the usual "why isn't escape sanitization just the default" reactions, and honestly, they're right.

If your agent's audit log can be cleared by the very content it's auditing, what is the log actually proving?
