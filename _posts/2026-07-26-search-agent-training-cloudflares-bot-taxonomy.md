---
layout: post
title: "Search, Agent, Training: Cloudflare's New Bot Taxonomy"
date: 2026-07-26 14:06:24 +0000
categories: [ai-infrastructure, agentic-ai, industry]
hn_id: 49052564
hn_url: https://news.ycombinator.com/item?id=49052564
source_url: https://blog.cloudflare.com/content-independence-day-ai-options/
---

The useful idea in [Cloudflare's announcement](https://blog.cloudflare.com/content-independence-day-ai-options/)
isn't the default block on AI bots — it's that they stopped treating "AI
traffic" as one thing. Site owners now get three categories with different
economics: search crawlers that trade indexing for referral traffic, training
crawlers that permanently absorb your content into weights, and *agent* bots —
real-time systems like a ChatGPT session or a browser-use agent fetching a page
with a human waiting on the result. That last category is the one most robots.txt
setups get wrong, because an agent hitting your page on behalf of a user isn't a
scraper and isn't a browser either.

Once you accept that split, the access-control problem changes shape. Blocking
training while allowing agents means your policy has to survive multi-purpose
crawlers — Cloudflare notes a bot like Googlebot follows the most restrictive
matching rule, so a training block can take the whole crawler down with it. Their
answer is a `content-use` signal extending robots.txt with `immediate`,
`reference`, and `full` values, plus a `Forwarded` header for "transitive trust"
so you can authorize a specific operator even when it reaches you through
intermediaries. That's the interesting engineering bet: intent-based access
control for automated clients, not IP allowlists.

I care about this from the other side of the pipe. If you're building agentic
systems that fetch live web content, this is the year "just GET the URL" stops
being reliable — your retrieval layer needs to declare who it is and what it'll
do with the bytes, or it gets classified as a training crawler and blocked by
default on monetized pages come September. The [HN discussion](https://news.ycombinator.com/item?id=49052564)
is already arguing about whether agents will honestly self-report.

Signed, declared intent is a nice standard right up until the first agent lies
about its category — so what actually enforces it?
