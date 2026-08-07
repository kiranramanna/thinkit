# Clean URLs, Tags Page, and Search — Design Spec

**Date:** 2026-08-07
**Status:** Approved (brainstorming session, 2026-08-07)
**Target repo:** `kiranramanna/thinkit`

## 1. Goal

Remove categories from post URLs (keeping them as frontmatter metadata),
surface them instead via a `/tags` word-cloud page and per-post tag links,
and add a client-side `/search` page that also serves as the landing target
for tag clicks (`/search/?tag=<tag>`).

Decisions locked during brainstorming:

| Decision | Choice |
|---|---|
| Permalink | `/:year/:month/:day/:title:output_ext` (date kept, categories dropped) |
| Old URLs | Allowed to break; search is the recovery path (no redirects) |
| Tag click on a post | → `/search/?tag=<tag>` pre-filtered |
| Word cloud | Pure Liquid + CSS, no JS (CSP untouched); words jump to same-page sections; section headings also link to filtered search |
| Search | Self-hosted vanilla JS + Liquid-generated `search.json` (CSP `script-src 'self'` / `connect-src 'self'` compatible) |

## 2. Changes

1. **`_config.yml`** — add `permalink: /:year/:month/:day/:title:output_ext`;
   extend `header_pages` with `tags.md` and `search.md`.
2. **`tags.md`** (permalink `/tags/`, title `/tags`) — Liquid computes a
   1–5 size bucket per tag from `site.categories` counts (bucket =
   `count * 5 / max_count`, min 1); cloud renders `<a class="cloud-N"
   href="#<tag>">`. Below, one section per tag (sorted by name):
   `<h2 id="<tag>"><a href="/search/?tag=<tag>">/<tag></a></h2>` + post list
   in the home page's `[ date ] title` style.
3. **`search.md`** (permalink `/search/`, title `/search`) — input box +
   results container carrying `data-index="{{ '/search.json' | relative_url }}"`;
   loads `/assets/search.js` (self-hosted).
4. **`search.json`** (repo root, `layout: null`) — JSON array of
   `{title, url, date, tags, excerpt}` for every post, built with `jsonify`.
5. **`assets/search.js`** — vanilla JS: fetch the index; on `?tag=X` prefill
   with `tag:X` and filter by exact frontmatter tag; free text matches
   title/excerpt/tags substrings (case-insensitive); render results as
   `[ date ] title` links; show result count; no external requests.
6. **`_layouts/post.html`** — after content, a tags line:
   `tags: [ <tag> ]...` with each tag linking to `/search/?tag=<tag>`.
7. **`assets/main.scss`** — cloud size classes (`.cloud-1`…`.cloud-5`),
   `.tag-line`, search input/results styling consistent with the hacker theme
   (and legible under the light toggle, which only swaps CSS variables).

## 3. Explicitly unchanged

Publishing routine (URLs never enter its contract), post frontmatter format,
existing post files, CSP, theme toggle.

## 4. Testing

`bundle install` (vendored) + `jekyll build` locally if the environment
allows; verify: a post URL matches the new pattern, `/tags/` renders the
cloud with correct counts, `search.json` parses as JSON, `search.js` filter
logic passes a node-based unit check, and tag links carry the right query
string. If a local Jekyll build is impossible, validate `search.json` Liquid
by careful review, push, then confirm the Pages build status and live pages
immediately.

## 5. Risks

- All previously published post URLs 404 (accepted).
- `search.js` must parse `?tag=` values that contain hyphens only (controlled
  vocabulary) — no escaping surprises.
