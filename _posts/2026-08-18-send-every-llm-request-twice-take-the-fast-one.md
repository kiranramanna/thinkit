---
layout: post
title: "Send Every LLM Request Twice, Take the Fast One"
date: 2026-08-18 03:08:53 +0000
categories: [llm-ops, conversational-ai, ai-infrastructure]
source: hn
source_id: "49295179"
discussion_url: https://news.ycombinator.com/item?id=49295179
source_url: https://engineering.myhoai.com/posts/a-simple-fix-for-llm-tail-latency/
---

P50 latency is a comforting lie. The [HOAi write-up on LLM tail latency](https://engineering.myhoai.com/posts/a-simple-fix-for-llm-tail-latency/) makes the point better than any dashboard: their voice agent is fine at a typical 1.5s per turn, but 1% of LLM calls stall for 10-20 seconds — and on a 25-turn phone conversation, that 1% compounds into roughly a 22% chance of at least one dead-air moment where the caller hangs up. Tail latency stops being an edge case the moment you multiply it across a session.

The fix is almost embarrassingly old: hedged requests. Fire the request twice, take whichever returns first, and your latency becomes min(a, b). Google's *The Tail at Scale* described this back in 2013; what's new is how fat the LLM tail is and how well the trick pays off against it. Their benchmark puts the standard tier with dual sending ahead of the 2x-priced priority tier on p99 time-to-first-token (1.2s vs 4.2s) and worst-case full response (3.5s vs 9.8s), while median is a wash. You buy tail performance with redundant compute instead of a premium SLA.

That's the part worth internalizing for anyone who owns a latency budget: the cheapest lever on P99 is often redundancy, not a faster tier. I'd rather spend 2x tokens on the 1% of turns that actually stall than 2x on every token.

The caveat the [HN discussion](https://news.ycombinator.com/item?id=49295179) keeps circling is the load-bearing assumption — independence. Hedging only helps if the two requests fail independently. If your tail comes from provider-side queueing or capacity saturation, both copies land in the same slow queue and you've just doubled load on the exact system that was already the bottleneck. And for agents making non-idempotent tool calls, "send it twice" becomes a correctness question, not just a cost one.

So before you hedge: is your tail random, or is it your provider quietly telling you it's full?
