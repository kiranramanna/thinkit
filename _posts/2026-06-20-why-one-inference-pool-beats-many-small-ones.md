---
layout: post
title: "Why One Big Inference Pool Beats Many Small Ones"
date: 2026-06-20 03:03:24 +0000
categories: [ai-infrastructure, llm-ops]
hn_id: 48602918
hn_url: https://news.ycombinator.com/item?id=48602918
source_url: https://brooker.co.za/blog/2020/08/06/erlang.html
---

The [M/M/c result Marc Brooker walks through](https://brooker.co.za/blog/2020/08/06/erlang.html) is one of those things every systems engineer half-remembers and consistently bets against. Hold per-server utilization fixed at 80%, add servers, and client-observed latency doesn't stay flat — it improves, asymptotically approaching the bare service time. The queue, in aggregate, mostly disappears. His poll of readers split four ways; the right answer is the one most people's intuition rejects.

That math is the whole argument against fragmenting your LLM inference fleet. A GPU replica serving a model has a hard concurrency ceiling — KV-cache slots, a batch width — so it behaves a lot like Brooker's single-slot server with a queue in front. Generation latency is long and high-variance, which is exactly the regime where queueing effects dominate the tail. Split that capacity into per-team pools "for isolation," and each small pool sits far down the unforgiving part of the Erlang-C curve. Consolidate the same GPUs into one shared pool at the same average utilization, and burst absorption gets dramatically better at no extra cost.

The catch is that pooling and isolation pull in opposite directions, and the isolation instinct usually wins the org argument. Noisy-neighbor fear, per-team billing, and blast-radius worries all push toward carving the fleet into pieces — which is precisely how you end up paying a tail-latency tax that no amount of autoscaling buys back, because the pools were provisioned too small to share. The better move is one big pool plus admission control: token budgets, priority queues, fair-share scheduling. Solve fairness in software, not by shattering the fleet.

The [HN thread](https://news.ycombinator.com/item?id=48602918) has the usual "but Poisson arrivals are a lie" pushback, and for agent traffic — bursty, correlated, retry-storm-prone — that critique has teeth. So where is your serving fleet sharded today for reasons that wouldn't survive the queueing math?
