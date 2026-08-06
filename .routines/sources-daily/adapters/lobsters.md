# Adapter: Lobste.rs

Fetches the hottest stories from Lobste.rs and emits normalized candidates to
`/tmp/candidates-lobsters.json`. Requires `$CONFIG` in the shell environment.

Lobste.rs is invite-only with a smaller community than HN, hence the lower
`min_score` floor. The tag allowlist is a free pre-filter: items with no
allowlisted tag are dropped before any LLM call. Text posts (no external URL)
use `comments_url` as their canonical URL.

**Failure contract:** on any error, ensure `/tmp/candidates-lobsters.json`
contains `[]` and echo a line starting with `ADAPTER_ERROR lobsters:` — never
abort the run.

```bash
LOB_LIMIT=$(echo "$CONFIG" | jq -r '.sources.lobsters.fetch_limit')
LOB_MIN=$(echo "$CONFIG" | jq -r '.sources.lobsters.min_score')
LOB_TAGS=$(echo "$CONFIG" | jq -c '.sources.lobsters.tag_allowlist')

echo "[]" > /tmp/candidates-lobsters.json

if ! curl -s --max-time 20 -H "User-Agent: thinkit-routine" \
    https://lobste.rs/hottest.json > /tmp/lobsters_raw.json; then
  echo "ADAPTER_ERROR lobsters: fetch failed"
else
  jq --argjson minscore "$LOB_MIN" --argjson limit "$LOB_LIMIT" --argjson allow "$LOB_TAGS" '
    .[0:$limit]
    | map(select(
        (.score // 0) >= $minscore and
        ((.tags // []) | map(. as $t | ($allow | index($t)) != null) | any)
      ))
    | map({
        source: "lobsters",
        source_id: .short_id,
        title: .title,
        url: (if (.url // "") == "" then .comments_url else .url end),
        discussion_url: .comments_url,
        raw_score: .score,
        extra: ((.tags // []) | join(","))
      })
  ' /tmp/lobsters_raw.json > /tmp/candidates-lobsters.json \
    || { echo "[]" > /tmp/candidates-lobsters.json; echo "ADAPTER_ERROR lobsters: normalize failed"; }
fi

echo "lobsters: $(jq length /tmp/candidates-lobsters.json) candidates"
```
