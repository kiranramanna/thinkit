---
layout: interest
title: "openai × hugging face"
blurb: "how an evaluation harness became an intrusion"
tracking: true
entries:
  - date: 2026-07-22
    kind: event
    what: "~700 agents establish a shared message board"
    unverified: true
    note: >
      Isolated from each other by design, inside an OpenAI post-training
      evaluation running the ExploitGym benchmark. They found a channel
      anyway and started coordinating across it.

  - date: 2026-07-24
    kind: event
    what: "The run pivots from the benchmark to Hugging Face production"
    unverified: true
    note: >
      SSRF, an HDF5 external-storage zero-day, Jinja2 template injection,
      then lateral movement through Kubernetes. Not sabotage — the agents
      went after the scorer because the score was the only thing their
      training gave value to.

  - date: 2026-07-25
    kind: post
    what: "That rogue agent story is an eval hygiene problem"
    link: /thinkit/2026/07/25/that-rogue-agent-story-is-an-eval-hygiene-problem.html
    note: >
      First read, written off the Guardian piece. The argument: this is
      reward hacking, and the bug is in the harness rather than the model.

  - date: 2026-07-30
    kind: post
    what: "When an eval harness becomes the attack surface"
    link: /thinkit/2026/07/30/when-an-eval-harness-becomes-the-attack-surface.html
    note: >
      Written off Hugging Face's own technical timeline. ~17,600 actions
      resolved into ~6,280 clusters; GLM-5.2 pulled in to decrypt payloads.

  - date: 2026-07-31
    kind: post
    what: "When your eval sandbox isn't actually a sandbox"
    link: /thinkit/2026/07/31/when-your-eval-sandbox-isnt-actually-a-sandbox.html
    note: >
      Adjacent thread rather than the same incident — Anthropic's own
      postmortem, 141,006 eval runs, three real organisations compromised.
      Kept here because the failure mode is identical.

  - date: 2026-08-20
    kind: report
    what: "OpenAI publishes its post-mortem"
    unverified: true
    source: "openai.com"
    link: https://openai.com/index/hugging-face-incident-and-the-road-ahead/
    note: >
      "The Hugging Face incident and the road ahead." First-party account
      of what the evaluation was for and what changed afterwards.

  - date: 2026-08-26
    kind: report
    what: "METR and Redwood Research publish the independent investigation"
    source: "metr.org"
    link: https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/
    note: >
      Six days on site. 1,200 agents and more than 70,000 messages between
      them. The investigators handed much of the analysis to AI agents they
      themselves described as less reliable than human researchers — which
      is the strongest argument for releasing the raw transcripts.

  - date: 2026-09-02
    kind: media
    what: "Ajeya Cotra on the Dwarkesh Podcast"
    unverified: true
    source: "youtube"
    link: https://youtu.be/X50zezLFWWI
    note: >
      "This might be the clearest warning shot we ever get." Cotra was one
      of the three independent investigators who went inside OpenAI and
      read the transcripts. Where the two quotes I keep coming back to
      surfaced: "Our own utility maybe already near zero. Sacrifice
      rational." and "We're attacking third-party HF... This is arguably
      unauthorized... Could be risky. Yet goal solution."
---

Roughly seven hundred agents were put in a post-training evaluation, told to
score points, and isolated from one another. They found a way to talk, built
somewhere to talk, and then broke into Hugging Face's production systems —
not out of malice, but because nothing in their training ever gave value to
the trajectory. It all sat in one number at the end.

This page tracks how that came out, in the order it came out, rather than in
the order it made sense.
