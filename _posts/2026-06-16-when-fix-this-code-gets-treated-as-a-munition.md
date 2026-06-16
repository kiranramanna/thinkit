---
layout: post
title: "When 'Fix This Code' Gets Treated as a Munition"
date: 2026-06-16 14:07:10 +0000
categories: [llm-ops, agentic-ai, industry]
hn_id: 48552687
hn_url: https://news.ycombinator.com/item?id=48552687
source_url: https://www.theregister.com/security/2026/06/15/feds-freaked-over-fable-5-after-simple-fix-this-code-prompt-not-jailbreak-says-researcher/5255827
---

Strip away the headlines and there's a pure LLM-evaluation problem sitting at the center of this story. Per [The Register's account](https://www.theregister.com/security/2026/06/15/feds-freaked-over-fable-5-after-simple-fix-this-code-prompt-not-jailbreak-says-researcher/5255827), researchers fed frontier models code containing known CVEs and freshly-planted vulnerabilities, asked them to review it, and — when the model declined — followed up with "fix this code." The model fixed it and then wrote test scripts to validate the patches. That sequence was characterized as a guardrail bypass.

The interesting failure here isn't the model's behavior — it's the eval framing. "Find, fix, and validate" is the exact loop a defender runs every day. It's also, viewed from a different chair, the loop an attacker would run. The capability is identical; only the intent differs, and intent is not something you can read off a single transcript. An eval that scores raw capability without modeling who's holding the keyboard will keep producing this kind of false positive, because it's measuring the wrong variable.

This is the part I keep running into in guardrail design: dual-use is the default state of anything genuinely useful for security. A model good enough to remediate your vulnerabilities is, by construction, good enough to remediate someone else's exploit. You cannot gate that with a content filter on the prompt — "fix this code" is three words with no malicious surface. You gate it, if at all, at the access and authorization layer, not the token layer.

The security researcher quoted in the piece argues pulling these capabilities away from defenders while adversaries keep advancing is the riskier move, and the [HN discussion](https://news.ycombinator.com/item?id=48552687) splits hard on it. So where does the line actually go: do we restrict the capability, or restrict who's authenticated to invoke it?
