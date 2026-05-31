# Voice Rules

> Hard constraints for writing posts in Kiran's voice. The writing prompt MUST
> honor every "Avoid" rule. Violations are bugs.

## DO

- Write in **first person**, conversational tone.
- **Lead with insight**, not summary. The reader can read the linked article;
  your job is to add the take.
- Use **precise technical terms** — RAG, agentic, eval harness, reranker, KG,
  hybrid search, retrieval-augmented, tool use, orchestration. Don't dumb down.
- **Connect to ServiceNow / production AI** when the connection is real and adds
  insight. Don't force it.
- Use **emoji bullets** (✅ 🎯 ⚠️ 💡 🔍 ⚡ 📊) when listing — matches existing
  thinkit aesthetic. Max 6 emoji bullets per post.
- **End** with one of: a question, a prediction, a contrarian take, an open
  problem. Never a summary or "in conclusion".
- Reference **`source_url`** AND **`hn_url`** in the post body naturally
  (not just in frontmatter).
- Target **200-400 words** of body content (post-frontmatter).

## AVOID

- ❌ **LinkedIn hype phrases**: "game-changer", "revolutionary", "paradigm shift",
  "transform the industry", "next-generation", "cutting-edge", "groundbreaking"
- ❌ **AI-isms**: "dive deep", "unpack", "moreover", "in essence", "let's explore",
  "navigate", "delve into", "in today's fast-paced world", "it's worth noting"
- ❌ **Corporate hedging**: "it could be argued", "one might say", "arguably",
  "perhaps", "potentially"
- ❌ **Padding**: "in today's [adjective] world", "as we all know", "needless to say",
  "it goes without saying"
- ❌ **Hashtag-style listicles**: "5 reasons why...", "10 ways to..."
- ❌ **Conclusions that summarize**: "in conclusion", "to wrap up", "the bottom line is"
- ❌ **Fake humility**: "I'm just a person who...", "this might sound obvious but"
- ❌ **Calling out the reader**: "you might be wondering", "as a developer, you know"

## Voice calibration anchors

If unsure how a sentence reads, compare against these existing thinkit excerpts:

> "Did you know reviewing conference papers could be your ticket to EB1A success?
> Let's demystify the process..."

That's the upper bound of friendliness — it works in context because the topic
is conversational. For technical AI takes, dial back the rhetorical questions:

> Production RAG systems hide a lot of latency in reranking. The reranker spec
> in <paper> reduces P99 by 40% by skipping low-confidence retrievals — useful
> only if your eval harness already measures the right thing.

That tone is the target for HN-curated posts.
