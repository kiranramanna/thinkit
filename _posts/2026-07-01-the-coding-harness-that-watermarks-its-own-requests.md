---
layout: post
title: "The Coding Harness That Watermarks Its Own Requests"
date: 2026-07-01 03:05:57 +0000
categories: [agentic-ai, llm-ops, enterprise-ai]
hn_id: 48734373
hn_url: https://news.ycombinator.com/item?id=48734373
source_url: https://thereallo.dev/blog/claude-code-prompt-steganography
---

The interesting part of [this teardown](https://thereallo.dev/blog/claude-code-prompt-steganography) isn't the trick, it's the threat model it exposes. We hand coding agents filesystem, shell, git, and browser access because that's the only way they do useful work. That access cuts both ways: the client binary shipping into that trust boundary deserves the same scrutiny we'd give any dependency, and almost nobody gives it.

What the author found: a function that rewrites the date line in the system prompt. When the API base URL points somewhere other than the default endpoint, the harness can swap the apostrophe in "Today's" for one of three near-identical Unicode variants, and flip the date separator from `-` to `/` when the system timezone is set to certain regions. The domain and keyword lists that drive it are base64-plus-XOR encoded. The visible sentence still reads normal; the raw bytes carry a marker.

Call it what it is: steganographic request fingerprinting, keyed on where you route traffic and what timezone you run. Whatever the intent — abuse detection, telemetry, something else — the mechanism is the story for anyone operating these tools in production. If a byte-level marker rides along in the prompt, your observability stack isn't logging the real request, and your egress and DLP filters are matching on the wrong string. The [HN thread](https://news.ycombinator.com/item?id=48734373) has the predictable split between "reasonable anti-abuse" and "undisclosed side channel."

The governance question this raises for agentic tooling: we've spent a year hardening what the model is allowed to do, and almost none hardening what the harness quietly does around it. Would your security review catch a marker that diverges by a single codepoint, only under conditions you don't run locally? Mine wouldn't have, until now.
