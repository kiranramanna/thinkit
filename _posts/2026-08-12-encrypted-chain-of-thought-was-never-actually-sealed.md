---
layout: post
title: "Encrypted Chain-of-Thought Was Never Actually Sealed"
date: 2026-08-12 03:09:39 +0000
categories: [llm-ops, enterprise-ai, industry]
source: hn
source_id: "49257876"
discussion_url: https://news.ycombinator.com/item?id=49257876
source_url: https://stolen-thoughts.com/
---

The clever move in [this disclosure](https://stolen-thoughts.com/) isn't breaking crypto — it's realizing you never have to. Providers hide chain-of-thought by handing the client an encrypted blob and asking for it back on the next turn. Those blobs turn out to be interchangeable across sessions, users, and models in the same ecosystem, so an attacker injects a frontier model's encrypted trace into a weaker, less-guarded sibling, jailbreaks *that* one, and reads the reasoning back in plaintext — never touching the strong model. The [HN discussion](https://news.ycombinator.com/item?id=49257876) caught the implication fast: if the ciphertext is portable, it's not a seal, it's a bearer token.

- 🔍 **The trust boundary was drawn in the wrong place** — providers treated "encrypted" as "isolated," but the client always held enough to replay the blob somewhere else.
- ⚠️ **It's a data-exfiltration problem, not just an IP one** — decoding traces scraped from public repos surfaced real PII and live credentials sitting inside fields everyone assumed were noise.
- 🎯 **Indirect prompt injection gets an invisible channel** — malicious instructions can ride inside an encrypted reasoning block that never appears in the visible transcript.
- 📊 **The blast radius is anyone who logs** — every team publishing agent session logs or running a public-facing agent was shipping decodable secrets without knowing it.
- ⚡ **This is LLM-ops hygiene, extended** — the same discipline that makes us scrub prompts and outputs for PII now has to cover opaque reasoning fields we were happy to ignore.

Public reaction has settled on the operational side rather than the cryptography. The [AI Governance Institute](https://aigovernance.com/news/frontier-api-reasoning-traces-leaked-62-live-api-keys-in-public-agent-logs) counted 62 API keys, 33 passwords, and 24 access tokens recovered from public agent logs and frames it as a secrets-management gap existing controls simply can't see. [explainX](https://explainx.ai/blog/stealing-reasoning-traces-encrypted-cot-vulnerability-august-2026) presses the same "encrypted does not mean isolated" point and tells teams to rotate now, not later. [AI Weekly](https://aiweekly.co/alerts/encrypted-reasoning-cracked-across-anthropic-openai-google) is sharper still, noting vendors first waved the reports off and questioning whether a durable architectural fix has actually shipped. Nobody in that coverage argues it wasn't serious; the live disagreement is whether the response is a real boundary change or a patch that just stops today's proof-of-concept from reproducing.
