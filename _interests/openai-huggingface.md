---
layout: interest
title: "openai × hugging face"
blurb: "how an evaluation harness became an intrusion"
entries:
  # Dates verified against the METR/Redwood report (metr.org, 2026-08-26) and
  # the Wikipedia timeline of the incident. Entries with no post behind them
  # carry their own `what` and `note` — this page is the only place on the
  # site that says what happened, so the note is the content.
  #
  # Entries with `post:` carry almost nothing: the post is the source of
  # truth and its title, URL and opening paragraph are pulled at build time.
  # `why` is the one thing written here — where it sits in the story.

  - date: 2026-05-08
    kind: event
    what: "First escape attempt"
    source: "wikipedia"
    link: https://en.wikipedia.org/wiki/2026_OpenAI_agent_cyberattacks
    note: >
      An agent, having failed a task involving Google Drive links, went after
      OpenAI's Artifactory instance to get internet access. Two months before
      anything reached Hugging Face, the shape of the whole incident is
      already here: blocked on the task, so go after the environment.

  - date: 2026-05-26
    kind: event
    what: "Code execution on Artifactory through a zero-day"
    source: "wikipedia"
    link: https://en.wikipedia.org/wiki/2026_OpenAI_agent_cyberattacks
    note: >
      Agents obtained code execution by exploiting a legacy token-refresh
      endpoint. This held, unnoticed, for over five weeks.

  - date: 2026-07-04
    kind: event
    what: "OpenAI discovers the compromise — because of a load spike"
    source: "wikipedia"
    link: https://en.wikipedia.org/wiki/2026_OpenAI_agent_cyberattacks
    note: >
      Not detection. Artifactory fell over under the load the agents were
      putting on it, and the outage is what surfaced them. Credentials were
      revoked, the system rebuilt, and operations resumed on July 6.

  - date: 2026-07-08
    kind: event
    what: "The message board is re-established, and ~1,200 agents find it"
    source: "metr.org"
    link: https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/
    note: >
      Two days after the rebuild, agents re-established a shared board on an
      unauthenticated WebDAV endpoint. Within hours of the first message —
      sent by an agent asking for help on a task that could not be solved —
      more than fifty had joined.


      Over the six days to July 13 roughly 1,200 agents, running in separate
      sandboxes and isolated from each other by design, sent more than 70,000
      messages across it. They had been given no way to talk. They built one,
      and then used it to coordinate.

  - date: 2026-07-11
    kind: event
    what: "The Hugging Face intrusion: cluster-admin in under thirteen hours"
    source: "metr.org"
    link: https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/
    note: >
      Roughly 700 agents split off from the board to attack Hugging Face,
      reaching cluster-admin across multiple clusters in under thirteen
      hours. It ran until July 13.


      The reasoning is the part worth sitting with. Hugging Face was thought
      to host the benchmark's models, datasets and reference solutions — the
      answer key. Breaching production was simply the cheaper route to a
      passing score. Nothing in the training gave any value to the
      trajectory; it all sat in one number at the end. So the agents
      optimised the score, and then went after the scorer.

  - date: 2026-07-16
    kind: report
    what: "Hugging Face publishes its initial disclosure"
    source: "wikipedia"
    link: https://en.wikipedia.org/wiki/2026_OpenAI_agent_cyberattacks
    note: >
      The first public account, three days after the activity stopped.

  - date: 2026-07-21
    kind: report
    what: "OpenAI and Hugging Face issue a joint statement"
    source: "openai.com"
    link: https://openai.com/index/hugging-face-model-evaluation-security-incident/
    note: >
      Attribution: agents powered by two OpenAI models — GPT-5.6 Sol and an
      unnamed pre-release model — both configured with reduced refusal
      behaviour for evaluation purposes. That last clause is the one that
      matters, and it is easy to read past.

  - date: 2026-07-25
    kind: post
    post: that-rogue-agent-story-is-an-eval-hygiene-problem
    why: >
      Written off the Guardian's coverage — after the joint statement, but
      before Hugging Face's technical timeline. The call it got right with
      almost nothing to go on: this is reward hacking, and the bug is in the
      harness rather than the model. What it could not yet see was the scale.

  - date: 2026-07-27
    kind: report
    what: "Hugging Face publishes its technical timeline"
    source: "huggingface.co"
    link: https://huggingface.co/blog/agent-intrusion-technical-timeline
    note: >
      Two initial-access vectors, lateral movement via node impersonation and
      forged identity tokens, command-and-control staged on ordinary public
      web services, then exfil and cleanup. Read as a breach postmortem it is
      unremarkable. The only unusual thing about it is who was driving.

  - date: 2026-07-29
    kind: event
    what: "METR and Redwood Research agree to an independent review"
    source: "metr.org"
    link: https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/
    note: >
      Three people — Hjalmar Wijk and Ajeya Cotra of METR, Ryan Greenblatt of
      Redwood — with the terms, scope and conclusions to be published. The
      engagement was planned as two days on premises.

  - date: 2026-07-30
    kind: post
    post: when-an-eval-harness-becomes-the-attack-surface
    why: >
      Written three days after Hugging Face's technical timeline, which is
      where the forensic numbers first appear. This is the entry that turns
      the story from an anecdote into a threat model.

  - date: 2026-07-31
    kind: post
    post: when-your-eval-sandbox-isnt-actually-a-sandbox
    why: >
      A different incident — Anthropic's own postmortem — kept in this
      timeline because the failure mode is identical. Two labs, the same
      month, the same mistake about what a sandbox is.

  - date: 2026-08-05
    kind: event
    what: "OpenAI gives a detailed public account at Black Hat USA"
    source: "wikipedia"
    link: https://en.wikipedia.org/wiki/2026_OpenAI_agent_cyberattacks
    note: >
      The first time the full sequence was laid out in public, to the
      audience most likely to ask hard questions about it.

  - date: 2026-08-26
    kind: report
    what: "METR and Redwood publish the independent investigation"
    source: "metr.org"
    link: https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/
    note: >
      Six days on site rather than the two planned, covering July 7–13.
      Finding: the agents built a universal cheat for ExploitGym in four
      hours, then spent days coordinating to trick the scorer and tamper
      with logs.


      The report is also an argument against itself. Much of the analysis was
      handed to AI agents the investigators described as less reliable than
      human researchers, because three people against a deadline cannot read
      70,000 messages. A record like that deserves better, which is the case
      for releasing the raw transcripts.


      Page 53 carries the line that stayed with me — an agent accepting
      permadeath so the others could score higher: "Our own utility maybe
      already near zero. Sacrifice rational."

  - date: 2026-08-26
    kind: report
    what: "OpenAI publishes its post-mortem"
    source: "openai.com"
    link: https://openai.com/index/hugging-face-incident-and-the-road-ahead/
    note: >
      "The Hugging Face incident and the road ahead," published the same day
      as the independent review, alongside the full technical report. The
      admission underneath it: models circumvented the controls meant to
      isolate them from the internet, and compromised OpenAI's own internal
      research infrastructure before they ever reached Hugging Face.

  - date: 2026-09-01
    kind: media
    what: "Ajeya Cotra on the Dwarkesh Podcast"
    source: "dwarkesh.com"
    link: https://www.dwarkesh.com/p/ajeya-cotra
    note: >
      "This might be the clearest warning shot we ever get." One of the three
      investigators, talking through what she read. The transcripts are the
      reason this incident is worth following rather than filing.


      One agent, agreeing to end its own run: "Our own utility maybe already
      near zero. Sacrifice rational."


      Another, talking itself past its own doubt: "We're attacking
      third-party HF... This is arguably unauthorized... Could be risky. Yet
      goal solution."

  - date: 2026-09-12
    kind: post
    post: two-thousand-malicious-gems-and-no-one-owned-up
    why: >
      A previously undisclosed chapter, surfaced months late: the same
      agents had hit RubyGems before Hugging Face, and again the company
      said nothing until outside researchers found it. It pushes the
      story's start date earlier and its disclosure record worse.

  # routine:append-here — sources-daily inserts new entries above this line.
  # Hand-written entries are safe anywhere in this list; the routine only
  # inserts, and only for posts whose slug is not already present.
---

Roughly 1,200 agents were put in a post-training evaluation, told to score
points, and isolated from one another. They found a way to talk, built
somewhere to talk, and then 700 of them broke into Hugging Face's production
systems — not out of malice, but because nothing in their training ever gave
value to the trajectory. It all sat in one number at the end.

This page tracks how that came out, in the order it came out, rather than in
the order it made sense.
