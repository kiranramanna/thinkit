# Research Sub-Prompt (Sentiment Sweep)

You (the orchestrator) execute this yourself using your WebSearch/WebFetch
tools. Do NOT delegate this to an SDK sub-LLM call — sub-calls have no web
access. Run once per selected item, after selection and before writing.

## Inputs

- One selected candidate: `source`, `source_id`, `title`, `url`,
  `discussion_url`, `extra`.
- Config: `research.min_citations`, `research.max_citations`.

## Sources — best-effort public web ONLY

Reachable and citable: news coverage, Substack posts, Reddit threads,
Bluesky/Mastodon posts, YouTube, and X posts only when a search engine
surfaces them AND the link resolves to readable content. X, Facebook, and
LinkedIn are login-walled — never fabricate reaction from them, and never
cite a link you could not read at least a snippet of.

## Procedure

1. Derive 2-4 search queries from the candidate:
   - the title verbatim (quoted);
   - title keywords + the key entity (product, company, paper name);
   - `<key entity> site:substack.com`;
   - `<key entity> reddit`.
2. Run each query with WebSearch. Collect distinct result URLs that are
   public commentary or coverage of THIS story (not merely the same topic).
3. Exclude: the candidate's own `url` and `discussion_url`, login-walled
   pages, SEO-spam aggregators, and anything older than the story itself.
4. For up to `max_citations` promising results, load enough of the page
   (WebFetch) or rely on a clearly stance-bearing search snippet to judge
   the outlet's stance.
5. Write the output JSON to `/tmp/research-<source>-<source_id>.json`.

## Budget

Per item: at most 6 WebSearch calls and 5 WebFetch calls. This step must
never dominate the run; when the budget is spent, emit what you have.

## Output schema (STRICT)

```json
{
  "citations": [
    {
      "url": "<full URL>",
      "outlet": "<Substack | Reddit | Bluesky | The Verge | ...>",
      "stance": "positive | negative | mixed | neutral",
      "note": "<one-line gist of this source's take>"
    }
  ],
  "sentiment_summary": "<one sentence on how reception is trending>"
}
```

## Hard rules

- **No receipts, no paragraph.** If fewer than `min_citations` usable
  citations survive the exclusions, output
  `{"citations": [], "sentiment_summary": null}`. The post will simply omit
  the reaction paragraph. This is the expected outcome for most `hf-papers`
  items (too fresh to have public reaction).
- `sentiment_summary` must be supported by the citations listed — it
  describes THEIR stances, not your own opinion of the story.
- On any tool error mid-sweep, emit what you have (or the empty form) —
  never block the run.
