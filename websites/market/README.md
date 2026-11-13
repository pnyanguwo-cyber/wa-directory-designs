# Market

Storefront-style layout for goods-and-service businesses on wa.directory. A slim
sticky header opens into a hero that pairs copy with a photo collage, then the page
flows stats → shop → services → gallery → reviews → FAQ → hours → contact, with a
floating cart bar and drawer for WhatsApp ordering.

## Layout

- `orientation: "catalogue"` — hero copy beside a main-photo + side-cell collage (default).
- `orientation: "stacked"` — media above copy in a single column.

## Structure

```
theme/
  types.ts    # ThemeSiteView contract (mirrors wa.directory site-view.ts)
  lib.tsx     # derivations (money, links, hours, status) + shared atoms
  index.tsx   # the full-page Server Component render
  cart.tsx    # 'use client' island: floating cart bar + drawer (wa.me checkout)
  theme.css   # all styles, scoped under .market-root
```

`app/page.tsx` renders the theme against `shim/site.ts`'s `buildSampleSiteView`, which
derives a full `ThemeSiteView` from the JSON under `data/`.

## Theme contract

The component takes `ThemeProps = { site, orientation?, mode? }`. All data comes from
`site`; nothing is fetched. `mode` is informational only (`"preview" | "live"`).

## Self-contained rules

- No Tailwind utilities in theme JSX — only the `market-*` classes defined in
  `theme.css`, all scoped under `.market-root`.
- `index.tsx` is a Server Component; `theme/cart.tsx` is the one `'use client'`
  island. No third-party imports.
- The only external contract is `ThemeSiteView` (plus `ThemeItem`,
  `ThemeTestimonial`, …), which mirrors wa.directory's `buildSiteView` output.

## Cart exception

wa.directory loads site themes before its own CartProvider, so the theme ships its
own cart: `theme/cart.tsx` keeps quantities in `localStorage` under
`wad-cart-${slug}` and builds a wa.me checkout message in the same format the host
app uses (`lib/order-message.ts`). This is the documented §10 exception — no other
client-side persistence.

## Fonts

`theme.css` reads `var(--market-head)` / `var(--market-body)`, set inline from
`site.fontPair.head/body`. Those are full font-family strings produced by
`next/font/google` in `shim/fonts.ts` (mirroring `wa.directory/lib/site-fonts.ts`),
so `npm install && npm run build` fetches Google Fonts at build time and needs
network access. Inside wa.directory the same values are provided by the host app.

## Running

```sh
npm install
npm run dev
```

## Known limitations

- `View profile` links point at wa.directory profile URLs (`/business/<slug>`), which
  404 when the theme is run standalone.
- Preview PNGs (`theme.json → preview`) are not captured yet.
- Cart state lives in the theme's own localStorage; it is not synced with the host
  app's cart.

## Sample data variants

`shim/site.ts → buildSampleSiteView(variant)` supports:

- `rich` — full content (default).
- `bare` — minimal business, empty collections, voice-only (tel: everywhere).
- `long` — 50 items to stress the shop grid and `View all` overflow.
