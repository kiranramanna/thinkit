---
layout: page
title: /interests
# Without this the page renders to /interests.html while the collection owns
# /interests/<topic>/ — so every "interests /" crumb would 404. Claim the
# directory index explicitly.
permalink: /interests/
---

{%- comment -%}
  Landing page for the special-interest section.

  A table earns its place here because these topics are compared on the same
  few dimensions — how active, how deep, how stale. STATE is computed from the
  last entry's date rather than set by hand, so an interest that stopped being
  fed says so instead of quietly looking maintained.
{%- endcomment -%}

<p class="ie-blurb">stories I'm following as they come out, not as they conclude</p>

{%- assign now_s = site.time | date: '%s' | plus: 0 -%}
{%- assign interests = site.interests | sort: 'title' -%}
{%- assign total_entries = 0 -%}

<div class="ie-index-scroll">
<table class="ie-index">
  <thead>
    <tr>
      <th>topic</th>
      <th>state</th>
      <th class="num">entries</th>
      <th>activity</th>
      <th class="num">last</th>
    </tr>
  </thead>
  <tbody>
  {%- for item in interests -%}
    {%- assign sorted = item.entries | sort: 'date' -%}
    {%- assign n = sorted | size -%}
    {%- assign total_entries = total_entries | plus: n -%}
    {%- assign last_entry = sorted | last -%}
    {%- assign last_s = last_entry.date | date: '%s' | plus: 0 -%}
    {%- assign age_days = now_s | minus: last_s | divided_by: 86400 -%}
    {%- if age_days < 30 -%}
      {%- assign state = 'live' -%}
    {%- elsif age_days < 90 -%}
      {%- assign state = 'warm' -%}
    {%- else -%}
      {%- assign state = 'cold' -%}
    {%- endif -%}
    {%- assign bar = n -%}
    {%- if bar > 24 %}{% assign bar = 24 %}{% endif -%}
    <tr>
      <td>
        <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
        {%- if item.blurb %}<span class="ie-index-blurb">{{ item.blurb }}</span>{% endif -%}
      </td>
      <td><span class="ie-badge ie-badge--{{ state }}">{{ state | upcase }}</span></td>
      <td class="num">{{ n }}</td>
      <td class="ie-bar" aria-hidden="true">{% for i in (1..bar) %}&#9642;{% endfor %}</td>
      <td class="num">{{ age_days }}d</td>
    </tr>
  {%- endfor -%}
  </tbody>
</table>
</div>

<p class="ie-meta">
  {{ interests | size }} interests · {{ total_entries }} entries ·
  an interest goes COLD after 90 days without a new one
</p>
