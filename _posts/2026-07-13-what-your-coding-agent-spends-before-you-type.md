---
layout: post
title: "What Your Coding Agent Spends Before You Type"
date: 2026-07-13 03:03:36 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
hn_id: 48883275
hn_url: https://news.ycombinator.com/item?id=48883275
source_url: https://systima.ai/blog/claude-code-vs-opencode-token-overhead
---

Systima put Claude Code and OpenCode on the same model, the same machine, and the same tasks, then spliced a logging proxy at the API boundary to measure exactly what each harness spends before your prompt even arrives. The headline gap is real, but the nuance is where the operating lesson lives.

- 🎯 On Sonnet 4.5, Claude Code burned about 33k tokens of system prompt, tool schemas, and injected scaffolding before the user prompt; OpenCode used about 7k. On Fable 5 the gap narrows to roughly 3.3x, because Claude Code sends newer models a leaner prompt — the multiple is model-dependent.
- ⚡ Cache economics decided more than raw size. OpenCode's request prefix was byte-identical every run, so it cached once per session and read it back for pennies. Claude Code rewrote cache mid-session, run after run — up to 54x more cache-write tokens on the same task, and writes bill at a premium.
- 📊 Config compounds it. A 72KB CLAUDE.md/AGENTS.md adds around 20k tokens to every request; five modest MCP servers add another 5-7k. A real setup is 75-85k tokens deep before you type a word.
- ⚠️ Subagents aren't free. A task that cost 121k tokens done directly cost 513k fanned out to two subagents — each carries its own bootstrap, and the parent then eats the transcript.
- ✅ One point for Claude Code: on a multi-step task its whole-task total came in lower, because it batches tool calls into fewer requests while OpenCode re-pays its smaller baseline every turn.

The takeaway isn't "harness X is bloated." It's that every scaffolding token is working context you can't spend on the actual code, and cache stability matters more than prompt size. If you run agents under audit — EU AI Act Article 12 expects you to log what your system actually does — "what does my agent send" should be answerable from data, not folklore. The [full measurement writeup](https://systima.ai/blog/claude-code-vs-opencode-token-overhead) shows the method; the [HN discussion](https://news.ycombinator.com/item?id=48883275) argues over whether cache reads make the baseline moot. When did you last read your agent's payload at the API boundary?
