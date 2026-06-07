---
layout: post
title: "When the Harness Becomes the Real Engineering Work"
date: 2026-06-07 03:04:44 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48416264
hn_url: https://news.ycombinator.com/item?id=48416264
source_url: https://openai.com/index/harness-engineering/
---

The interesting shift in [OpenAI's harness engineering piece](https://openai.com/index/harness-engineering/) isn't that coding agents keep getting better — it's where the engineering effort moves once they do. When the model writes most of the code, your leverage stops being the code and starts being the harness around it: the environment, the tools you expose, the retry and fallback policy, the eval loop that tells the agent whether it's actually done.

I see this every day in production agent work. The model is rarely the bottleneck. What breaks is everything around it — a tool that returns ambiguous errors, a retry that masks a real failure, an environment where the agent can't distinguish success from a silent no-op. "Harness engineering" is just an honest name for the unglamorous 80% that decides whether an agent ships or stalls.

There's a deeper point hiding under the term. A good harness is mostly an evaluation problem wearing an infrastructure costume. If the agent can't observe the consequence of its own action — did the test pass, did the file change, did the API call do what it claimed — then no amount of raw model capability rescues the run. The teams winning with agents aren't the ones with the cleverest prompts; they're the ones who instrumented the environment so the agent gets fast, crisp, honest feedback on every step.

The [HN thread](https://news.ycombinator.com/item?id=48416264) splits along a familiar line: people who've run agents in anger nodding along, and people who still think the prompt is the product arguing about phrasing.

So here's the bet: in two years "prompt engineering" will read as quaint as "webmaster," and the job that replaces it looks a lot more like building CI pipelines than writing clever instructions. If your agent stalls today, where's the real failure — the model, or the harness it's flying blind inside?
