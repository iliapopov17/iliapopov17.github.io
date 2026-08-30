/*
 * Three-state theme toggle: system -> light -> dark -> system.
 *
 * "system" is the default and means: follow prefers-color-scheme, live, with
 * nothing persisted. Only an explicit light/dark choice is stored, and it is
 * stored as the choice ("light") rather than a resolved theme, so a reader on
 * "system" who changes their OS setting is followed rather than pinned.
 *
 * First paint is handled by a small inline script in _includes/head.html, which
 * must stay in sync with the STORAGE_KEY and attribute names below.
 *
 * NOTE: this file is served as-is. _config.yml excludes assets/js/_main.js,
 * assets/js/plugins/ and assets/js/vendor/ from the build — not this path — so
 * there is no npm step and nothing to rebuild. Do not move it into plugins/.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'theme-choice';
  var CHOICES = ['system', 'light', 'dark'];

  var LABELS = {
    system: 'Theme: follow system. Activate for light.',
    light: 'Theme: light. Activate for dark.',
    dark: 'Theme: dark. Activate to follow system.'
  };

  var root = document.documentElement;
  var button = document.querySelector('[data-theme-toggle]');
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function readChoice() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      if (CHOICES.indexOf(stored) !== -1) {
        return stored;
      }
    } catch (e) {
      /* Private mode, disabled storage, blocked third-party context. The
         toggle still works for the session; it just will not persist. */
    }
    return 'system';
  }

  function writeChoice(choice) {
    try {
      if (choice === 'system') {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, choice);
      }
    } catch (e) {}
  }

  /*
   * Mobile browser chrome. Two media-scoped <meta name="theme-color"> tags
   * cover the system case with no JS at all; an explicit choice is applied by
   * rewriting their media queries so exactly one can ever match. That keeps
   * the no-JS path correct instead of relying on JS to set the initial value.
   */
  function syncThemeColor(resolved) {
    var metas = document.querySelectorAll('meta[name="theme-color"][data-scheme]');
    for (var i = 0; i < metas.length; i++) {
      var meta = metas[i];
      var scheme = meta.getAttribute('data-scheme');
      if (resolved === null) {
        meta.setAttribute('media', '(prefers-color-scheme: ' + scheme + ')');
      } else {
        meta.setAttribute('media', scheme === resolved ? 'all' : 'not all');
      }
    }
  }

  function apply(choice) {
    root.setAttribute('data-theme-choice', choice);

    if (choice === 'system') {
      root.removeAttribute('data-theme');
      syncThemeColor(null);
    } else {
      root.setAttribute('data-theme', choice);
      syncThemeColor(choice);
    }

    if (button) {
      button.setAttribute('aria-label', LABELS[choice]);
      button.setAttribute('title', LABELS[choice]);
    }
  }

  var current = readChoice();
  apply(current);

  if (button) {
    button.addEventListener('click', function () {
      current = CHOICES[(CHOICES.indexOf(current) + 1) % CHOICES.length];
      writeChoice(current);
      apply(current);
    });
  }

  /* Follow the OS live while on "system" — a reader whose machine flips at
     sunset should not have to reload. */
  if (media) {
    var onSystemChange = function () {
      if (current === 'system') {
        apply('system');
      }
    };
    if (media.addEventListener) {
      media.addEventListener('change', onSystemChange);
    } else if (media.addListener) {
      media.addListener(onSystemChange);
    }
  }
})();
