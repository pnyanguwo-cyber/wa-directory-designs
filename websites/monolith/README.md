# Monolith

Bold single-brand statement layout for service businesses on wa.directory. The hero can
go full-bleed immersive with copy overlaid on cover imagery, sections flow as a single
scroll (stats → services → shop → gallery → reviews → FAQ → hours → contact), and every
block adapts to the business's per-section light/dark backgrounds.

## Layout

- `orientation: "immersive"` — full-bleed cover hero with overlaid copy (default).
- `orientation: "stacked"` — media above copy in a single column.

## Structure

```
theme/
  types.ts    # ThemeSiteView contract (mirrors wa.directory site-view.ts)
  lib.tsx     # derivations (money, links, hours, status) + shared atoms
  index.tsx   # the full-page Server Component render
  theme.css   # all styles, scoped under .mono-root
```

`app/page.tsx` renders the theme against `shim/site.ts`'s `buildSampleSiteView`, which
derives a full `ThemeSiteView` from the JSON under `data/`.

## Theme contract

The component takes `ThemeProps = { site, orientation?, mode? }`. All data comes from
`site`; nothing is fetched. `mode` is informational only (`"preview" | "live"`).

## Self-contained rules

- No Tailwind utilities in theme JSX — only the `mono-*` classes defined in
  `theme.css`, all scoped under `.mono-root`.
- Plain `<img>` tags, Server Component (no `'use client'`), no third-party imports.
- The only external contract is `ThemeSiteView` (plus `ThemeItem`,
  `ThemeTestimonial`, …), which mirrors wa.directory's `buildSiteView` output.

## Fonts

`theme` uses `var(--mono-head)` / `var(--mono-body)`, set inline from
`site.fontPair.head/body`. In the standalone sandbox those variables resolve to
`var(--font-*)` references applied by `next/font/google` on `<html>` — so
`npm install && npm run build` fetches Google Fonts at build time and needs network
access. Inside wa.directory the same variables are provided by the host app.

## Running

```sh
npm install
npm run dev
```

## Known limitations

- `View profile` links point at wa.directory profile URLs (`/biz/<slug>`), which 404
  when the theme is run standalone.
- Preview PNGs (`theme.json → preview`) are not captured yet.

## Sample data variants

`shim/site.ts → buildSampleSiteView(variant)` supports:

- `rich` — full content (default).
- `bare` — minimal business, empty collections, voice-only (tel: everywhere).
- `long` — 50 items to stress the shop grid and `View all` overflow.
