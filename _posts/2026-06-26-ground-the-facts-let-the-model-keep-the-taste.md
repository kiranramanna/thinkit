---
layout: post
title: "Ground the Facts, Let the Model Keep the Taste"
date: 2026-06-26 03:03:06 +0000
categories: [llm-ops, rag]
hn_id: 48657049
hn_url: https://news.ycombinator.com/item?id=48657049
source_url: https://dev.karltryggvason.com/you-cant-unit-test-for-taste/
---

The sharpest move in [Karl Tryggvason's writeup](https://dev.karltryggvason.com/you-cant-unit-test-for-taste/) isn't the running app it's buried in — it's the demotion. He started with an LLM both writing point-of-interest blurbs and grading their significance, then caught Haiku promoting Central Park in Decatur, Illinois to its Manhattan namesake, inflating town populations, and quietly growing mountains. Feeding admin metadata into the prompt and grounding the system prompt harder helped; it didn't fix it. So he reverted the prose to Wikipedia summaries and kept the model for exactly one job: a subjective rating. The LLM got fired from facts and rehired for taste.

That split is the whole LLM-ops lesson. Hallucination isn't a dial you turn to zero with more grounding — it's a function of where you point the model. The parts of a retrieval pipeline that have a ground truth (population, elevation, which Stonehenge you meant) belong in the deterministic layer with sanity checks you can actually assert on. The parts that don't — "is this landmark worth surfacing to a runner?" — are where the model's latent judgment beat every heuristic he tried, including the Wikidata language-count signal that buried real sights under auto-translated village stubs.

The honest bit is the title. You can build evals for code because correctness is checkable; you can't write an integration test that fact-checks taste without it collapsing into infinite regress. The eval harnesses I run in production hit this exact wall: they pin down the verifiable surface and go silent on the subjective one, and the trap is reading that silence as "passing." The [HN thread](https://news.ycombinator.com/item?id=48657049) has the predictable "just add a judge model" replies — but a judge is one more opinion with taste, not a test.

So where do you draw your own line: which outputs does the model get to own outright, and which do you refuse to ship without a deterministic check underneath?
