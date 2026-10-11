---
layout: post
title: "Catching PII in the Browser, Before the Model Sees It"
date: 2026-10-11 03:07:36 +0000
categories: [llm-ops, enterprise-ai, ai-infrastructure]
source: hn
source_id: "50024242"
discussion_url: https://news.ycombinator.com/item?id=50024242
source_url: https://ndstudio.gov/posts/say-hello-to-rampart
---

The interesting thing about [Rampart](https://ndstudio.gov/posts/say-hello-to-rampart) isn't the model — it's where the model runs. It redacts PII on-device, in the browser, in the gap between you typing and the request leaving for a hosted LLM. A 14.7 MB MiniLM reads names and street addresses in context; deterministic regex-plus-validation catches the structured identifiers — SSNs, cards, routing numbers, government IDs. Placeholders go out, the real values stay on the device, and a `reveal()` call stitches the names back into the model's reply locally.

Most enterprise LLM stacks solve the PII problem server-side, with a redaction service sitting in the request path. The quiet cost of that design is that the raw PII already crossed your network boundary to reach the redactor. Pushing detection to the client inverts it: the sensitive span never leaves the device at all. That's a meaningfully different threat model, and it's why this is worth a look even if the numbers need scrutiny. The [HN discussion](https://news.ycombinator.com/item?id=50024242) gets into the WebGPU details.

- ✅ **Client-side detection** means raw PII never touches your logs, your proxy, or your vendor's servers
- ⚠️ **98.42% recall** still leaks roughly 1 span in 64 — a defense-in-depth layer, not a sole control
- 🔍 **Split the work**: the context model earns its keep on names and addresses, regex owns the checksummable IDs
- ⚡ **~3.9 ms median** on WebGPU is cheap enough to run on every send
- 📊 **Non-Latin scripts are the gap** — recall collapses on Chinese and Korean, so this is English-first today
- 🎯 **Self-reported on one dataset** — validate against your own PII distribution before trusting that recall figure

Early coverage lands cautiously, and it splits along a familiar line. [AI Weekly](https://aiweekly.co/alerts/national-design-studio-releases-rampart-on-device-pii-guard) frames it as a promising building block while making the same point about the ~1-in-64 leak rate and weak non-Latin coverage: useful, not sufficient. [RuntimeWire](https://runtimewire.com/article/americagov-browser-filter-keeps-names-government-ids) is sharper, dissecting a government deployment built on Rampart that exempted names, URLs, and generic government IDs from redaction — quietly walking back the tool's own default-deny posture. The engine looks sound; the deployments are where it goes sideways. That's the lesson every guardrail eventually teaches, and on-device redaction doesn't get an exemption.
