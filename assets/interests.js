/**
 * Special interests — master/detail behaviour for a topic timeline.
 *
 * The timeline is the index and the entry is the reading surface, the way a
 * mail client works: click a row, the list narrows to the left and the entry
 * opens on the right, and [ x ] gives the full-width list back.
 *
 * Every panel is already in the HTML, so this file only moves classes around.
 * That keeps it working under the site's `script-src 'self'` CSP — it must be
 * a real file, an inline <script> is blocked — and it means that with
 * JavaScript off the `.ie-detail:target` rule still opens an entry.
 *
 * Selection lives in the URL hash, pushed as real history entries, so an entry
 * can be linked to and the back button steps through what you read.
 */
(function () {
  'use strict';

  var root = document.getElementById('ie');
  if (!root) { return; }

  var pane = document.getElementById('ie-pane');
  var rows = Array.prototype.slice.call(root.querySelectorAll('.ie-row'));
  var details = Array.prototype.slice.call(root.querySelectorAll('.ie-detail'));
  if (!pane || !rows.length) { return; }

  pane.setAttribute('tabindex', '-1');
  rows.forEach(function (row) { row.setAttribute('aria-expanded', 'false'); });

  /**
   * Apply a selection. `n` is a 1-based entry number, or null for "closed".
   * Nothing here touches history — callers decide whether a change is worth a
   * history entry, so that restoring state on popstate doesn't push again.
   */
  function render(n) {
    var open = false;

    details.forEach(function (d) {
      var mine = d.getAttribute('data-entry') === String(n);
      d.classList.toggle('is-shown', mine);
      if (mine) { open = true; }
    });

    rows.forEach(function (row) {
      var mine = row.getAttribute('data-entry') === String(n);
      row.classList.toggle('is-active', mine);
      row.setAttribute('aria-expanded', mine ? 'true' : 'false');
    });

    root.classList.toggle('is-open', open);
    return open;
  }

  function entryFromHash(hash) {
    var m = /^#e-(\d+)$/.exec(hash || '');
    return m ? parseInt(m[1], 10) : null;
  }

  /** Select an entry and record it in history. */
  function open(n, focusPane) {
    if (!render(n)) { return; }
    var url = window.location.pathname + window.location.search + '#e-' + n;
    if (window.location.hash !== '#e-' + n) {
      history.pushState({ entry: n }, '', url);
    }
    if (focusPane) { pane.focus(); }
  }

  function close(focusRow) {
    var active = root.querySelector('.ie-row.is-active');
    render(null);
    history.pushState({ entry: null }, '', window.location.pathname + window.location.search);
    if (focusRow && active) { active.focus(); }
  }

  root.addEventListener('click', function (ev) {
    var closer = ev.target.closest('[data-close]');
    if (closer) {
      ev.preventDefault();
      close(true);
      return;
    }

    var step = ev.target.closest('[data-step]');
    if (step) {
      ev.preventDefault();
      open(entryFromHash(step.getAttribute('href')), true);
      return;
    }

    var row = ev.target.closest('.ie-row');
    if (row) {
      ev.preventDefault();
      open(parseInt(row.getAttribute('data-entry'), 10), false);
    }
  });

  /* Escape closes; up/down step through the list while it is focused. */
  root.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && root.classList.contains('is-open')) {
      ev.preventDefault();
      close(true);
      return;
    }

    if (ev.key !== 'ArrowUp' && ev.key !== 'ArrowDown') { return; }
    var row = ev.target.closest('.ie-row');
    if (!row) { return; }

    ev.preventDefault();
    var i = rows.indexOf(row) + (ev.key === 'ArrowDown' ? 1 : -1);
    if (i < 0 || i >= rows.length) { return; }
    rows[i].focus();
    if (root.classList.contains('is-open')) {
      render(parseInt(rows[i].getAttribute('data-entry'), 10));
    }
  });

  window.addEventListener('popstate', function () {
    render(entryFromHash(window.location.hash));
  });

  /* Deep link: /interests/<topic>/#e-3 opens that entry on load. */
  render(entryFromHash(window.location.hash));
}());
