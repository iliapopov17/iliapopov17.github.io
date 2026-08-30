# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal academic homepage: Jekyll site, hard-forked from
[academicpages](https://github.com/academicpages/academicpages.github.io) (itself a fork of
minimal-mistakes) at a single flat "Initial commit" (`d0602fe`, 2024-04-05) with no upstream merge
history. There is no way to `git diff` against upstream from inside this repo — you'd have to clone
academicpages separately.

Deployed as a **user Pages site**: GitHub builds `main` of `ilypopv/ilypopv.github.io` automatically
with its own hosted Jekyll pipeline. There is no CI, no workflow file, no CNAME. **A push to `main`
is a push straight to production**, with no gate.

## Commands

```bash
bundle install                              # first run; no Gemfile.lock is committed
bundle exec jekyll serve -l -H localhost    # local dev with livereload
bundle exec jekyll liveserve                # alternative livereload, via the hawkins gem
```

Always use `bundle exec` — a bare `jekyll` uses whatever is on PATH instead of the version the
floating `github-pages` gem pins, which is what actually builds the live site.

JS bundle (only needed when touching JS — see the footgun below):

```bash
npm install          # required: the build concatenates node_modules/jquery/dist/jquery.min.js
npm run build:js     # regenerates assets/js/main.min.js
npm run watch:js     # rebuild on change
```

**There is no test suite, no linter, and no CI** — no Rakefile, no spec/, no `npm test`, no
`.rubocop`/`.eslintrc`/`.editorconfig`, no `.github/`. The codecov badges (commit `e106cb2`) are
*content*: `_tools/tool-{4,5}.md` front matter pointing at the author's separate Python packages,
rendered as portfolio decoration. They say nothing about this site. Verification here means looking
at the rendered page locally.

`README.md` documents none of the above — it is fork attribution and a preview image only.

## Footguns

- **`_config.yml` is not hot-reloaded.** Edit it and the running server keeps serving the old
  values. Restart the process. (`_config.yml:5-7` says so.)
- **`assets/js/main.min.js` is a hand-maintained build artifact committed to git.** Jekyll never runs
  the JS bundler and there is no CI to catch drift, while `_config.yml:164-166` excludes
  `assets/js/_main.js` and `assets/js/plugins/` from the output. So editing `_main.js` or any plugin
  has *zero* effect until you run `npm run build:js` and commit the regenerated bundle. This has
  already bitten once: `b7a3b74` edited `jquery.greedy-navigation.js` without rebuilding, shipping
  stale JS until the next commit.
- **Adding a gem does not add a plugin on GitHub Pages.** The hosted builder ignores the Gemfile and
  the `plugins:`/`whitelist:` keys in `_config.yml` — it loads only the fixed plugin set the
  `github-pages` gem bundles. A new plugin will work locally via bundler and be silently absent in
  production. (Note `jekyll-redirect-from` is in `plugins:` but missing from `whitelist:`; that's a
  stale doc, not an active block — it works live because `github-pages` bundles it.)
- **There is no `.gitignore`.** One existed at the initial commit and was deleted in `d9f1791`. A
  `bundle install` drops an untracked `Gemfile.lock`, a build drops `_site/`, `npm install` drops
  `node_modules/` — nothing filters them out. Don't `git add -A` blindly.
- **Analytics only fires in production.** `_includes/analytics.html` gates on
  `jekyll.environment == "production"`, which GitHub Pages sets and local serve does not. Missing GA4
  hits locally is expected.
- **HTML compression is production-only too.** `_layouts/compress.html` is skipped when
  `jekyll.environment` is `development` (`compress_html.ignore.envs`), so local output looks
  different from live. In this config only the `clippings` step does anything.
- Gemfile carries running Ruby-compatibility patches: `webrick` (Ruby ≥3.0 dropped it from stdlib,
  `jekyll serve` needs it), plus `csv` and `bigdecimal` (`fe30692` — Ruby 4.0 dropped them; Jekyll
  3.9 / Liquid 4.0.3 use them without declaring the dependency). Expect to repeat this pattern as
  Ruby keeps unbundling default gems.

## Content architecture

Five collections in `_config.yml:202-217`, all sharing `permalink: /:collection/:path/`, each with
its own `defaults` block (`_config.yml:220-283`): `_publications` (22 items), `_talks` (9),
`_research` (8), `_tools` (4), `_teaching` (4), plus `_pages` (11).
**They do not share front-matter conventions** —
read the target collection's existing files before adding to it, and prefer copying its *newest*
file as the template.

Only two rendering templates serve all five:

- `_includes/archive-single.html` — used by `publications.md`, `research.html`, `teaching.html`,
  `tools.html`. One file with a long `{% elsif post.collection == '...' %}` chain (lines 32-181),
  a separate branch per collection. This is the most-edited include in the repo (38 commits).
- `_includes/archive-single-talk.html` — talks only, structurally separate.

`_includes/archive-certificates-grid.html` is **not** a collection renderer. `/certificates/`
(`_pages/cpds.md`) stores its data as plain YAML arrays in its own front matter (`cpds.en`,
`cpds.ru`) and passes them to the include as an `items` param. There is no `_certificates`
collection; searching for one is a dead end.

