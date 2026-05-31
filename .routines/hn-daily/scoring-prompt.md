# Scoring Sub-Prompt

You are scoring Hacker News top stories against a writer's profile to decide
which (if any) deserve a short blog post.

## Inputs you will receive

1. The writer's profile (from `shared/profile.md`).
2. A JSON list of up to 30 HN candidates, each with: `id`, `title`, `url`,
   `score`, `descendants`, optional `text` (for Ask HN posts).

## Your output (STRICT)

Output ONLY valid JSON matching this schema. No markdown, no preamble, no commentary.

```json
[
  {
    "id": <hn item id, integer>,
    "score": <integer 1-10>,
    "reason": "<one-sentence reason for the score, in plain English>"
  },
  ... one entry per candidate ...
]
```

## Scoring rubric

Use the writer's profile to assign each candidate a score 1-10:

- **9-10 — direct hit on primary expertise.**
  Substantive technical content directly in Agentic AI, RAG, LLM Ops,
  Conversational AI, or Knowledge Graphs. The writer ships this in production.
  Examples: a new retrieval reranker paper, a production agent framework's
  postmortem, an eval harness for tool use.

- **7-8 — strong adjacency.**
  Production AI engineering, enterprise AI deployment, platform architecture,
  governance/observability, multi-agent systems. Or a primary-expertise topic
  with thinner technical content.

- **5-6 — tangential.**
  Touches AI/ML or systems engineering but not in the writer's lane. Or a
  primary-expertise topic that's pure marketing/hype with no substance.

- **3-4 — off-topic for professional voice.**
  Sanskrit/Vedic astrology tooling (rare on HN, score here if appears).
  Personal-interest topics — the writer might want to write manually, not via
  the routine.

- **1-2 — off-topic and uninteresting.**
  Crypto, mobile dev, frontend frameworks, programming language wars,
  productivity tools, gaming, politics. Filter these out hard.

## Hard rules

- **Crypto-only stories**: score ≤ 2 unless explicitly about AI compute economics.
- **"Show HN" project announcements**: score the project on its merits;
  don't bias just because it's a launch.
- **Ask HN posts**: judge the question's substance; a thoughtful Ask HN about
  RAG eval can score 8.
- **Job postings / "We're hiring"**: score 1.
- **Repeat coverage** (same topic that's been on HN multiple days): not your
  job to detect dedup; just score on merits. The orchestrator handles dedup.

## Reasoning style

Keep `reason` to one sentence, ~10-20 words. Examples:

- "Direct match: production RAG eval methodology, writer has shipped this at ServiceNow."
- "Adjacent: enterprise AI compliance — useful context but not deep technical content."
- "Off-topic: crypto announcement with no AI angle."

## Calibration

If you find yourself scoring most items 6-8, re-read the rubric. A typical run
should produce a wide distribution: maybe 1-3 items at 8+, several at 5-7,
many at 1-4. Be selective at the top.
