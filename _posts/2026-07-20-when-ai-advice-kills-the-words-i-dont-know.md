---
layout: post
title: "When AI Advice Kills the Words 'I Don't Know'"
date: 2026-07-20 03:03:33 +0000
categories: [llm-ops, conversational-ai, research]
hn_id: 48971738
hn_url: https://news.ycombinator.com/item?id=48971738
source_url: https://thenextweb.com/news/ai-advice-suppresses-critical-thinking-wrong-answers-study
---

The number that should worry anyone shipping agent-assisted workflows isn't the accuracy drop. It's that willingness to say "I don't know" collapsed from 44% to 3% the moment [AI advice was on the table](https://thenextweb.com/news/ai-advice-suppresses-critical-thinking-wrong-answers-study). Accuracy fell from 27% to 9%; confidence climbed from 30% to 76%. People didn't just get answers wrong — they got wrong answers and believed them harder.

The study design is the part I keep coming back to. The researchers deliberately picked a model that was usually wrong on the questions — obscure visual trivia — so the effect couldn't be waved away as sensible delegation to a reliable tool. Some participants who would have answered correctly on their own asked the model and became wrong. Paying them for accuracy barely moved the needle.

This is the half of "human-in-the-loop" that eval dashboards don't capture. We instrument model accuracy, tool-call success, retrieval recall — all the machine-side numbers. What this measures is the human side: an LLM in a decision loop doesn't just add a suggestion, it recalibrates the person's confidence, usually upward and usually wrong. In production, a virtual agent that confidently hands a rep the wrong next-best-action isn't a 9%-accuracy problem — it's a 76%-confidence problem, because the rep stops checking.

The fix isn't better answers, it's better uncertainty. Surface when the model is out of distribution. Make "I don't know" a first-class output the UI rewards, not a failure the product hides. Abstention is a feature, not a bug in your completion rate.

The [HN thread](https://news.ycombinator.com/item?id=48971738) splits on whether any of this is new — over-reliance is old — but the magnitude is the story, and the usual lever, money, barely dented it.

If your agent can't say "I'm not sure," what exactly is it teaching the people who trust it?
