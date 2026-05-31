// Manual theme toggle for thinkit.
// Default is the hacker (green) theme; the toggle opts into a brighter
// (light) theme and remembers the choice in localStorage.
// Loaded from <head> as an external script (the page CSP blocks inline JS).
(function () {
  "use strict";
  var KEY = "thinkit-theme";
  var root = document.documentElement;

  function apply(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme"); // hacker green is the default
    }
  }

  function current() {
    return root.getAttribute("data-theme") === "light" ? "light" : "hacker";
  }

  function label(theme) {
    // Show the action the button performs, not the current state.
    return theme === "light" ? "[ green ]" : "[ brighter ]";
  }

  // Apply the saved preference immediately (runs during <head> parse, before
  // first paint) so there is no flash of the wrong theme.
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  apply(saved);

  function bind() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.textContent = label(current());
    btn.addEventListener("click", function () {
      var next = current() === "light" ? "hacker" : "light";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      btn.textContent = label(current());
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
