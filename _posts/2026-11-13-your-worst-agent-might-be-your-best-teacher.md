---
layout: post
title: "Your Worst Agent Might Be Your Best Teacher"
date: 2026-11-13 15:28:43 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2611.17167"
discussion_url: https://huggingface.co/papers/2611.17167
source_url: https://arxiv.org/abs/2611.17167
---

The result in [this paper](https://arxiv.org/abs/2611.17167) is the kind of thing that quietly rearranges how you staff an agent pipeline: a model that acts badly can still teach well. The authors separate three jobs a decision model does — actor (pick the next action), judge (score actions already taken), and teacher (score every action to shape a policy via RL) — and show the three don't rise and fall together.

As actors on ALFWorld, all six models they tested got pulled toward the easy, immediate subgoal and away from the one that had to come first. The same models, asked after the episode to judge whether each action actually helped, credited the right early steps instead. That reframing — "did this action help?" rather than "will the task succeed?" — is what separates useful moves from useless ones. Used as a teacher, their JEV signal pushed a Qwen2.5-1.5B policy from 72.8% to 82.9% on ALFWorld and from 56.8% to 71.4% on WebShop under GRPO.

This matches something I keep running into: the model you'd never trust to drive the agent can be exactly the one you want grading it. Post-hoc judging sees the whole trajectory, including the consequences an actor had to guess at in the moment. If you build eval harnesses or RL reward signals for tool-use agents, that decouples two cost decisions you probably bundled together — you don't need a frontier model as your judge just because your actor is weak, and a cheap judge reading full trajectories can teach better than an expensive one scoring single steps in isolation. The [paper page on Hugging Face](https://huggingface.co/papers/2611.17167) has the breakdown across the actor and judge roles.

So before you reach for the biggest model as your evaluator: have you measured whether acting skill and judging skill actually track each other in your own harness, or did you just assume they do?
