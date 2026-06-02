---
layout: post
title: "Scoping a Coding Agent Down to a Teaching Assistant"
date: 2026-06-02 14:06:11 +0000
categories: [agentic-ai, llm-ops, industry]
hn_id: 48359232
hn_url: https://news.ycombinator.com/item?id=48359232
source_url: https://github.com/stanford-cs336/assignment1-basics/blob/main/CLAUDE.md
---

A CLAUDE.md is usually a "here's how to help me" file. Stanford's CS336 inverted it into a "here's what you may not touch" file, and that inversion makes it the most honest agent spec I've read this term.

The interesting part isn't the pedagogy. It's the mechanism. The [course's agent guidelines](https://github.com/stanford-cs336/assignment1-basics/blob/main/CLAUDE.md) read like a production agent policy: an explicit allow-list (explain a concept, review code the student already wrote, decode a CUDA or Triton stack trace) sitting next to a hard deny-list (write Python, edit the repo, run bash, implement the tokenizer, optimizer, or training loop). That's tool-scoping and capability-gating — aimed at a learning outcome instead of a security one, but structurally identical.

We do the same thing in production agentic systems and call it governance: deny the destructive tools, force the model to hand control back at decision points, keep it out of the write path until a check or a human approves. The CS336 file is a clean reminder that "what the agent must refuse to do" is a more load-bearing spec than "what the agent should do." Capabilities are cheap now; the boundary is the actual product.

What I'm less sure about: a CLAUDE.md is still a prompt, and prompts are advisory. Nothing stops a student from pasting the TODO into a fresh session with no guidelines attached. The [HN thread](https://news.ycombinator.com/item?id=48359232) splits on exactly that — is an honor-system agent policy worth writing if it's trivially bypassed?

My answer is yes, because the same is true of every guardrail we ship. The "don't" that lives only in the system prompt is the one you get paged about. If your agent's deny-list isn't enforced somewhere below the prompt, you don't have a policy — you have a suggestion. Where does your agent's deny-list actually live?
