---
title: /search
layout: default
permalink: /search/
---

<div id="search-app" data-index="{{ '/search.json' | relative_url }}">
  <input type="search" id="search-input" placeholder="type to filter posts... (or tag:llm-ops)" autocomplete="off" autofocus />
  <p id="search-count"></p>
  <ul id="search-results"></ul>
</div>
<script src="{{ '/assets/search.js' | relative_url }}"></script>
