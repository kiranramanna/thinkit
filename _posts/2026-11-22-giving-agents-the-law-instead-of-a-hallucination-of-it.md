---
layout: post
title: "Giving Agents the Law Instead of a Hallucination of It"
date: 2026-11-22 03:05:29 +0000
categories: [agentic-ai, rag, enterprise-ai]
source: hn
source_id: "50593481"
discussion_url: https://news.ycombinator.com/item?id=50593481
source_url: https://www.pandex.io
---

Agents don't fail at legal questions because the model is dumb. They fail because the law isn't in the weights — it's millions of documents that change, cite each other, and mean nothing without the surrounding text. [Pandex](https://www.pandex.io) is a bet that the fix is unglamorous infrastructure: put EU and national legislation plus top-court decisions behind one API and an MCP server, straight from the institutions that publish them, and let the agent retrieve instead of guess.

- 🎯 **"Official" describes the source, not a blessing** — the value is primary text pulled from the publishing institutions, not an EU endorsement. Worth stating plainly, because the headline reads stronger than the claim underneath it.
- 🔍 **Citations are the product** — 37M links between documents form a graph, and that graph is the grounding signal that turns retrieval over legal text into something usable instead of a keyword lottery.
- ⚡ **MCP is the delivery choice that matters** — standardizing the retrieval tool means this drops into Claude, Cursor, and the rest with no bespoke integration. The corpus is the moat; the protocol is plumbing.
- ⚠️ **Grounding is not correctness** — handing an agent the right statute doesn't stop it misreading one, and a statute served a week stale is a freshness-SLA problem no amount of search quality fixes.
- 💡 **The pattern generalizes** — every regulated domain has an authoritative corpus nobody has made agent-shaped yet, and whoever does it well owns the retrieval surface.

The [HN discussion](https://news.ycombinator.com/item?id=50593481) is worth a read. My own take: the reflexive "it's just a wrapper over public data" objection misses that raw primary law is nearly unusable, and making it trustworthy and agent-shaped is the actual engineering. The question I'd want answered is accountability — who owns the outcome when an agent acts on a statute the corpus had wrong?
