# AGENTS.md

Jekyll academic homepage — hard fork of `academicpages/academicpages.github.io` (minimal-mistakes). No upstream history (`d0602fe`). User Pages site: GitHub builds `main` directly, no CI/workflows/CNAME. Push to `main` = production.

For deep context see `CLAUDE.md`; for dark-mode architecture see `DARK.md`.

## Commands

```bash
bundle install                              # Gemfile uses floating `github-pages` gem
bundle exec jekyll serve -l -H localhost    # dev with livereload (always `bundle exec`)
bundle exec jekyll liveserve                # alt livereload via hawkins gem
npm install                                 # only needed for JS bundle (jquery)
npm run build:js                            # rebuild assets/js/main.min.js
npm run watch:js                            # rebuild on change
```

No tests, linter, `npm test`, `.github/`, or Rakefile. Verify by viewing rendered page locally.

## Build / deploy gotchas

- **`_config.yml` not hot-reloaded** — restart server after edits (`_config.yml:5-7`).
- **`assets/js/main.min.js` is a committed artifact.** `_config.yml:164-171` excludes `assets/js/_main.js`, `plugins/`, `vendor/` from Jekyll output. Editing them does nothing until `npm run build:js` and committing the bundle. `assets/js/theme-toggle.js` is the exception — not excluded, ships as-is, no rebuild needed.
- **New Jekyll plugins won't run in production.** GitHub Pages ignores `Gemfile` and `plugins:`/`whitelist:` — only the fixed `github-pages` set loads. Works locally, silently absent live.
- **Untracked build artifacts.** `.gitignore` exists but does **not** ignore `_site/`, `Gemfile.lock`, or `node_modules/`. Don't `git add -A`.
- **Env-gated features:** GA4 (`_includes/analytics.html`) and HTML compression (`_layouts/compress.html`) only run when `jekyll.environment == "production"` (GitHub Pages sets this, local serve does not).
- **Ruby compat shims in `Gemfile`:** `webrick` (Ruby ≥3.0), `csv`+`bigdecimal` (Ruby 4.0). Expect more as stdlib gems are unbundled.
- **Favicons are same-origin with `/NGS-Handbook`.** `ilypopv.github.io/NGS-Handbook` is a separate repo/project site on the same origin `https://ilypopv.github.io`. Browsers cache favicons & bookmark icons per-origin, not per-path — `manifest.json` `scope: "/"` (main) vs `scope: "/NGS-Handbook/"` + explicit `<link rel="icon">` only improve hit-rate, cannot fully isolate. True isolation needs a custom domain. Bump `?v=` in `_includes/head/custom.html` + `images/manifest.json` + `images/browserconfig.xml` together when changing favicons. Deleted `android-chrome-*`/`mstile-*` PNGs are not needed. Note: browsers also implicitly fetch `/favicon.ico` at root regardless of `<link>` — single source is `images/favicon.ico`; no duplicate at `/favicon.ico` is kept.

## Content

Five collections in `_config.yml:202-283`, all `permalink: /:collection/:path/` with separate `defaults`: `_publications` (22), `_talks` (9), `_research` (8), `_tools` (4), `_teaching` (4), plus `_pages` (11). Front matter conventions differ per collection — copy the **newest** file in the target collection as template.

**Sort order is filename-driven, not `date:`:**

- `_publications`/`_research`/`_tools` have no `date:` — Jekyll sorts by file path. Renaming changes order **and** permalink (breaks links). `_research`/`_tools` use `research-N.md`/`tool-N.md` without `reversed`; `tool-1.md` is a gap. Keep `N` monotonic.
- `_talks` sorted by `date:` front matter, not filename (they already disagree, e.g. `2024-11-24-talk-5.md` has `date: 2025-02-22`).
- `future: true` only affects dated collections (`_talks`). No `_drafts` or `published: false`.

**Front-matter quick refs:**

- Publications `YYYY-MM-DD-paper-N.md`: `title` (HTML allowed), `collection: publications`, `paperurl`, `authors` (`<b>Popov I.V.</b>`), `journal`, `year`, `doi` (badge), `github` ("Data Analysis Repo") vs `code` ("Code") — distinct branches in `archive-single.html:162-175`.
- Talks `YYYY-MM-DD-talk-N.md`, `layout: talk`: `title`, `collection: talks`, `venue`, `conference`, `date`, `location`. Copy talks 7-9 (no `permalink:`); talks 1-3 have no-trailing-slash permalinks, 4-6 have stale commented `#permalink:`.
- Research `research-N.md`: `from`/`to`, `info` (markdown link), `venue`, `logo` (raw `<img>` tag), `external_url`.
- Tools `tool-N.md`: `about`, `status`, `downloads` (`https://pepy.tech/projects/<name>`), `version` (`https://pypi.org/project/<name>/`), `stars`/`codecov`/`doi`/`logo`/`external_url`. Badge URLs must match exact shapes or Liquid splits in `archive-single.html:85-100` break.
- Teaching: explicit free-form `permalink:` (one is `/NGS-Handbook`) — omitting moves URL.
- Assets: PDFs `files/<Papers|Conferences|Lectures|cpds/...>/`, images `images/<collection>/`.

**Rendering:** `_includes/archive-single.html` serves 4 collections via `elsif post.collection` chain (lines 32-181); `_includes/archive-single-talk.html` is talks-only. `/certificates/` (`_pages/cpds.md`) is **not** a collection — data is YAML arrays `cpds.en`/`cpds.ru` in front matter passed to `_includes/archive-certificates-grid.html`.

## Templates & styles

- Layout chain via front matter: `single.html`/`archive.html`/`talk.html` → `default.html` → `compress.html` (never `{% include %}`d; top of chain). `_layouts/default.html:12-31` intentionally duplicates `<title>`/og tags after `seo.html` to provide `og:image`.
- `{% include base_path %}` repeated in ~15 files is intentional (Liquid `assign` doesn't persist). `_includes/category-list.html:1,3` has a real duplicate.
- Author sidebar: `author:` block in `_config.yml` → ~35 guards in `_includes/author-profile.html`; blank value hides link. Icons are hardcoded Font Awesome 5.5.0 + Academicons from `assets/fonts/`.
- SCSS entry `assets/css/main.scss` (empty front matter triggers compile). Import order: `vendor/breakpoint` → `layout/variables` → `layout/theme` → rest. Single knob: `_sass/layout/_variables.scss`. Font is `IBM Plex Mono` everywhere; changing requires editing Google Fonts `<link>` in `_includes/head.html` (not `head/custom.html`).
- Dark mode (`DARK.md`): tokens in `_sass/layout/_theme.scss` (`theme-light`/`theme-dark` mixins), literal `-lit` twins for `mix()`/`lighten()` inputs, toggle cycles `system → light → dark` via `localStorage['theme-choice']` + `matchMedia` listener. Figures get a light card in dark mode only.

## Workflow

- Commits since 2026-05-07 use Conventional Commits (`feat:`, `fix:`, `chore(config):`, `build:`). Earlier ~640 commits are terse lowercase — follow the new convention.
