---
layout: post
title: "Context Compaction Is Quietly Breaking Agent RL"
date: 2026-10-18 14:05:40 +0000
categories: [agentic-ai, llm-ops, research]
source: hf-papers
source_id: "2610.22174"
discussion_url: https://huggingface.co/papers/2610.22174
source_url: https://arxiv.org/abs/2610.22174
---

The diagnosis in [Mosaic](https://arxiv.org/abs/2610.22174) is sharper than its benchmark number, and it names something most agent teams are already living with. Production agents don't run in one continuous context — they compact history when the window fills and fork subagents to parallelize work. Those are operational necessities, not design choices. The paper's point is that they quietly violate the assumption almost every agentic RL method is built on: that a trajectory is a single, continuously accumulated session.

When training assumes one session and inference spans several, credit assignment goes wrong. The common fix is to broadcast the trajectory-level advantage to every session equally. That treats a throwaway subagent that returned nothing the same as the session that actually closed the task — so the reward signal can't tell you which session was worth spawning. Mosaic's answer is critic-free hierarchical optimization: fold session-usage signals into the trajectory-level advantage, then shape each session's advantage by its estimated marginal contribution. In plain terms, it learns *which sessions earned their tokens*, not just whether the whole run succeeded.

What makes this production-relevant isn't the BrowseComp result on Qwen3.5-4B — it's that the method uses fewer sessions on average to get there. Session count is latency and cost in an agent loop. If "did forking this subagent help?" becomes a learnable signal instead of a hand-tuned heuristic, then context compaction and subagent spawning stop being scaffolding we bolt on after training and become part of what we optimize. The [HF paper page](https://huggingface.co/papers/2610.22174) frames session allocation as the next target, and I think that's the right frame.

Here's what I'd push on: most of us do compaction and forking as inference-time hacks precisely because we *can't* retrain. Does crediting sessions only pay off if you own the RL loop — or is the real takeaway that an agent framework should be logging session utility as a first-class metric right now, training or not?
