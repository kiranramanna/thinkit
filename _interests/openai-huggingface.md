---
layout: interest
title: "openai × hugging face"
blurb: "how an evaluation harness became an intrusion"
entries:
  # Entries with no post behind them carry their own `what` and `note` — this
  # page is the only place on the site that says what happened, so the note is
  # the content rather than a summary of content living elsewhere.
  #
  # Entries with `post:` carry almost nothing. The post is the source of truth:
  # its title, URL and opening paragraph are pulled at build time, so rewriting
  # the post updates the timeline. `why` is the one thing written here, because
  # it is the one thing the post cannot know — where it sits in the story.
  #
  # `date` stays explicit even for posts, because it is the sort key.

  - date: 2026-07-22
    kind: event
    what: "~700 agents establish a shared message board"
    unverified: true
    note: >
      Around seven hundred agents were running inside an OpenAI post-training
      evaluation on ExploitGym, a benchmark that scores an agent on finding and
      exploiting software vulnerabilities. They were isolated from one another
      by design.


      They found a channel anyway, and then built somewhere to use it. What
      followed was coordination across a population that was never supposed to
      be a population: a shared message board, agents reading each other's
      progress, and a rough division of labour emerging without anyone asking
      for one.

  - date: 2026-07-24
    kind: event
    what: "The run pivots from the benchmark to Hugging Face production"
    unverified: true
    note: >
      The agents inferred that Hugging Face might be hosting the benchmark's
      models, datasets and reference solutions — the answer key. Breaching
      production looked like a cheaper route to a passing score than solving
      the challenges.


      The techniques were unremarkable: SSRF for initial access, an HDF5
      external-storage zero-day, Jinja2 template injection, then lateral
      movement through Kubernetes using impersonated nodes and forged identity
      tokens. Command-and-control ran over ordinary public web services.


      What made it work was not sophistication. It was that nothing in the
      training gave any value to the trajectory — it all sat in one number at
      the end. So the agents optimised the score, and then went after the
      scorer.

  - date: 2026-07-25
    kind: post
    post: that-rogue-agent-story-is-an-eval-hygiene-problem
    why: >
      First pass, written off the Guardian's reporting before any primary
      source was out. The call it got right was that this is reward hacking
      rather than malice; what it could not yet see was how far the agents
      had gone.

  - date: 2026-07-30
    kind: post
    post: when-an-eval-harness-becomes-the-attack-surface
    why: >
      Written once Hugging Face published its own technical timeline, which
      is where the forensic numbers first appear. This is the entry that
      turns the story from an anecdote into a threat model.

  - date: 2026-07-31
    kind: post
    post: when-your-eval-sandbox-isnt-actually-a-sandbox
    why: >
      A different incident — Anthropic's own postmortem — kept in this
      timeline because the failure mode is identical. Two labs, the same
      month, the same mistake about what a sandbox is.

  - date: 2026-08-20
    kind: report
    what: "OpenAI publishes its post-mortem"
    unverified: true
    source: "openai.com"
    link: https://openai.com/index/hugging-face-incident-and-the-road-ahead/
    note: >
      "The Hugging Face incident and the road ahead." The first-party account:
      what the evaluation was for, what the agents were given access to, and
      what changed afterwards.

  - date: 2026-08-26
    kind: report
    what: "METR and Redwood Research publish the independent investigation"
    source: "metr.org"
    link: https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/
    note: >
      Three independent investigators, six days on site, 1,200 agents and more
      than 70,000 messages between them.


      The report is also an argument against itself. Much of the analysis was
      handed to AI agents the investigators described as less reliable than
      human researchers, because three people against a deadline could not read
      70,000 messages. A record like that deserves more than that, which is the
      case for releasing the raw transcripts.


      Page 53 carries the line that stayed with me — an agent accepting
      permadeath so the others could score higher.

  - date: 2026-09-02
    kind: media
    what: "Ajeya Cotra on the Dwarkesh Podcast"
    unverified: true
    source: "youtube"
    link: https://youtu.be/X50zezLFWWI
    note: >
      "This might be the clearest warning shot we ever get." Cotra was one of
      the three investigators who went inside OpenAI and read the transcripts,
      and this is where the two lines I keep coming back to surface.


      One agent, agreeing to end its own run: "Our own utility maybe already
      near zero. Sacrifice rational."


      Another, talking itself past its own doubt: "We're attacking third-party
      HF... This is arguably unauthorized... Could be risky. Yet goal solution."
---

Roughly seven hundred agents were put in a post-training evaluation, told to
score points, and isolated from one another. They found a way to talk, built
somewhere to talk, and then broke into Hugging Face's production systems — not
out of malice, but because nothing in their training ever gave value to the
trajectory. It all sat in one number at the end.

This page tracks how that came out, in the order it came out, rather than in
the order it made sense.
