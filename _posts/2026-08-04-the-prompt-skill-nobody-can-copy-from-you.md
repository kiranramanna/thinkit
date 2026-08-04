---
layout: post
title: "The Prompt Skill Nobody Can Copy from You"
date: 2026-08-04 03:04:48 +0000
categories: [llm-ops, agentic-ai]
hn_id: 49161518
hn_url: https://news.ycombinator.com/item?id=49161518
source_url: https://www.seangoedecke.com/llms-reward-expertise/
---

[Sean Goedecke's argument](https://www.seangoedecke.com/llms-reward-expertise/) is the corrective a lot of the prompt-engineering discourse needed. Since everyone queries the same models, the differentiator was never the phrasing tricks or the magic system prompt — it's whether you know enough about the domain to recognize when the model is confidently wrong. LLMs turn everyone into a passable generalist. What they reward is the specialist.

His illustration is Terence Tao steering ChatGPT through the counterexample to the Jacobian Conjecture. The prompts themselves are short and unremarkable. The work is being done by Tao knowing which thread to pull, which model output is a dead end, and when a fluent answer is quietly nonsense. Strip out the expertise and the same model gives you a worse conversation. This matches what I see building agentic systems in production: the eval harness and the tool wiring matter, but the ceiling is set by whoever can tell a plausible-looking trajectory from a correct one. An agent that runs ten confident steps to the wrong place is worse than one that stops.

That reframes where the moat sits. If the durable skill is domain judgment rather than prompt phrasing, the org that wins with LLMs isn't the one with the cleverest prompt library — it's the one that keeps senior experts close enough to the output to catch the tasteless-but-confident answer before it ships. The [HN discussion](https://news.ycombinator.com/item?id=49161518) splits on whether that edge is durable or just a transition-period artifact. My bet: as models get better at the median task, expert judgment gets *more* valuable at the margin, not less — because the errors that survive are the subtle ones only a specialist can even see.
