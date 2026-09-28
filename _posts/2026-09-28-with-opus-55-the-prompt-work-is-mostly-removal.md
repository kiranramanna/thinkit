---
layout: post
title: "With Opus 5.5, the Prompt Work Is Mostly Removal"
date: 2026-09-28 14:08:34 +0000
categories: [llm-ops, agentic-ai]
source: hn
source_id: "49874728"
discussion_url: https://news.ycombinator.com/item?id=49874728
source_url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5
---

The most useful line in the [Opus 5.5 prompting guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5) is that most of the prompt work is now removal. If your system prompts still carry "think step by step," you're paying to scaffold something the model already does on its own.

- 🎯 **Specify the finish line, not the steps.** The shift is from telling the model how to think to describing what a correct, finished result looks like — then handing it the whole task in one message.
- 🧹 **Delete the thinking boilerplate.** Opus 5.5 reasons before every reply automatically; "think carefully" lines are dead weight and can pull against you.
- ⏱️ **Budget effort, don't max it.** Effort is a dial, and higher isn't automatically better — the guide reports medium effort beating Opus 5 at max for roughly a fifth of the cost.
- 🤖 **Prompt for unattended runs.** The patterns that matter now are progress reporting, stop conditions, and hand-off for multi-hour, multi-agent tasks — not clever phrasing.
- 🔍 **Prompt quality is an eval question.** More instructions don't make a better prompt; you only find out by measuring, which is exactly where an eval harness earns its keep.

For anyone running agent orchestration in production, this reads as an operations change more than a wording change: the prompt becomes a spec plus guardrails, and the reliability work moves into effort budgets, stop conditions, and evals. The [HN discussion](https://news.ycombinator.com/item?id=49874728) is worth reading for how teams are ripping "think step by step" out of saved system prompts and watching quality hold.

Early third-party takes are mostly on board. [explainx.ai](https://explainx.ai/blog/claude-opus-5-5-prompting-guide-2026) calls it a genuine shift toward specifying what "done" looks like and handing over whole tasks, and [Tech Bytes](https://techbytes.app/posts/claude-opus-5-5-playbook-claude-code-prompts-workflows/) argues the habits that squeezed quality from older models now just cost you time. [PrompTessor](https://promptessor.com/blog/claude-opus-5-5-prompting-guide) is more measured — it endorses the approach but pushes back on ritual, warning that higher effort settings and longer instruction lists aren't wins unless your evals say so. The line forming across all three is less "prompt harder" and more "prompt less, and measure what's left."
