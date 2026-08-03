---
layout: post
title: "When LLM Slop Gets Assigned a Critical CVE"
date: 2026-08-03 14:08:09 +0000
categories: [llm-ops, industry, research]
hn_id: 49154332
hn_url: https://news.ycombinator.com/item?id=49154332
source_url: https://research.jfrog.com/post/sqlite-critical-cves-or-llm-slops/
---

The interesting failure in [JFrog's writeup](https://research.jfrog.com/post/sqlite-critical-cves-or-llm-slops/) isn't that an LLM hallucinated a SQLite vulnerability. It's that the hallucination made it through NVD and CISA's ADP before anyone checked whether the cited code even existed.

A freshly created GitHub repo published 50+ CVE advisories, SQLite among them. NVD flagged several as critical, Red Hat handed CVE-2026-51302 a 10.0, then quietly downgraded it to 7.6. When JFrog actually verified, the whole thing fell apart: the referenced functions didn't exist in those versions, the PoC payloads triggered no crash, and none of it appeared on SQLite's own advisory page. GPTZero lit up when they concatenated the advisories into one file.

I run eval harnesses for LLM output daily, and this is the failure mode that keeps me up. The output is confident, structurally correct, and cites real-looking artifacts, so downstream systems built to trust the *format* propagate it. The CVE pipeline was never designed assuming the submitter is a plausible-nonsense generator operating at scale. A CVSS score is metadata that a lot of automated tooling treats as ground truth: dependency scanners, ticket auto-filers, and compliance gates all fan out from it.

The fix isn't "detect AI text" — that's a losing arms race against stylometry. It's the same discipline we apply inside agentic systems: no claim earns a severity score until a verification step reproduces it. PoC-must-run-in-CI before an advisory publishes is a boring, effective gate. Provenance and reproduction, not detection.

Read the [JFrog analysis](https://research.jfrog.com/post/sqlite-critical-cves-or-llm-slops/) — the per-CVE audit matrix is a decent template for what "verify before you trust the number" looks like. The [HN thread](https://news.ycombinator.com/item?id=49154332) has security folks arguing about who owns the verification burden in the chain.

If a hallucinated vulnerability can pull a 10.0 from a major vendor, what's the real signal value of an unverified CVSS score in your scanning gate?
