(function () {
  var STORAGE_KEY = 'theme';
  var btn = document.getElementById('theme-toggle');

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getEffectiveTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'auto';
  }

  function applyTheme(stored) {
    var root = document.documentElement;
    if (stored === 'light') {
      root.setAttribute('data-theme', 'light');
    } else if (stored === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  function toggle() {
    var stored = getEffectiveTheme();
    var system = getSystemPreference();
    var current = stored === 'auto' ? system : stored;

    // light → auto (follows system), dark → light
    // If system is dark: auto=dark, clicking goes light
    // If system is light: auto=light, clicking goes dark
    var next;
    if (current === 'dark') {
      next = 'light';
    } else {
      // current is light (either forced or system) → go to auto if system is dark, else dark
      next = system === 'dark' ? 'auto' : 'dark';
    }

    if (next === 'auto') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, next);
    }
    applyTheme(next);
  }

  applyTheme(getEffectiveTheme());

  if (btn) {
    btn.addEventListener('click', toggle);
  }

  // React to system preference changes when user hasn't overridden
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme('auto');
    }
  });
})();
