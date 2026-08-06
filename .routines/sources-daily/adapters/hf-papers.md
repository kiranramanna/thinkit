# Adapter: Hugging Face Daily Papers

Fetches today's community-upvoted papers from the HF daily_papers API and
emits normalized candidates to `/tmp/candidates-hf-papers.json`. Requires
`$CONFIG` in the shell environment.

The API returns one day's curated list (refreshes ~once per weekday), so
there is no fetch_limit. `url` is the arXiv abs page (canonical for dedup);
`discussion_url` is the HF paper page; `extra` carries the abstract, which
grounds both scoring and writing (papers rarely have public reaction yet).

**Failure contract:** on any error, ensure `/tmp/candidates-hf-papers.json`
contains `[]` and echo a line starting with `ADAPTER_ERROR hf-papers:` —
never abort the run.

```bash
set -o pipefail
HF_MIN=$(echo "$CONFIG" | jq -r '.sources["hf-papers"].min_score')

echo "[]" > /tmp/candidates-hf-papers.json

if ! curl -sf --max-time 20 "https://huggingface.co/api/daily_papers" \
    > /tmp/hf_raw.json; then
  echo "ADAPTER_ERROR hf-papers: fetch failed"
else
  jq --argjson minscore "$HF_MIN" '
    map(select((.paper.upvotes // 0) >= $minscore))
    | map({
        source: "hf-papers",
        source_id: .paper.id,
        title: .paper.title,
        url: ("https://arxiv.org/abs/" + .paper.id),
        discussion_url: ("https://huggingface.co/papers/" + .paper.id),
        raw_score: .paper.upvotes,
        extra: (.paper.summary // null)
      })
  ' /tmp/hf_raw.json > /tmp/candidates-hf-papers.json \
    || { echo "[]" > /tmp/candidates-hf-papers.json; echo "ADAPTER_ERROR hf-papers: normalize failed"; }
fi

echo "hf-papers: $(jq length /tmp/candidates-hf-papers.json) candidates"
```
