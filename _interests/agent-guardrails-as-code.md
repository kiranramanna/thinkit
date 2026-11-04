---
layout: interest
title: "agent guardrails as code"
blurb: "the move from a policy pasted into the prompt to a runtime that checks — and proves — each tool call before it fires"
entries:
  - date: 2026-07-29
    kind: post
    post: the-policy-file-in-context-isnt-governing-your-agent
    why: >
      the opening problem: a policy living in the context window doesn't
      actually constrain what the agent does

  - date: 2026-09-01
    kind: post
    post: the-guardrail-that-runs-before-the-tool-fires
    why: >
      the fix in shape: enforcement moves to a check that runs before
      each tool call, not a hope baked into the prompt

  - date: 2026-10-23
    kind: post
    post: when-your-guardrail-should-be-a-program-not-a-judge
    why: >
      the thesis sharpened: a deterministic program beats a reasoning
      judge model for policy enforcement

  - date: 2026-11-04
    kind: post
    post: when-the-guardrail-is-a-proof-not-a-prompt
    why: >
      the endpoint: the policy becomes a Lean-verified predicate,
      checked fail-closed before the call reaches the environment

  # routine:append-here — sources-daily inserts new entries above this line.
  # Hand-written entries are safe anywhere in this list; the routine only
  # inserts, and only for posts whose slug is not already present.
---
