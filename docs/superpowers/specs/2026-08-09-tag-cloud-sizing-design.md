# Tag cloud sizing on /tags

**Status:** approved 2026-08-09

## Problem

`/tags` renders a word cloud above a tag-by-tag post index. The cloud is
supposed to show volume through font size, but the sizing is linear:

```liquid
{% assign bucket = cat[1].size | times: 5 | divided_by: max %}
```

With `max = 216`, integer division collapses the low end. `rag` has 24 posts
and computes `24 * 5 / 216 = 0`, clamped to bucket 1 — the same size as a
one-post tag. Fifteen of twenty-two tags currently render identically despite
spanning a 24x range. The cloud shows almost nothing.

Two smaller defects surfaced while measuring this:

- Three legacy posts write `categories:` as a bare space-separated string.
  Jekyll splits on whitespace, so `categories: OpenAI Deep Research` becomes
  three tags. `Deep` is not a tag anyone meant, and capital `Research` shadows
  the real `research`.
- Headings emit `id="{{ cat[0] }}"`. For the six multi-word tags this produces
  an id containing a space, which is not a valid HTML fragment, so those cloud
  words scroll nowhere when clicked.

## Decisions

- Keep the existing page shape: cloud on top, full post index below, clicking a
  word scrolls down. No new page and no new nav entry.
- Cap the largest word at `2.4em`. The cloud is a header for the index, not the
  page's subject; larger sizes push the post list past the fold.
- Fix the three posts rather than work around their tags in the template. The
  data is wrong, not the renderer.

## Sizing algorithm

Liquid has no `sqrt`, no `log`, and no floats — only integer arithmetic. Area
scaling is therefore not directly expressible. Instead, normalise each count
against the maximum, then compare against geometrically spaced thresholds:

```
ratio  = count * 1000 / max
bucket = 8 if ratio >= 500
         7 if ratio >= 250
         6 if ratio >= 125
         5 if ratio >=  62
         4 if ratio >=  31
         3 if ratio >=  16
         2 if ratio >=   8
         1 otherwise
```

Each threshold is roughly half the previous one, which makes the ladder log2
scaling built from integer comparisons alone.

Thresholds are fractions of `max`, not absolute counts, so the scale retunes
itself as the blog grows. The publishing routine adds posts twice daily; when
`llm-ops` reaches 400 the ladder still spreads the field without an edit.

Measured against current data (`max = 216`):

| tag | count | ratio | bucket | size |
|---|---|---|---|---|
| llm-ops | 216 | 1000 | 8 | 2.4em |
| agentic-ai | 166 | 768 | 8 | 2.4em |
| ai-infrastructure | 90 | 416 | 7 | 2.1em |
| research | 69 | 319 | 7 | 2.1em |
| industry | 53 | 245 | 6 | 1.85em |
| enterprise-ai | 41 | 189 | 6 | 1.85em |
| rag | 24 | 111 | 5 | 1.55em |
| conversational-ai | 10 | 46 | 4 | 1.3em |
| knowledge-graphs, investing, finance, business strategy | 3 | 13 | 2 | 0.95em |
| LLM, deepseek, OpenAI | 2 | 9 | 2 | 0.95em |
| the six one-post tags | 1 | 4 | 1 | 0.85em |

Words stay in alphabetical order. Sorting by size would read as a leaderboard;
alphabetical scatters the large tags naturally because names do not correlate
with counts.

Frequency also drives opacity, from `0.55` at bucket 1 to `1` at buckets 7-8,
using inherited colour so it survives the light/dark toggle. Every word carries
`title="N posts"` — size alone is a poor signal for anyone who cannot compare
areas — and the floor stays at `0.85em` so nothing becomes unreadable.

## Mobile (found during verification)

`_sass/base.scss:21` carries an upstream rule:

```scss
@media only screen and (max-device-width: 500px) { * { font-size: 12px !important; } }
```

A universal selector with `!important` outranks any normal declaration whatever
its specificity, so every cloud word collapsed to a single size on phones —
measured ratio 1.0 against an expected 2.82. This predates the change; the old
five-bucket cloud was equally flat on mobile, which is easy to miss because the
rule keys off `max-device-width` and so does not fire when a desktop browser is
merely resized.

The `.cloud-N` font sizes therefore carry `!important` themselves. Between two
`!important` declarations specificity decides again, and `.cloud-N` (0,1,0)
beats `*` (0,0,0). Scope stays limited to these eight classes; the theme's rule
is left intact for everything else.

## Changes

| File | Change |
|---|---|
| `tags.md` | Replace linear bucket maths with the ratio ladder; `slugify` the `href` and the heading `id`; add `title` |
| `assets/main.scss` | Replace `.cloud-1`..`.cloud-5` with eight steps carrying size and opacity |
| `_posts/2025-01-27-deepseek-r1-disruption.md` | `categories: LLM deepseek` -> `[LLM, deepseek]` |
| `_posts/2025-02-03-Deep-Research-OpenAIs-Game-Changing-AI-Agent.md` | `categories: OpenAI Deep Research` -> `[OpenAI, research]` |
| `_posts/2025-02-10-Deep-Dive-into-Large-Language-Models-LLMs-like-ChatGPT.md` | same |

Post bodies are untouched. `_config.yml` is untouched.

## Verification

Build with `docker compose` and assert against generated HTML:

- 22 anchors in `.tag-cloud`, none labelled `Deep`
- `research` reports 69 posts, up from 67
- `llm-ops` and `agentic-ai` carry `cloud-8`; `rag` carries `cloud-5`
- at least six distinct `cloud-N` classes present, versus two today
- every cloud `href` has a matching heading `id` on the page
- links resolve under `baseurl: /thinkit`

Then screenshot `/tags` in both themes to confirm the post index still sits
near the fold, and at 390px wide to confirm the size ratio survives the mobile
rule (expect 2.82, not 1.0) without horizontal overflow.

### Result

All fifteen assertions passed against the built HTML. Measured on the page:
seven distinct sizes spanning 10.6px to 30px at desktop width, the post index
beginning at 246px, and clicking `business strategy` scrolling from 0 to
5343px where it previously did nothing. At 390px the ratio is 2.82 with the
widest word at 257px and no overflow. Both themes verified.

The two console errors on the dev server are an inline livereload script
tripping the CSP and a missing favicon; the production build contains zero
inline scripts.
