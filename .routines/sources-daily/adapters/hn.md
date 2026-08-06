# Adapter: Hacker News

Fetches top stories from the HN Firebase API and emits normalized candidates
to `/tmp/candidates-hn.json`. Requires `$CONFIG` (JSON of `config.yml`) in the
shell environment.

**Failure contract:** on any error, ensure `/tmp/candidates-hn.json` contains
`[]` and echo a line starting with `ADAPTER_ERROR hn:` — never abort the run.

```bash
HN_LIMIT=$(echo "$CONFIG" | jq -r '.sources.hn.fetch_limit')
HN_MIN=$(echo "$CONFIG" | jq -r '.sources.hn.min_score')

echo "[]" > /tmp/candidates-hn.json

if ! curl -s --max-time 20 https://hacker-news.firebaseio.com/v0/topstories.json \
    | jq ".[0:${HN_LIMIT}]" > /tmp/hn_top_ids.json; then
  echo "ADAPTER_ERROR hn: topstories fetch failed"
else
  echo "[]" > /tmp/hn_raw.json
  for id in $(jq -r ".[]" /tmp/hn_top_ids.json); do
    story=$(curl -s --max-time 10 "https://hacker-news.firebaseio.com/v0/item/${id}.json")
    if [ -n "$story" ] && [ "$story" != "null" ]; then
      jq --argjson s "$story" '. += [$s]' /tmp/hn_raw.json > /tmp/hn_raw.tmp \
        && mv /tmp/hn_raw.tmp /tmp/hn_raw.json
    fi
    sleep 0.1
  done

  jq --argjson minscore "$HN_MIN" '
    map(select(
      (.score // 0) >= $minscore and
      ((.url != null) or (.text != null)) and
      .type == "story"
    ))
    | map({
        source: "hn",
        source_id: (.id | tostring),
        title: .title,
        url: (.url // ("https://news.ycombinator.com/item?id=" + (.id | tostring))),
        discussion_url: ("https://news.ycombinator.com/item?id=" + (.id | tostring)),
        raw_score: .score,
        extra: (.text // null)
      })
  ' /tmp/hn_raw.json > /tmp/candidates-hn.json \
    || { echo "[]" > /tmp/candidates-hn.json; echo "ADAPTER_ERROR hn: normalize failed"; }
fi

echo "hn: $(jq length /tmp/candidates-hn.json) candidates"
```
