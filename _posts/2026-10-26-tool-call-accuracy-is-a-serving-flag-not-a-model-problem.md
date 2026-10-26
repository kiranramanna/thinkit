---
layout: post
title: "Tool-Call Accuracy Is a Serving Flag, Not a Model Problem"
date: 2026-10-26 14:19:41 +0000
categories: [agentic-ai, llm-ops, ai-infrastructure]
source: hn
source_id: "50242870"
discussion_url: https://news.ycombinator.com/item?id=50242870
source_url: https://www.ubicloud.com/blog/fixing-tool-call-accuracy-in-vllm
---

The useful part of [Ubicloud's writeup on tool-call accuracy in vLLM](https://www.ubicloud.com/blog/fixing-tool-call-accuracy-in-vllm) is that the fix had nothing to do with the model. Their Kimi and DeepSeek deployments were emitting `search_web` instead of `web_search`, or `city_name` instead of `location` — the near-miss schema errors that quietly pollute an agent's context window and cost you a retry every twenty-odd calls. At a 92% schema match, that's two failures in twenty-five.

The reflex is to blame the model, or to bolt a validate-and-repair layer onto your own client. Both are wrong here. Accuracy had slipped because an upstream default changed: vLLM stopped enabling constrained decoding for requests that didn't explicitly ask for it. The decoder was correct the whole time — the deployment just wasn't using it anymore.

Turning it back on explicitly took schema accuracy from 92% to 100% on their 2,000-request benchmark, with negligible overhead. Underneath, that's XGrammar structural tags masking any token that would break the current phase of the tool-call grammar: the model still picks tokens, but only from the valid set. Schema conformance stops being best-effort and becomes a runtime guarantee.

What I like is the framing. In production agent systems, "tool calling works" is not a model property you get to assume — it's a serving configuration you have to own. The post is also honest about why the default flipped: constrained decoding can push weaker models off their natural output, and grammar and speculative-decoding interactions carry real bugs, so the guarantee isn't free across every model. The [HN discussion](https://news.ycombinator.com/item?id=50242870) pushes on the obvious limit — a call can be perfectly well-formed and still invoke the wrong tool, and no grammar fixes that.

If your agent eval harness only scores end-task success, an 8% schema-error rate never shows up as a schema problem — it shows up as latency and cost, months later. How many teams are eating that silently because they trusted the model and never checked one decoder flag?
