# Dark mode implementation

Not committed — the files below are staged as edits/new files only. Review and
commit them yourself.

## What changed, and why

### 1. A token layer (`_sass/layout/_theme.scss`, new file)

Every color that should differ between light and dark now lives here as a CSS
custom property (`--color-text`, `--global-bg-color`, etc.), emitted by two
Sass mixins (`theme-light`, `theme-dark`). Three selectors decide which one
applies:

```scss
:root { @include theme-light; }                                    // floor
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { @include theme-dark; }          // OS says dark
}
:root[data-theme="dark"] { @include theme-dark; }                   // explicit pin wins
```

An explicit light/dark choice (see the toggle, below) always beats the OS
setting; with no choice made, the OS setting wins; with no CSS custom
properties support at all (there is no such target here, but it's the
fallback), you get light.

### 2. `_sass/layout/_variables.scss` split into two parallel sets

Sass color functions (`mix()`, `lighten()`, `rgba()` with a color argument)
run at *compile* time and can't see a CSS custom property — passing one in is
a hard compile error. So every variable that's an *input* to one of those
functions got a `-lit` (literal) twin:

```scss
$gray-lit  : #7a8288;        // safe inside mix() — a real Sass color
$gray      : var(--color-gray);  // what the rest of the codebase uses
```

The ~100 existing `$gray`/`$text-color`/`$link-color`/etc. references across
the theme were **not touched** — they now resolve through `var()` and
retheme automatically. `$success-color`, `$warning-color`, `$danger-color`,
`$info-color`, and all brand colors (`$facebook-color`, `$github-color`
itself as a literal, etc.) were deliberately left as plain literals — they're
either dormant or genuinely theme-invariant (see below).

This split is also the safety net: if a future edit tries to pass a themed
variable into `mix()`, Sass refuses to compile. That's intentional.

### 3. Hardcoded colors migrated to tokens, file by file

Went through every live (non-dormant) hardcoded color outside `_theme.scss`
and `_variables.scss` and replaced it with a `var(--token)`:

- `_sass/layout/_navigation.scss` — pagination text/disabled/pager grays,
  greedy-nav dropdown background + shadow + hover, the dropdown's inner
  "speech bubble" triangle, `.toc` background and hover text.
- `_sass/layout/_sidebar.scss` — author popup background/shadow/arrow,
  sidebar link hover background.
- `_sass/layout/_base.scss` — inline `<code>` background/text/hover,
  figcaption color and its link-hover color, blockquote left border.
- `_sass/layout/_archive.scss` — hover-image shadow, `.archive__subtitle`,
  `.archive__divider`.
- `_sass/layout/_page.scss` — hover-image shadow, hero-overlay text shadow,
  `.page__meta`.
- `_sass/include/_utilities.scss` — skip-link (see below), social icon
  default/GitHub colors, `.footnotes`, `.well`, the "show more" scrim,
  `.modal` background.
- `_sass/layout/_reset.scss` — text selection color/background.
- `_sass/layout/_buttons.scss` — `.btn--inverse` background (its hover text
  stayed a literal `#fff` — see Corrections below).
- `_sass/layout/_admonitions.scss` — every admonition color (border,
  background, box-shadow, icon mask, title strip, `.note` variant).
- `_sass/layout/_cpds.scss` — `.certificate` background + shadow.
- `_sass/layout/_footer.scss` — dropped a now-redundant CSS fallback value.
- `_sass/layout/_print.scss` — added a light-mode reset inside `@media
  print`, so printing a page never renders in dark colors regardless of the
  visitor's stored choice or OS setting.

Left as **literal on purpose** (checked individually, not skipped):

- `_sass/layout/_forms.scss`, `_sass/layout/_notices.scss` — dormant. No
  `<form>` and no notice block renders anywhere on the site today (only an
  IE-conditional `.notice--danger` exists, never reached). One line in
  `_forms.scss` (a `mix()` against `$primary-color`) was switched to the
  `-lit` variable purely so the file keeps compiling, not because it's live.
- White text on a colored button/badge background (`_buttons.scss`,
  `.nav__list .active`, the greedy-nav dropdown button + its `.navicon`
  hamburger bars in `_navigation.scss`) — the background itself is already
  themed (e.g. `$primary-color`, kept dark enough in dark mode to stay
  ≥5.4:1 against white — see the comment in `_theme.scss`), so the white
  foreground is correct in both themes and isn't a token candidate.
- Hero overlay text and `.page__hero-caption` in `_page.scss` — white text /
  black caption box sit on a background *image*, not the page background, so
  they're theme-invariant. (Also currently dormant: nothing sets
  `header.overlay_image`.)

### 4. The toggle

One `<button data-theme-toggle>` in `_includes/masthead.html`, added as a
**sibling** of `.masthead__menu` — deliberately not inside `#site-nav`,
because `jquery.greedy-navigation.js` does `$btn = $('#site-nav button')` and
a second button in that subtree would corrupt its overflow-width math and
inherit the dropdown click handler.