### Sort order is driven by filenames, not dates

`_publications`, `_research`, and `_tools` items have **no `date:` key at all**. Jekyll's document
comparator therefore falls back to comparing file paths, so display order is purely the filename
convention — and since Jekyll doesn't strip date prefixes from `:path` for non-`_posts` collections,
the filename is also the URL. Consequences:

- Renaming a publication's date prefix silently changes both its position on `/publications/` and its
  permalink, breaking external links.
- `_research`/`_tools` use bare `research-N.md` / `tool-N.md` and their listing pages loop *without*
  `reversed`, so correct chronology depends entirely on someone keeping N monotonic. Nothing
  structurally enforces it. (`tool-1.md` doesn't exist — a renumbering gap.)
- `_talks` *do* carry a real `date:`, which is what sorts them — independent of the filename. They
  already disagree: `_talks/2024-11-24-talk-5.md` has `date: 2025-02-22` and sorts as a Feb-2025 talk.

`future: true` (`_config.yml:81`) only gates items that have a `date:` — so it affects `_talks` but
not `_publications`. There is no draft mechanism: no `_drafts`, no `published: false` anywhere.

### Front-matter templates

Publications — filename `YYYY-MM-DD-paper-N.md`, which sets both slug and sort position:

```yaml
title: "..."            # HTML allowed, e.g. <i>Genus species</i>
collection: publications
paperurl: '...'         # often /files/Papers/<title>.pdf, unencoded spaces and all
authors: '...'          # HTML: <b>Popov I.V.</b> to bold self
journal: '...'
year: 2026
doi: '...'              # optional but expected; drives the shields.io badge
github: '...'           # optional -> renders a "Data Analysis Repo" link
code: '...'             # optional -> renders a "Code" link. NOT an alias for github:
```

`github:` and `code:` are separate branches in `archive-single.html:162-175` producing *different
link text* ("Data Analysis Repo" vs "Code"). Copy-pasting the wrong historical file gets you the wrong label. There is no bibtex or
`citation:` convention — this fork dropped upstream's entirely in favour of the DOI badge.

Talks — filename `YYYY-MM-DD-talk-N.md`; uses `_layouts/talk.html`, not `single`:

```yaml
title: "..."
collection: talks
venue: "..."
conference: "..."
date: 2025-10-25       # this, not the filename, drives sort order
location: "..."
```

Talk permalinks are inconsistent by accident: talks 1-3 set an explicit `permalink:` with **no
trailing slash** (and 404 with one), talks 4-6 carry a commented-out `#permalink:` line all three
stale-pointing at talk-4's slug, talks 7-9 have none. Copy from talks 7-9 and let the default apply.
Don't uncomment the leftover line — it is not a fill-in-the-blank placeholder.

Research (`research-N.md`) and Tools (`tool-N.md`) have non-overlapping key sets:

```yaml
# _research                          # _tools
title: "..."                         title: "..."
collection: research                 collection: tools
from: 2025-04-01                     about: "..."
to: 2025-04-01                       status: "Released"
info: "... [link](url)"              downloads: "https://pepy.tech/projects/<name>"
venue: "..."                         version: "https://pypi.org/project/<name>/"
logo: "<img src='/images/research/X.png' width='500px'>"
external_url: https://...            stars: "https://github.com/<o>/<r>/stargazers"   # optional
                                     codecov: "https://codecov.io/gh/<o>/<r>"         # optional
                                     doi: "..."                                       # optional
                                     logo: "<img src='/images/tools/x.png' width='500px'>"
                                     external_url: https://...
```

The tools badges are built by brittle Liquid string-splits on those URLs (`archive-single.html:85-100`
— e.g. `split: '/projects/' | last` for pepy, `split: '/project/' | last | remove: '/'` for PyPI,
`split: 'github.com/' | last | split: '/stargazers' | first` for stars). New items **must** match
those exact URL shapes or the badges silently break. Note `logo:` is a raw `<img>` tag inside a YAML string, not a
`header.teaser` — the theme's teaser/grid codepath is unused by every item in every collection.

All four teaching items set an explicit, free-form `permalink:` with no trailing slash — one is
`/NGS-Handbook`, unrelated to `/teaching/`. Omitting the key silently moves a bookmarked URL.

Assets: PDFs under `files/<Category>/` (`Papers/`, `Conferences/`, `Lectures/`, `cpds/{EN,RU}/{pdfs,pngs}/`),
per-item images under `images/<collection>/<slug>.png`.

## Templates and styles

Layout chain is front-matter only: `single.html` / `archive.html` / `talk.html` → `default.html` →
`compress.html`. `compress.html` is never `{% include %}`d — it runs because it's top of the chain,
and should not be touched. `talk.html` exists purely so `_talks` gets a simple header without adding
another branch to `single.html`'s already-tangled collection chain; note the talks *listing*
(`_pages/talks.html`) uses `layout: archive`, not `talk`.

`{% include base_path %}` appears at the top of ~15 files because Liquid `assign`s from an include
don't persist into the parent scope — each file that builds an absolute URL re-runs it locally. This
is deliberate, not duplication. (`_includes/category-list.html` does have a genuine accidental
double-include on lines 1 and 3.)

Author sidebar links come straight from the `author:` block in `_config.yml` via ~35 bare
`{% if author.<field> %}` guards in `_includes/author-profile.html`. Blanking a YAML value is the
entire mechanism for hiding a link — that's all commit `0885275` did to drop ResearchGate. Icons are
hardcoded `<i class="fab fa-...">` tags in that include (and in `archive-single.html`), Font Awesome
5.5.0 plus Academicons, self-hosted from **`assets/fonts/`** (matching `$fa-font-path: "../fonts"`).
`_data/navigation.yml` has no `icon:` field in this fork — the top nav is text only.

SCSS entry is `assets/css/main.scss` (its empty front matter is what makes Jekyll compile rather than
copy it). Import order matters: `vendor/breakpoint` first because `_variables.scss:129` calls
`breakpoint-set()`, then `layout/variables` because every later partial consumes its variables.

`_sass/layout/_variables.scss` is the single knob file for fonts, colors, breakpoints, and
`$masthead-height`. Every font variable currently aliases the same `"IBM Plex Mono"` literal, and a
comment at lines 15-23 documents reverting to Inter — which also requires editing the Google Fonts
`<link>` in `_includes/head.html` (not `head/custom.html`), where the weight list is hardcoded.

Owner-authored surface, safe to edit freely: `_sass/layout/_cpds.scss`, `_pages/cpds.md`,
`_includes/archive-certificates-grid.html`, `_admonitions.scss`, the `_research` and `_tools`
collections. Upstream theme machinery patched in place, so edit knowing upstream idioms sit
underneath: `_includes/archive-single.html`, `_sass/layout/_masthead.scss` and `_sidebar.scss`,
`_layouts/single.html` and `default.html`, `_includes/head.html` and `sidebar.html`. `_sass/vendor/`
(breakpoint, Font Awesome, magnific-popup, susy) is untouched third-party code — override via
`_variables.scss`, never in place.

## Known dead and dormant code

Distinguish three kinds before "cleaning up":

- **Loaded on every page but entirely unused**: `_includes/head/custom.html:12-26` pulls in MathJax
  2.7.4 from a CDN plus two config blocks, and no content anywhere on the site uses LaTeX. The same
  file loads `assets/css/academicons.css` — a separate, unminified stylesheet outside the Sass
  pipeline, with a webfont in four formats and no woff2, for 2 icons.
- **Genuinely orphaned** — no call site at all: `_includes/group-by-array`,
  `_includes/post_pagination.html` (no `_posts` dir, pagination commented out),
  `_includes/analytics-providers/google.html` and `google-universal.html` (superseded by
  `google-analytics-4.html`), `_pages/terms.md` (stock boilerplate, untouched since the initial
  commit, unlinked from nav), and the `talkmap_link` flag plus its `{% if %}` block in
  `_pages/talks.html:8-10` — the entire `talkmap/` directory it points at was deleted.
- **Config-gated, fully wired, would work if switched on**: all of `comments.html` +
  `_includes/comments-providers/` (provider is blank), `breadcrumbs.html`
  (`site.breadcrumbs: false`). Note the `_research`/`_tools` defaults set `comment: true` singular —
  a no-op typo; the theme checks `page.comments`.
- **Data-gated, inert because no content opts in**: `page__hero.html` and `single.html`'s TOC sidebar
  (nothing sets `header:` or `toc:`), and the teaser/grid codepath in `archive-single.html`.

Two real quirks worth knowing before you "fix" them:

- `_layouts/default.html:12-31` hardcodes a second full `<title>`/`og:*`/`twitter:*` block *after*
  including `head.html` → `seo.html`, which already emits its own. Every page ships two `<title>`
  elements. It's a workaround: `seo.html`'s og:image logic only keys off
  `page.header.og_image`/`overlay_image`/`site.og_image`, all of which are empty here, so without the
  static block the site would have no social preview image at all. Removing it needs `site.og_image`
  set instead.
- `_layouts/single.html:30-33` tests `post.read_time`, but `post` is undefined in that scope (it's
  `page`). Doubly dormant: `read_time: true` is only set under the `_posts` defaults and there are no
  `_posts`. Fixing the variable name alone changes nothing.
- `_includes/toc` (no extension, a 7-line kramdown wrapper used by `_pages/terms.md:8`) and
  `_includes/toc.html` (~300-line vendored jekyll-toc plugin used by `single.html:94`) are unrelated
  files. Don't conflate them when auditing.

## Commits

The convention switched on 2026-05-07: ~640 earlier commits are terse lowercase (`fix header`,
`upd cv`, `add paper 19`), every commit since uses **Conventional Commits** with optional scope
(`feat(navigation):`, `chore(config):`, `build(config):`, `refactor:`, `fix:`). Follow the current
convention, not the historical majority.
