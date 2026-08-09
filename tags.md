---
title: /tags
layout: default
permalink: /tags/
---

{% assign max = 1 %}
{% for cat in site.categories %}{% if cat[1].size > max %}{% assign max = cat[1].size %}{% endif %}{% endfor %}
{% assign sorted_cats = site.categories | sort %}

<div class="tag-cloud">
{% for cat in sorted_cats -%}
{%- assign count = cat[1].size -%}
{%- comment -%}
  Liquid has no sqrt, no log and no floats, so word size cannot be computed as
  an area. Normalise the count against the largest tag, then walk geometric
  thresholds — each roughly half the previous — which is log2 scaling built
  from integer comparisons alone.

  The thresholds are fractions of max rather than fixed counts, so the scale
  retunes itself as the blog grows. A linear map does not: at max=216 the old
  `count * 5 / max` sent every tag under 44 posts to the smallest bucket,
  flattening 15 of 22 tags into one size.
{%- endcomment -%}
{%- assign ratio = count | times: 1000 | divided_by: max -%}
{%- if ratio >= 500 -%}{%- assign bucket = 8 -%}
{%- elsif ratio >= 250 -%}{%- assign bucket = 7 -%}
{%- elsif ratio >= 125 -%}{%- assign bucket = 6 -%}
{%- elsif ratio >= 62 -%}{%- assign bucket = 5 -%}
{%- elsif ratio >= 31 -%}{%- assign bucket = 4 -%}
{%- elsif ratio >= 16 -%}{%- assign bucket = 3 -%}
{%- elsif ratio >= 8 -%}{%- assign bucket = 2 -%}
{%- else -%}{%- assign bucket = 1 -%}{%- endif -%}
<a class="cloud-{{ bucket }}" href="#{{ cat[0] | slugify }}" title="{{ count }} post{% unless count == 1 %}s{% endunless %}">{{ cat[0] }}</a>
{% endfor %}
</div>

{% comment %}
  Heading ids are slugified to match the cloud's hrefs. Tag names contain
  spaces ("business strategy", "global markets"), and a space is not legal in
  an HTML id, so the raw name produced six anchors that scrolled nowhere.
{% endcomment %}
{% for cat in sorted_cats %}
<h2 id="{{ cat[0] | slugify }}"><a href="{{ '/search/' | relative_url }}?tag={{ cat[0] | url_encode }}">/{{ cat[0] }}</a> <span class="tag-count">({{ cat[1].size }})</span></h2>
<ul>
  {% for post in cat[1] %}
  <li>[ {{ post.date | date: "%Y-%m-%d" }} ] <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a></li>
  {% endfor %}
</ul>
{% endfor %}
