---
title: /tags
layout: default
permalink: /tags/
---

{% assign max = 1 %}
{% for cat in site.categories %}{% if cat[1].size > max %}{% assign max = cat[1].size %}{% endif %}{% endfor %}
{% assign sorted_cats = site.categories | sort %}

<div class="tag-cloud">
{% for cat in sorted_cats %}{% assign bucket = cat[1].size | times: 5 | divided_by: max %}{% if bucket < 1 %}{% assign bucket = 1 %}{% endif %}<a class="cloud-{{ bucket }}" href="#{{ cat[0] }}">{{ cat[0] }}</a>
{% endfor %}
</div>

{% for cat in sorted_cats %}
<h2 id="{{ cat[0] }}"><a href="{{ '/search/' | relative_url }}?tag={{ cat[0] }}">/{{ cat[0] }}</a> <span class="tag-count">({{ cat[1].size }})</span></h2>
<ul>
  {% for post in cat[1] %}
  <li>[ {{ post.date | date: "%Y-%m-%d" }} ] <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a></li>
  {% endfor %}
</ul>
{% endfor %}
