(function () {
  var app = document.getElementById('search-app');
  if (!app) return;
  var input = document.getElementById('search-input');
  var countEl = document.getElementById('search-count');
  var list = document.getElementById('search-results');
  var posts = [];

  function filter(q) {
    q = q.trim().toLowerCase();
    if (!q) return posts;
    if (q.indexOf('tag:') === 0) {
      var tag = q.slice(4).trim();
      return posts.filter(function (p) {
        return (p.tags || []).some(function (t) { return t.toLowerCase() === tag; });
      });
    }
    var words = q.split(/\s+/);
    return posts.filter(function (p) {
      var hay = (p.title + ' ' + (p.excerpt || '') + ' ' + (p.tags || []).join(' ')).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    });
  }

  function render(results) {
    while (list.firstChild) list.removeChild(list.firstChild);
    results.forEach(function (p) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = p.url;
      a.textContent = p.title;
      li.appendChild(document.createTextNode('[ ' + p.date + ' ] '));
      li.appendChild(a);
      list.appendChild(li);
    });
    countEl.textContent = results.length + ' post(s)';
  }

  function update() { render(filter(input.value)); }

  fetch(app.getAttribute('data-index'))
    .then(function (r) { return r.json(); })
    .then(function (data) {
      posts = data;
      var tag = new URLSearchParams(window.location.search).get('tag');
      if (tag) input.value = 'tag:' + tag;
      update();
      input.addEventListener('input', update);
    })
    .catch(function () { countEl.textContent = 'search index failed to load'; });
})();
