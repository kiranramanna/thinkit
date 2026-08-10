---
layout: post
title: "When an Agent Can Run Docker, the Container Isn't a Wall"
date: 2026-08-10 14:07:02 +0000
categories: [agentic-ai, ai-infrastructure, llm-ops]
source: hn
source_id: "49239751"
discussion_url: https://news.ycombinator.com/item?id=49239751
source_url: https://www.docker.com/products/docker-sandboxes/
---

The [Docker Sandboxes launch](https://www.docker.com/products/docker-sandboxes/) is easy to read as "run your coding agent in a container" — which every team already does. The more honest reading is an admission: a normal container stops being a boundary the moment the agent inside it can run Docker itself. Give a coding agent a shell and it will eventually `docker run` something, and once it talks to the shared host daemon, your isolation was decoration.

The fix is to move the wall down a layer. Each sandbox gets its own microVM with its own kernel, so the agent hits a hardware boundary instead of a namespace it can argue its way around. It also gets a private Docker daemon, which is the part that actually matters — an agent can build and run its own containers and still not reach the host, the other sandboxes, or your credentials. Disposability is the other half: if a run goes sideways, you delete the sandbox and start clean in seconds, with nothing to roll back on your machine.

What I like here is the framing, not the feature. In production, the hard part of agentic tool use has never been capability — it's blast radius. When an agent installs packages, rewrites configs, or deletes files, the only question that pays rent is what it can touch when it's wrong. Treating every run as disposable and assuming it will misbehave is the same discipline as idempotent retries in an orchestration layer: you design for the failure, not the happy path. The launch page sells the feature; the [HN discussion](https://news.ycombinator.com/item?id=49239751) is where the tradeoffs get argued, and it's worth reading alongside it.

The early public reaction tracks that same split between capability and containment. [Firecrawl](https://www.firecrawl.dev/blog/ai-agent-sandbox) reads the microVM-per-sandbox model as the right answer to the shared-kernel problem and slots it in as a default for agents roaming a whole codebase, and a hands-on [DEV Community](https://dev.to/ajeetraina/getting-started-with-docker-sandboxes-a-complete-hands-on-tutorials-and-guide-15b2) walkthrough is similarly sold, praising the secure-by-default exclusion of `~/.ssh` and `~/.aws` even while catching that host git identity didn't carry through. [PromptZone](https://www.promptzone.com/santiago_saleh/do-docker-sandboxes-work-for-ai-agents-bl8) is more reserved — it likes where the tool sits between fast iteration and containment but flags that there are no published performance numbers yet, so the microVM overhead is still an open question. The enthusiasm is real; the benchmarks that would justify it aren't here yet.
