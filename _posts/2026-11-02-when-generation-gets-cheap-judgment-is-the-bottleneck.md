---
layout: post
title: "When Generation Gets Cheap, Judgment Is the Bottleneck"
date: 2026-11-02 03:11:28 +0000
categories: [agentic-ai, industry]
source: hn
source_id: "50331998"
discussion_url: https://news.ycombinator.com/item?id=50331998
source_url: https://picon.dev/en/publications/ai-assisted-engineering/
---

The useful move in [this piece on AI-assisted development](https://picon.dev/en/publications/ai-assisted-engineering/) is refusing the framing everyone defaults to. "Did AI transform software?" is the wrong question because it collapses three separate activities — producing an implementation, exploring a design, and deciding whether a system solves the right problem. Automating the first settles none of the others. Agents take on more implementation and assist with analysis and testing; engineers stay on the hook for what to build and what evidence is enough to accept it.

That last clause is where the work actually moved. In an agentic workflow the model hands you a diff in seconds; the engineering is now in specifying what "done" means before you ask — the eval that has to pass, the invariant that can't regress, the rollback criteria. I see this in production AI work constantly: as more of the typing gets delegated, the scarce skill isn't prompting, it's writing an acceptance bar precise enough that a passing check actually means the increment is safe to keep. Durable decisions and verifiable increments, as the post puts it, don't come for free from faster generation.

The uncomfortable corollary is that this raises the floor on judgment while lowering the floor on output. A junior can now produce a plausible 400-line change; whether it belongs in the system is a harder call than it was, not an easier one. The [HN discussion](https://news.ycombinator.com/item?id=50331998) splits along exactly that line — some reading it as reassurance that engineers are safe, others pointing out that "owning the decision" is a much higher bar than owning the keyboard. If generation is no longer the constraint, where does your review process actually catch a wrong-but-compiling change today?
