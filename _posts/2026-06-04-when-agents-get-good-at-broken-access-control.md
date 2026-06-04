---
layout: post
title: "When Agents Get Good at Broken Access Control"
date: 2026-06-04 15:17:13 +0000
categories: [agentic-ai, llm-ops, industry]
hn_id: 48392343
hn_url: https://news.ycombinator.com/item?id=48392343
source_url: https://kasra.blog/blog/i-spent-1500-seeing-if-llms-could-hack-my-app/
---

The headline of Kasra Rahjerdi's [$1,500 experiment](https://kasra.blog/blog/i-spent-1500-seeing-if-llms-could-hack-my-app/) is "can LLMs hack my app," but the part worth your attention is which bug class he picked. Not a buffer overflow, not some exotic deserialization gadget — a hardened API sitting in front of a wide-open Firebase, where the real exploit is signing up directly against the data layer and reading another user's records. Broken access control. Missing object-level authorization. The most boring, most common, least-patched vulnerability in modern apps.

That's the signal. Agentic harnesses are crossing the threshold where they reliably chain the unglamorous, multi-step reasoning a BOLA exploit needs: notice the embedded `google-services.json`, realize the backend trusts the client, pivot to the Firestore read. This isn't memorized CTF trivia — it's the context-stitching that used to require a human pentester who had already seen the pattern.

I read this less as a security story and more as an agentic-capability eval with a real-world target. The methodology is loose — he admits it's "for fun," and a goal-pinning harness that forces retries does a lot of the work. But it maps cleanly onto how I think about agent evals: the score isn't whether the model knows the vulnerability exists, it's whether the orchestration loop survives long enough to act on it. The [HN discussion](https://news.ycombinator.com/item?id=48392343) splits predictably between "this is just a misconfigured Firebase" and "yes, and now it auto-exploits at $1,500 a run."

Both camps are right, which is the uncomfortable part. The takeaway isn't "AI will hack everything." It's that the floor on exploiting authorization bugs just dropped to an API bill. If your threat model assumed BOLA-class issues were safe because nobody would bother chaining them by hand — what changes when nobody has to?
