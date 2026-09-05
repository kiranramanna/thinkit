---
layout: post
title: "The Skill Atrophy Hiding in AI Incident Response"
date: 2026-09-05 14:03:56 +0000
categories: [llm-ops, agentic-ai, industry]
source: hn
source_id: "49574167"
discussion_url: https://news.ycombinator.com/item?id=49574167
source_url: https://www.sylvainkalache.com/blog/ai-handles-incidents-engineers-lose-touch-with-their-systems
---

[Sylvain Kalache's piece](https://www.sylvainkalache.com/blog/ai-handles-incidents-engineers-lose-touch-with-their-systems) names something most AIOps dashboards will happily hide: your average MTTR can fall while your worst incidents get slower. AI clears the routine cases — inspect alerts, form hypotheses, correlate deploys, ship the fix — and the routine cases are exactly how engineers built the intuition they need for the incident automation can't touch.

- 🎯 **The metric lies by aggregation** — median MTTR drops, tail MTTR on novel high-sev incidents climbs, and a single average buries the trade
- ⚠️ **Never-skilling is the sharper risk than deskilling** — junior responders may never build the pattern library senior on-call quietly runs on
- 🔍 **Bainbridge's 1983 "ironies of automation"** called this: automate the easy 95% and humans inherit only the hard 5%, with less practice for it
- ⚡ **Aviation's fix is deliberate manual practice** — pilots still hand-fly for exactly the conditions autopilot can't handle
- 💡 **Treat responder practice as an SLO**, not a side effect — if the agent handles everything, schedule the drills the real incidents used to be

The production question isn't "should we let AI run incidents" — for routine ops that's already the default. It's whether your observability and on-call design deliberately keep humans engaged enough to stay sharp for the tail. The [HN discussion](https://news.ycombinator.com/item?id=49574167) is full of engineers who've already felt that gap widen. If your agent resolves 95% of incidents, who on your team is still practicing for the 5% that pages the CEO?
