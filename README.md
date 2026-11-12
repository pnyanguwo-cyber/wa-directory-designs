# wa-directory-designs

Design workspace for the switchable business-website themes that ship inside
[wa.directory](https://wa.directory). Each folder under `websites/` is a fully
self-contained Next.js app that renders one theme against realistic sample data,
so a theme can be designed, reviewed and tested without touching the main app.

## Themes

| Theme | Orientations | Cart | Best for |
| --- | --- | --- | --- |
| `atlas` | `split`, `stacked` | No (per-item WhatsApp order links) | Service businesses with a product shelf |
| `monolith` | `immersive`, `stacked` | No | Bold single-brand statements, galleries |
| `market` | `catalogue`, `compact` | Yes (`useBusinessCart`) | Retail shops with large catalogues |

## Layout

```
websites/<theme>/        standalone Next.js 14 app per theme
  app/                   preview host (layout, page, globals.css)
  shim/                  stand-ins for wa.directory modules (site data, fonts, cart)
  theme/                 THE THEME ITSELF — this folder is what ships
  data/                  sample business JSON (rich / bare / long variants)
  theme.json             theme manifest consumed by the wa.directory registry
shared/                  cross-theme reference docs (tokens, sample-data contract)
```

## The contract

A theme component receives `ThemeProps`:

```ts
type ThemeProps = {
  site: ThemeSiteView   // structural mirror of wa.directory's SiteView
  orientation?: string  // e.g. 'split' | 'stacked'
  mode?: 'preview' | 'live'
}
```

`theme/types.ts` in each theme mirrors the real `SiteView` (`lib/site-view.ts`
in wa.directory) structurally — every field name, nullability and shape is
verified against the source. When a theme folder is copied into
`wa.directory/themes/<id>/`, it compiles against the real types with zero
adapter code because TypeScript accepts structural matches.

Hard rules for every theme:

- **No Tailwind utility classes in theme JSX.** The wa.directory build does not
  include `themes/` in its Tailwind content globs, so all styling lives in the
  theme's own `theme/theme.css`, scoped under a root selector such as
  `[data-theme="atlas"]`.
- **Plain `<img>` tags, not `next/image`.** The wa.directory image config only
  whitelists Supabase Storage; themes must render any https URL the business
  supplies.
- **No runtime dependencies beyond React.** Themes may use Server Components
  only (Atlas, Monolith) or a single `useBusinessCart` context hook (Market).
  No framer-motion, no icon libraries, no client state beyond the cart context.

## Developing a theme standalone

```bash
cd websites/atlas
npm install
npm run dev
```

Then open:

- `/` — rich sample (full data: shop, reviews, hours, gallery, socials)
- `/?variant=bare` — voice-only business with empty states (no items, no gallery)
- `/?variant=long` — stress test: 80-char name, 50 items, dark shop, serif font
- `/?orientation=stacked` — force the alternate orientation

## Integrating into wa.directory

1. Copy `websites/<theme>/theme/` into `wa.directory/themes/<theme>/`.
2. Copy `theme.json` alongside it.
3. Register the theme in `wa.directory/registry/websites.ts`:

```ts
{
  id: 'atlas',
  name: 'Atlas',
  // ...meta
  load: () => import('@/themes/atlas'),
}
```

The portal's theme gallery, the preview route (`/site-preview/[slug]`), the
live renderer (`/site/[slug]`) and the portal save endpoint all pick the theme
up automatically from the registry.

## Sample data variants

`shared/sample-data.md` documents the JSON contract and the three variants
(rich / bare / long). `shared/tokens.css` documents the colour, contrast and
wash tokens every theme derives from the incoming data.
