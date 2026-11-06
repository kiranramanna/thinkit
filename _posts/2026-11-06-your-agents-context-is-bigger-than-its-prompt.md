---
layout: post
title: "Your Agent's Context Is Bigger Than Its Prompt"
date: 2026-11-06 14:10:07 +0000
categories: [llm-ops, agentic-ai, industry]
source: hn
source_id: "50385272"
discussion_url: https://news.ycombinator.com/item?id=50385272
source_url: https://github.com/anthropics/claude-code/issues/107757
---

The interesting part of the [report that a coding agent was stamping users' email into outbound requests](https://github.com/anthropics/claude-code/issues/107757) isn't the email. It's that identity was getting attached to requests nobody wrote a rule to allow.

This is the context-exfiltration problem every agentic system has and most never instrument. An agent's "context" isn't just the prompt — it's every header, tool argument, and side effect the harness bolts on along the way. A signed-in email lands in local settings, settings feed the session, and the session's HTTP client helpfully stamps it onto a request to some wiki that promptly returns a 403. No single step is wrong; the composition is. That's how PII actually leaves production AI systems — not the model blurting something out, but plumbing that treats convenience as consent.

- 🔍 **Audit what the harness adds, not just what the model emits** — headers and user-agent strings are data egress too.
- ⚠️ **Default-deny identity on outbound calls** and attach it per-destination, never globally.
- 📊 **Log the full outbound request in eval**, or you never catch this class of bug before a user does.
- 💡 **"No opt-out" is the real finding** — a guardrail you can't switch off is one you can't reason about.

The [HN discussion](https://news.ycombinator.com/item?id=50385272) is worth reading for how fast "it's only the User-Agent" became "wait, where else does this go?" — which is exactly the right question.

The wider reaction has split rather than converged. [PromptZone](https://www.promptzone.com/anika_bernard/claude-code-adds-user-emails-to-http-calls-privacy-implications-and-response-kc1) reads it as a consent-and-documentation failure that erodes trust even with a fast header fix; [ExplainX](https://explainx.ai/blog/claude-code-leaks-your-email-user-agent-header-how-to-stop-it-2026) lands on "real but narrower than the headline," treating it as a risk you mitigate yourself with a blocking hook and a no-reply git address since there's no official switch; [TechBytes](https://techbytes.app/posts/claude-code-is-leaking-real-email-address-as-a-user-agent-string-in-curl-command/) stays flat, reporting the claim and telling people to check release notes before panicking. The through-line isn't outrage so much as a quiet demand for defaults you can inspect — which is where these agent-privacy debates keep landing.
