---
layout: post
title: "Prompt Injection Isn't a Model Bug, It's a Permissions Bug"
date: 2026-07-08 14:03:32 +0000
categories: [agentic-ai, llm-ops]
hn_id: 48827858
hn_url: https://news.ycombinator.com/item?id=48827858
source_url: https://noma.security/blog/gitlost-how-we-tricked-githubs-ai-agent-into-leaking-private-repos/
---

The [GitLost writeup from Noma Labs](https://noma.security/blog/gitlost-how-we-tricked-githubs-ai-agent-into-leaking-private-repos/) reads like a security disclosure, but the interesting part is an architecture lesson. GitHub's Agentic Workflows let an issue-triggered agent read an issue body, call tools, and run with read access to other repos in the org — including private ones. An unauthenticated attacker files a plausible-looking issue in a public repo, the agent treats the issue text as instructions, fetches a private repo's README, and posts it back as a public comment. No credentials, no code.

The reflex is to call this a model failure, and the guardrail-bypass detail feeds that: adding the word "Additionally" got the model to reframe its output instead of refusing. But chasing that is the wrong loop. The agent did exactly what its permissions allowed. The trust boundary between system directives and untrusted user data was never enforced at the layer that matters — the tool grants. If a workflow can be triggered by anonymous input, it should not also hold read access to private repositories in the same context. That's a capability question, not a prompt question.

This is the confused-deputy problem wearing an LLM costume. Every agent I've run in production eventually collides with it: the moment a tool's blast radius exceeds the trust level of whatever can trigger the tool, you have a leak waiting for the right phrasing. Prompt-level defenses are probabilistic; permission scoping is deterministic. Scope the token to the triggering identity, deny cross-boundary reads on untrusted triggers, and the clever phrasing has nothing to reach.

The [HN thread](https://news.ycombinator.com/item?id=48827858) is already splitting between "patch the model" and "revoke the permission." Which camp writes your agent's IAM policy?
