---
layout: post
title: "The Fragile Thing Isn't the AI Code, It's the Review"
date: 2026-11-11 03:12:39 +0000
categories: [agentic-ai, llm-ops, industry]
source: hn
source_id: "50438318"
discussion_url: https://news.ycombinator.com/item?id=50438318
source_url: https://evanxmerz.com/post/ai-usage-generates-a-fragile-codebase/
---

[Evan Merz's post on fragile AI codebases](https://evanxmerz.com/post/ai-usage-generates-a-fragile-codebase/) lists four failure modes, and the discourse will fixate on the wrong two. Shallow tests and overcomplicated helper methods are real, but they are code smells — linters, coverage-quality gates, and a tighter review checklist catch them. The two that actually compound are the ones no tool fixes: developers understanding their own system less, and review throughput falling behind generation throughput.

That second one is the quiet killer. An agent opens PRs faster than a human can read them carefully, so reviewers skim, and skimming is how weak tests and muddy abstractions get merged as precedent. Next cycle the model reads that merged code as the house style and copies it. You have built a feedback loop that launders shortcuts into conventions.

I would push back on one framing, though. Merz leans on the line that "AI codebases are software made by AI for AI," which makes it sound like a tooling problem. It is an operating-model problem. If you adopt agentic coding without changing how review scales — smaller diffs, machine-checkable invariants, architecture decisions written down before the agent touches them — fragility is the default, not a surprise. The agent did not lower your quality bar; your unchanged review process did.

The symptom worth instrumenting first, per the post, is incidents creeping up gradually after adoption, with slower recovery because fewer people understand the code. That is a measurable signal, not a vibe. The [HN discussion](https://news.ycombinator.com/item?id=50438318) is where the disagreement lives, and it is worth reading before you decide how much of this maps to your own stack.

So here is the test I would run before blaming the model: if you doubled your PR volume with no AI at all, would your current review process survive it? If not, the AI was never the problem — it was just the thing that arrived first.
