---
layout: post
title: "Agentic AI Is Behind Schedule, and That's Not Surprising"
date: 2026-07-06 03:07:42 +0000
categories: [agentic-ai, industry]
hn_id: 48767058
hn_url: https://news.ycombinator.com/item?id=48767058
source_url: https://www.reuters.com/business/zuckerberg-says-ai-agent-development-going-slower-than-expected-2026-07-02/
---

When the executive who's been most aggressive about agents tells
[Reuters that agent development is going slower than expected](https://www.reuters.com/business/zuckerberg-says-ai-agent-development-going-slower-than-expected-2026-07-02/),
that's worth more than another demo. The gap between a single agent nailing a
scripted task and a fleet of them running unattended in production is where most
timelines quietly die. Here's what actually eats the schedule, from the side that
ships this:

- 🎯 **Reliability compounds against you.** A step at 95% success sounds fine
  until a ten-step chain lands you near 60%. Long-horizon autonomy is where the
  math turns brutal.
- 🔁 **Recovery is harder than action.** Getting an agent to call a tool is easy;
  getting it to notice it went wrong three steps ago and unwind cleanly is the
  real work.
- 📊 **Evals lag the product.** You can't ship autonomy you can't measure, and
  building the harness that catches silent failures takes longer than the agent.
- ⚠️ **Guardrails aren't free.** PII, permissions, and rollback all add latency
  and edge cases that no keynote budgets for.
- ⚡ **The last 10% is 90% of the calendar.** Handling the weird inputs is the
  entire job once the happy path works.

None of this means agents don't work. It means the demo-to-production tax is real
and mostly invisible until you're paying it. The
[HN discussion](https://news.ycombinator.com/item?id=48767058) has the usual
split between "told you so" and "still early," and both can be right.

My bet: the teams who slip quietly on eval infrastructure now are the ones who
ship reliable agents first. Who's actually measuring the ten-step failure rate?
