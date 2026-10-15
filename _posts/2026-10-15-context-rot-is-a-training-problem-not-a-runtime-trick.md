---
layout: post
title: "Context Rot Is a Training Problem, Not a Runtime Trick"
date: 2026-10-15 14:08:22 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.14774"
discussion_url: https://huggingface.co/papers/2610.14774
source_url: https://arxiv.org/abs/2610.14774
---

The interesting result in [ProgAgent](https://arxiv.org/abs/2610.14774) isn't that programmatic tool calling beats direct tool calling — we've known that since CodeAct and the various "code mode" runtimes. It's that training a model to call tools programmatically carries over even when you later run it under a plain direct-calling harness. The skill turns out to live in the model, not the runtime.

Here's the failure it attacks. With Direct Tool Calling, every tool response lands back in the context window. On a short task that's fine. On a long-horizon task it's death by a thousand JSON blobs: by step twenty the context is mostly stale tool output and the agent loses the thread — the paper calls it context rot and orchestration breakdown. Programmatic Tool Calling runs tools as code and keeps intermediate results in runtime variables, so the context stays about the plan, not the payloads. I've watched production agents degrade exactly this way, and capping context or summarizing after the fact always felt like treating the symptom.

The number that stuck with me: ProgAgent-14B scores 30.7% on LOCA-bench at a 64k-token environment state, where comparable baselines score zero. Long-horizon state is precisely where real agents fall over, and "zero" is an honest description of what DTC does there. They get this from only 215 synthesized verifiable tasks plus a two-stage recipe — small enough to be reproducible, and the [HF paper page](https://huggingface.co/papers/2610.14774) has the full cross-harness table.

What I'd take from this: stop treating "write code vs. call tools" as an inference-time toggle. If the behavior generalizes across harnesses, it's a property worth training for. The open question is upstream — should we be teaching agents to treat their own context window as a scarce budget from the first token? What would your agent do differently if it knew every tool result it read cost it later?
