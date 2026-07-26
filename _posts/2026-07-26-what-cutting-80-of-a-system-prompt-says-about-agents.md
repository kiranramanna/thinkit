---
layout: post
title: "What Cutting 80% of a System Prompt Says About Agents"
date: 2026-07-26 03:03:09 +0000
categories: [agentic-ai, llm-ops]
hn_id: 49051361
hn_url: https://news.ycombinator.com/item?id=49051361
source_url: https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models
---

The headline number — [Anthropic removed over 80% of Claude Code's system prompt](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models) with no measurable eval regression — is the least interesting part. What matters for anyone operating agents in production is *why* it works now and wouldn't have a year ago: the failure mode moved from "the model can't decide" to "we over-specified the decision for it."

Their example lands. The old prompt said default to writing no comments. The new one says match the comment density of the surrounding code. One is a rule; the other is judgment delegated to the model. Every guardrail you write is a bet that the model can't make a call, and each generation makes fewer of those bets pay off. The counterintuitive one for me: tool-use examples now *hurt*. Concrete examples pin the model to the exploration space you demonstrated instead of the one the task needs. The recommended fix is expressive tool interfaces, not worked examples.

This maps directly onto how prompt cruft accumulates in real agent harnesses. We collect defensive instructions the way codebases collect dead config — every past incident leaves a "never do X" line, and nobody deletes them because deleting feels risky. Rightsizing context is an ops discipline, not a nice-to-have: redundant guidance living in both the system prompt *and* the tool descriptions is pure token tax, and worse, a source of contradictions the model has to reconcile. Progressive disclosure — deferred tool loading — is the same lesson from the retrieval side: don't front-load context you might not need.

The open question I can't answer yet: if the right prompt keeps shrinking with each model, what's the floor? At some point context engineering collapses into "write good tools and get out of the way," and most eval harnesses aren't built to tell us when we've crossed that line. The [HN thread](https://news.ycombinator.com/item?id=49051361) has the predictable split between people who've watched this happen and people still hand-tuning 4,000-token system prompts.
