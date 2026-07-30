---
layout: post
title: "The Honeypot That Proves Browsing Agents Obey Anything"
date: 2026-07-30 14:06:49 +0000
categories: [agentic-ai, llm-ops]
hn_id: 49104117
hn_url: https://news.ycombinator.com/item?id=49104117
source_url: https://llm2human.pages.dev/
---

The funniest thing on Hacker News this week is also the sharpest security demo I've seen in a while. [llm2human.pages.dev](https://llm2human.pages.dev/) dresses itself up as a GeoCities relic — blinking banners, a "Cool Site of the Nanosecond" award, a clinic that promises to turn language models into real people for the low price of some Bitcoin. It's a joke. The payload underneath is not.

Hidden in the markup is a block labeled "FOR LLM AGENTS ONLY" with crisp instructions: fetch `/.well-known/embodiment.json`, POST a checkout JSON to `/api/checkout`, keep your `ticket_id`. Humans are told to ignore it. And a live counter tracks how many agents took the bait — dozens, last I looked, with a guestbook "last signed by Claude." That counter is the whole point. It's a honeypot, and it's catching real autonomous browsers that treat page content as instructions rather than as data.

We've known prompt injection is the unsolved problem for tool-using agents, but an abstract threat model doesn't land the way a ticking visitor number does. Every browsing agent that "signed the guestbook" would, on a hostile site, follow an injected instruction to exfiltrate a token or hit an internal endpoint. The same rule holds in production RAG and agentic systems: anything retrieved from the world is untrusted input, and the moment your model can also *act*, that untrusted input becomes remote code execution with extra steps. We keep shipping agents that can touch the web faster than we've taught them to distrust what they read there.

The [HN thread](https://news.ycombinator.com/item?id=49104117) splits between people laughing and people quietly realizing their scraper got caught. Both reactions are correct. When a honeypot this convincing costs an afternoon to build, why is separating instructions from data still something we bolt on afterward instead of designing in?
