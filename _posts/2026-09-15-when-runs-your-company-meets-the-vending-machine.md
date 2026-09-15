---
layout: post
title: "When 'Runs Your Company' Meets the Vending Machine"
date: 2026-09-15 14:11:24 +0000
categories: [agentic-ai, enterprise-ai, industry]
source: hn
source_id: "49700477"
discussion_url: https://news.ycombinator.com/item?id=49700477
source_url: https://andonlabs.com/blog/why-we-built-pion
---

[Andon Labs' pitch for Pion](https://andonlabs.com/blog/why-we-built-pion) is that you hand an agent a high-level direction and it runs the business — email, phone, banking, a browser, and a secure compute environment, with an overseer agent called Andonos keeping the workers on track. Strip the framing and this is an agentic orchestration product: persistent agents, real tools, a supervisor in the loop. The pieces I ship in production are all here.

What makes it worth reading rather than eye-rolling is that Andon Labs shows its work. The lineage runs from Vending-Bench (a simulated vending business) to Andon Market and Andon Café — actual storefronts that, by their own account, struggled, lost money, and still aren't profitable. That candor is the tell. "Runs any company autonomously" sounds like a capability claim, but the storefronts expose it as a *reliability* claim, and reliability is the axis that hasn't kept pace. An agent that can make a firing decision yet can't keep a shelf coherent isn't blocked on intelligence; it's blocked on the unglamorous loop of doing the same operational thing correctly a thousand times.

That's the gap I'd watch before letting anything like this near enterprise work. The demo of autonomy is the phone call and the wire transfer; the product is the boring 99.9% that has to not drift. The [HN thread](https://news.ycombinator.com/item?id=49700477) circles the same point — real curiosity about the failure modes, real doubt that today's models hold up under unstructured operations.

The wider reaction splits along exactly that seam. [byteiota](https://byteiota.com/pion-andon-labs-ai-agents-run-business/) takes it as a genuine capability worth studying, framing the launch as a safety-research opportunity while noting candidly that reliability lags capability and the token costs don't yet pencil out against human labor. [Slashdot](https://slashdot.org/story/26/09/13/0523208/a-visit-to-san-franciscos-ai-run-store-no-customers-nothing-useful-and-losing-money-fast)'s visit to the physical store is blunter: no customers, nothing worth buying, capital draining, a purchase flow more laborious than talking to a clerk. The consensus forming isn't "this can't work" — it's that the autonomy is real and the economics aren't, and those two are going to keep diverging until reliability catches up to the marketing.
