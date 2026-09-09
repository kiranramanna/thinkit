---
layout: interest
title: "model context protocol"
blurb: "a protocol rewriting itself around what teams could not deploy"
entries:
  - date: 2026-06-19
    kind: post
    post: mcp-auth-grows-up-one-login-for-every-agent-tool
    why: >
      The first sign the protocol was being reshaped by deployment reality
      rather than by design. The Enterprise-Managed Authorization extension
      was less about OAuth plumbing than an admission that per-user consent
      had been quietly strangling MCP adoption inside companies.

  - date: 2026-07-29
    kind: post
    post: mcp-goes-stateless-and-thats-the-real-release
    why: >
      The 2026-07-28 spec, and the turn the whole story runs on. MRTR,
      header-based routing and the extensions framework all read as headline
      features, but every one of them is downstream of a single decision: the
      core stopped being a stateful bidirectional session.

  - date: 2026-08-05
    kind: post
    post: stateless-mcp-is-the-version-that-fits-production
    why: >
      The same spec change a week later, read from operations rather than
      design. A tool call becoming one HTTP request sounds like protocol
      trivia until you have tried to run a stateful MCP server behind a load
      balancer — which is where the change stops being cosmetic.

  - date: 2026-08-23
    kind: post
    post: what-the-new-mcp-roadmap-means-if-you-ship-agents
    why: >
      The roadmap confirms the stateless core as the direction, but the five
      priority areas are the more useful signal. They show where the protocol
      now believes its hard problems live, and it is no longer connection
      management.

  # routine:append-here — sources-daily inserts new entries above this line.
  # Hand-written entries are safe anywhere in this list; the routine only
  # inserts, and only for posts whose slug is not already present.
---

MCP spent 2026 being rewritten by what teams could not actually deploy. The
enterprise auth extension admitted per-user consent was blocking adoption; the
July spec dropped the stateful session; the roadmap made that the direction
rather than a one-off. Read in order, it is a protocol discovering that its
hard problems were operational rather than conceptual.