It cycles **system → light → dark → system** on click. "System" is the
default and stores nothing; picking light or dark writes that choice to
`localStorage['theme-choice']` and pins it (`<html data-theme="light|dark">`)
until cycled back to system. Three inline SVG icons (circle-half / sun /
moon) live inside the button; CSS shows exactly one, keyed off
`[data-theme-choice]` on `<html>`.

Logic lives in `assets/js/theme-toggle.js` (new file, NOT excluded from the
Jekyll build — unlike `_main.js`/`plugins/`/`vendor/`, this path ships as-is,
so there's no npm rebuild step for this particular file). It also flips the
two `<meta name="theme-color">` tags in `_includes/head/custom.html` so
mobile browser chrome matches, and listens for `matchMedia` changes so a
reader left on "system" follows their OS live (e.g. an OS dark-mode schedule)
without reloading.

A second, tiny inline script in `_includes/head.html`, run before the
stylesheet loads, sets `data-theme-choice`/`data-theme` from `localStorage`
immediately — this is what prevents a flash of the wrong theme on load. It
has to be hand-kept in sync with `theme-toggle.js` (same storage key, same
attribute names) since it's a separate, deliberately tiny piece of code.

CSS for the button (sizing, icon visibility, hover, focus ring, and the
padding reserved on `.masthead__inner-wrap` so it doesn't overlap the nav)
lives in `_sass/layout/_theme.scss` under "THEME TOGGLE".

### 5. Figures stay light

Inverting or hue-rotating figures on a dark background would misrepresent
the actual data in them, so figures are never themed — instead they get a
light "card" backdrop in dark mode only:

```scss
.item__logo img,
.page__content figure img,
.page__content p > img:only-child {
  background-color: var(--figure-card-bg);   // transparent in light, #eef0f1 in dark
  padding: var(--figure-card-pad);           // 0 in light, 0.75em in dark
  border-radius: var(--figure-card-radius);  // 0 in light, themed radius in dark
}
```

All three properties are inert (0/transparent) in light mode, so light output
is byte-for-byte unchanged. `p > img:only-child` targets a markdown image
that's a paragraph on its own (a real figure) while leaving inline
shields.io/pepy/codecov badges alone, since those sit in a `<p>` alongside
other content.

`_includes/archive-single.html` got one small change to make this
selectable: `post.logo` in the `tools` and `research` branches is now wrapped
in `<span class="item__logo">…</span>` so `.item__logo img` can target those
collection logos specifically, without touching the inline badge `<img>`s
that sit in the same paragraph.

### 6. A real accessibility fix, incidentally

The skip-link (`_sass/include/_utilities.scss`) had no explicit `color` at
all — it inherited whatever `body { color }` happened to be. It now has an
explicit `--color-skiplink-text` token, so it stays legible in both themes
instead of by accident.

## Corrections made while implementing

- `.btn--inverse:hover` — I first themed its text color, then reverted it.
  `.btn:hover` (the un-prefixed base rule) forces a **hardcoded** `#333`
  background in both themes, so white hover text is correct in both — theming
  it would have made it illegible against that fixed dark background in
  light mode.
- `.certificate` background — first set to `var(--color-surface)`, then
  corrected to `var(--color-popup-bg)`. `--color-surface` is `#fafafa` in
  light mode, not `#fff`; using it would have silently shifted light mode's
  pixel output, which is a hard constraint here.

## Files touched

New: `_sass/layout/_theme.scss`, `assets/js/theme-toggle.js`.

Modified: `_includes/{head.html, head/custom.html, masthead.html,
scripts.html, archive-single.html}`, `assets/css/main.scss`,
`_sass/layout/{_variables.scss, _navigation.scss, _sidebar.scss, _base.scss,
_archive.scss, _page.scss, _reset.scss, _buttons.scss, _admonitions.scss,
_cpds.scss, _footer.scss, _print.scss, _forms.scss, _notices.scss}`,
`_sass/include/_utilities.scss`.

No content files (`_publications`, `_talks`, `_research`, `_tools`,
`_teaching`, `_pages`) were touched. No URLs changed.

## What's *not* verified yet

I could not run an actual Sass compile in this session (see below) — the
architecture was checked statically instead:

- Grepped every non-vendor `.scss` partial for a themed (`var()`-backed)
  variable used inside a build-time color function
  (`mix|lighten|darken|rgba|...`) — none found, so nothing should fail to
  compile for that reason.
- Confirmed the 15 `-lit` variables referenced across the codebase exactly
  match the 15 defined in `_variables.scss` — no typo'd or missing token.
- Walked every remaining literal hex/`rgba()`/`white`/`black` outside
  `_theme.scss`/`_variables.scss` and classified each as dormant,
  theme-invariant, or migrated (see section 3, above).

None of that is a substitute for actually compiling and looking at the page.
See below for how to do that.
