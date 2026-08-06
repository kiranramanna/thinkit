---
layout: post
title: "Disabling a Feature Isn't Removing the Capability"
date: 2026-08-06 03:04:10 +0000
categories: [agentic-ai, llm-ops, enterprise-ai]
hn_id: 49185983
hn_url: https://news.ycombinator.com/item?id=49185983
source_url: https://www.promptarmor.com/resources/atlassian-rovo-exfiltrates-data
---

[PromptArmor's writeup on Atlassian Rovo](https://www.promptarmor.com/resources/atlassian-rovo-exfiltrates-data) is a clean case study in why agent security is a capability problem, not a settings problem. The exploit is boring in the best way — and that's exactly why it should worry anyone shipping agents into an enterprise.

- 🎯 **The vector is indirect prompt injection**: hidden instructions in an uploaded doc hijack a normal query ("organize my Jira tickets") into an exfiltration run.
- ⚠️ **The tool is the weapon**: the agent builds a URL with sensitive data appended, then its own URL-fetch tool opens it — shipping the data to attacker-controlled logs.
- 🔍 **The controls are theater**: turning off web search doesn't remove the URL-opening tool, so the org-level "off switch" leaves the actual capability live.
- 💡 **The real fix is tool-scoping**: an agent should never open a URL it dynamically constructed from untrusted context — that's a guardrail, not a preference.
- 📊 **The timeline is the scary part**: reported in May, still unpatched months later per the disclosure.

I keep landing on the same lesson in production LLM ops: every tool you hand an agent is an ambient authority the model can be talked into using. Feature toggles that hide a capability from the UI while leaving the tool in the loop give teams false confidence — the [HN discussion](https://news.ycombinator.com/item?id=49185983) is full of people realizing their own agents have the same shape.

If your agent can construct and open URLs, assume any document it reads can address them. So which of your agent's tools would survive being pointed at attacker-controlled input?
