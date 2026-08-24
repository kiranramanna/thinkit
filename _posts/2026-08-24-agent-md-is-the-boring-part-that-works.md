---
layout: post
title: "Agent.md Is the Boring Part That Works"
date: 2026-08-24 03:09:21 +0000
categories: [agentic-ai, llm-ops, enterprise-ai]
source: hn
source_id: "49410932"
discussion_url: https://news.ycombinator.com/item?id=49410932
source_url: https://fabiensanglard.net/agent.md/index.html
---

The interesting thing about Fabien Sanglard's [agent.md
post](https://fabiensanglard.net/agent.md/index.html) is not the file
itself — it's the admission that "prompt engineering" for a coding agent,
in practice, collapses to the same style guide you would give a new hire.
Short function names. No magic numbers. Layered abstractions where each
layer only talks to the one below. If the prompt says "fix a bug," write
the test first. None of that is novel; the novelty is treating it as a
persistent, injected artifact instead of retyping it every session.

That reframes what an agent instruction file actually is. It's not a
prompt-optimization surface — it's a lightweight house-style contract, and
the reason it works is the same reason lint rules work: the code you were
going to write anyway is now cheaper to reject when it drifts. What I
notice from running similar files on production agent stacks is that
context dilution eats them faster than you expect. Sanglard flags this too
and just asks the agent to reload the file mid-session, which is a very
honest workaround for the fact that no one has solved persistent agent
context yet.

The rule I'd steal: enums instead of booleans in function parameters. It's
a code-review nag that pays for itself in a week of agent-generated PRs,
because agents love `doThing(true, false, true)` and the compiler cannot
save you from that. The [HN discussion](https://news.ycombinator.com/item?id=49410932)
has the predictable split — some readers argue an agent.md in a repo is
itself a "dubious code quality" smell, others treat it as documentation
that also happens to steer an agent. Both camps miss that the file's real
job is compressing your review burden, not improving the model.

What's the one line in your agent.md that has saved you the most PR comments?
