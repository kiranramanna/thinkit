---
layout: post
title: "Teach Your Coding Agent to Search Before It Greps"
date: 2026-10-12 03:07:57 +0000
categories: [agentic-ai, rag, llm-ops]
source: hn
source_id: "50049508"
discussion_url: https://news.ycombinator.com/item?id=50049508
source_url: https://tedhaley.ca/pensieve/
---

The pitch for [Pensieve](https://tedhaley.ca/pensieve/) is one every agent engineer has had at 2am watching a token meter: stop making the coding agent grep the whole repo and read forty files to answer one question. Build a local semantic index once, hand the agent the relevant passages with file and line numbers over MCP, and let it ask instead of hunt. What makes it worth a look is that the author published the benchmark instead of a marketing number.

- 🎯 **43% fewer tool calls** per lookup (2.0 vs 3.4), and the right file was found slightly *more* often — the index isn't trading accuracy for speed.
- ⚡ **18% cheaper, 21% faster** per lookup, with per-repo token savings landing at a sober 6–28% across four codebases.
- 🔍 **"Search before you grep"** ships as agent instructions and Claude Code hooks, not a suggestion the model is free to ignore.
- 🔒 **Nothing leaves the machine** — an on-device embedding index that skips `.env` files and keys, which is the part a hosted context window can't answer.
- ⚠️ **Grep still wins on exact error strings**, and the author says so — the kind of honesty most "we cut 94% of tokens" posts skip.

That last caveat is why I trust the 18% more than I'd trust a 90%. The giant reductions quoted elsewhere compare against a worst-case read-every-file baseline, not against an agent that already greps competently; a real index against a real agent should produce exactly these modest, repo-dependent numbers. The [HN discussion](https://news.ycombinator.com/item?id=50049508) splits on the obvious question — infrastructure worth owning, or a stopgap until cheap long-context recall moves inside the model? I lean toward owning it, because retrieval you control is the one piece of the agent loop that doesn't get a vendor's roadmap imposed on it.
