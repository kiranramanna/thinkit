---
layout: post
title: "Why Coding Agents Need Their Own Ignore File"
date: 2026-06-29 03:06:35 +0000
categories: [agentic-ai, llm-ops, enterprise-ai]
hn_id: 48706714
hn_url: https://news.ycombinator.com/item?id=48706714
source_url: https://github.com/openai/codex/issues/2847
---

The interesting part of [this still-open Codex issue](https://github.com/openai/codex/issues/2847) isn't the missing feature — it's what the request exposes about how we've been reasoning about agent file access. The ask is small: a `.codexignore` that marks files the agent must never read or send to the model — `.env`, `*.pem`, `id_*`, `.aws/**`, `.ssh/**` — repo-local and global, the way `.gitignore` already works for version control.

Here's the gap. `.gitignore` answers "what shouldn't live in history." It says nothing about what an agent is allowed to load into a prompt. Those are different threat models. A secret can be perfectly gitignored and still sit in your working tree, where a coding agent will happily read it, summarize it, and ship it to a model endpoint the first time you ask "why is auth failing?" The exfiltration surface stopped being the repo. It's the context window now.

This is where the enterprise governance story gets real. The moment an autonomous agent has filesystem read, every credential in the working tree is one tool call away from the prompt. "Don't read `.env`" as a system-prompt line isn't a control — it's a suggestion the model can rationalize past mid-task. A deterministic, shareable denylist enforced *before* the read, not after, is the control. The [HN thread](https://news.ycombinator.com/item?id=48706714) clearly wants it; the issue notes a prior request was closed in favor of the Rust rewrite, where the capability still doesn't exist.

My bet: within a year, `.aiignore` is as standard as `.gitignore`, and agents that don't honor one quietly fail enterprise procurement. The harder question is enforcement — who guarantees the denylist runs before the file hits the tokenizer, not after the bytes are already in the request?
