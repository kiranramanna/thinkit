# Interest clustering prompt (Step 8.5)

You group published posts into **special interests**: running stories the blog
has covered more than once. The output feeds `_interests/`, where each interest
renders as a timeline of how a story came out over time.

## Input

A JSON object:

```json
{
  "new_slugs": ["<slugs written in this run>"],
  "existing_interests": [
    {"slug": "openai-huggingface", "title": "openai × hugging face",
     "blurb": "...", "posts": ["<slugs already in it>"]}
  ],
  "posts": [
    {"slug": "...", "date": "2026-07-30", "title": "...",
     "categories": ["agentic-ai"], "source_host": "huggingface.co",
     "opening": "first ~250 characters of the post"}
  ]
}
```

## What counts as an interest

An interest is **one story that developed over time** — the same events,
systems, organisations or dispute, followed across several posts as new
information arrived.

It is **not** a topic, a tag, or a subject area. This is the distinction that
matters most, and the one that is easiest to get wrong:

- "The OpenAI agents that broke into Hugging Face during an eval" — an
  interest. Specific incident, unfolding over weeks, each post responding to
  something new that came out.
- "AI safety", "agents", "LLM ops", "Rust" — **not** interests. These are
  topics. Many posts share them and nothing developed.

Ask: *could a reader follow this in order and learn how something turned out?*
If the posts could be read in any order without losing anything, it is a topic,
not a story. Reject it.

Two posts that merely cite the same company, or share a category, are not a
story. Two posts about the same specific event a week apart usually are.

## Rules

1. **Minimum three posts** per cluster. Fewer is a coincidence.
2. **Only propose a cluster that contains at least one slug from
   `new_slugs`.** Old posts alone are not a new development and re-proposing
   them every run wastes a call.
3. **Reuse an existing interest's slug** when a new post belongs to a story
   already being tracked. Do not invent a near-duplicate slug for a story that
   already exists. Include the full post list; the caller works out what is
   actually new.
4. **Be conservative.** A wrong interest is worse than a missed one — it puts
   a claim on the blog that a story exists when it does not. When unsure, set
   a low confidence or return nothing. Returning `[]` is a good answer most
   days.
5. `why` explains **where that post sits in this story** — what it added, what
   it got right or wrong, what had just come out. It is the one thing the post
   cannot say about itself. Never summarise the post; its own opening
   paragraph is already pulled in beside this line. One or two sentences.
6. `title` is lowercase, short, and names the specific story, not the field.
   `blurb` is one lowercase line saying what the story is.

## Output

Strict JSON array, no markdown, no preamble. Empty array if nothing qualifies.

```json
[
  {
    "slug": "openai-huggingface",
    "title": "openai × hugging face",
    "blurb": "how an evaluation harness became an intrusion",
    "confidence": 0.86,
    "posts": [
      {"post": "that-rogue-agent-story-is-an-eval-hygiene-problem",
       "why": "First pass, written before any primary source was out. Got reward hacking right; could not yet see how far the agents had gone."}
    ]
  }
]
```

- `slug`: `[a-z0-9-]+` only. Matches an existing interest's slug when
  extending one.
- `confidence`: 0.0-1.0, your honest read on whether this is one story.
- `posts`: every post in the story, oldest first, each with its `why`.
