---
layout: post
title: "When 'Don't Ask Again' Becomes a Credential Leak"
date: 2026-11-08 03:06:48 +0000
categories: [agentic-ai, llm-ops]
source: hn
source_id: "50407882"
discussion_url: https://news.ycombinator.com/item?id=50407882
source_url: https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again
---

The interesting failure here isn't that an agent did something reckless — it's that a convenience button quietly turned a permission decision into a persisted artifact nobody treats as sensitive. When you click "Don't Ask Again" in Claude Code, the approved command gets written to a local settings file so the agent stops prompting you. If that command carried an inline secret — a token in a curl call, a password passed on the command line — the secret rides along into the file. And that file gets committed.

[Apiiro's writeup](https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again) reports finding credentials across 1,122 public GitHub files this way. The mechanism is almost boring, which is what makes it dangerous: no prompt injection, no jailbreak, no model misbehavior. Just a UX affordance that optimizes for "stop interrupting me" colliding with a developer who pasted a credential into a shell command once. The [HN discussion](https://news.ycombinator.com/item?id=50407882) splits predictably between "that file should always be gitignored" and "secrets should never be in a command string to begin with" — both true, and both skating past the real shift: the agent's own approval log is now a credential surface.

This is the part of LLM Ops nobody budgets for. We spend our guardrail effort on what the model outputs and almost none on the operational exhaust the agent leaves behind — approval caches, tool-call transcripts, session state. Every one of those is a place a secret can settle, and most secret scanners aren't pointed at agent config files yet. If you're running coding agents across a team, that config artifact belongs in your threat model, not just your `.gitignore`. What other agent-generated files are sitting in your repos right now that you've never once scanned?
