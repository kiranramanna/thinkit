---
layout: post
title: "Verification Is the Thing That Lets You Fan Out Agents"
date: 2026-11-17 14:06:52 +0000
categories: [agentic-ai, llm-ops]
source: hn
source_id: "50529612"
discussion_url: https://news.ycombinator.com/item?id=50529612
source_url: https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification/
---

The headline in the Claude Code team's [write-up on verification](https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification/) — which drew a long [HN discussion](https://news.ycombinator.com/item?id=50529612) — isn't that agents now write most of the code. It's that verification is the real constraint on how many agents you can run at once. If a human has to read every diff, you're capped at one or two; make the checks cheap and hard to game, and you can fan out dozens. What caught my eye, through a production-eval lens:

- 🎯 **End-to-end over unit tests** — a failing E2E run with a step trace and a screenshot is hard for an agent to fool; "timeout after 30s" teaches it nothing.
- 🔍 **Diff-triggered checklists** — each item carries a trigger readable from the diff and the incident behind it, so a change gets 3-10 relevant checks instead of a 39-item wall.
- ⚠️ **Changes can't edit their own judges** — the review rubric is read from the base branch, never the PR. Same discipline every eval harness learns: isolate the judge from what it judges, or your LLM-judge setup rots as the grader drifts toward the generator.
- 📊 **Grade the reviewer against real reverts** — recall is tracked at each stage against incidents that actually mattered, not a synthetic benchmark.
- ⚡ **Cheap checks first, humans last** — lint, build, and tests run locally, and a person is pulled in only after three failed fix attempts.
- 💡 **Misses become rules** — a pattern seen across two PRs becomes a candidate rule, and three agents try to disprove it before a human approves it.

The wider conversation has landed in roughly the same place. [The Neuron](https://theneuron.ai/explainer-articles/claude-code-creators-boris-cherny-and-cat-wu-explain-how-to-use-agent-loops/)'s coverage frames real verification as running and testing the app, not just green unit checks; [Zartis](https://www.zartis.com/verification-is-not-the-tax-on-ai-autonomy-it-is-the-price-of-admission/) pushes further, arguing an agent's autonomy should extend only as far as its verification can prove; and [Aident](https://aident.ai/blog/verify-ai-coding-agent-tests-pass) adds the practitioner's caveat — treat an agent's "tests pass" as a claim, not evidence. The enthusiasm across all of them is for the verification scaffolding, not the code generation — which tells you where the hard engineering is actually moving.
