# Sample data contract

Every theme's `data/` folder holds JSON files that `shim/site.ts` maps into a
full `ThemeSiteView` (the structural mirror of wa.directory's `SiteView`). The
mapping is where all app-side derivation (contrast, color-mix tints, hrefs,
stats, JSON-LD) is re-implemented for the standalone preview.

## Field rules

- **snake_case mirrors the database shape.** Item/product fields follow the
  real `BusinessItem` type in wa.directory (`types/index.ts:112`):
  `price: number` (never null in source data — themes still tolerate null),
  `image_url?`, `description?`, `price_type?` (`'fixed' | 'on_request'`),
  `availability_status?` (`'in_stock' | 'available_on_order' | 'out_of_stock' |
  'availability_unknown'`), `is_active`, `created_at`, `updated_at`.
- **Money format:** `$X.XX`; missing price or `price_type: 'on_request'`
  renders `POA`.
- **Hours:** array of `{ day, open, close }` with 24h `"HH:MM"` strings; a day
  with empty `open`/`close` is closed. Days may be absent entirely (also
  closed).
- **Services:** a single newline-separated string (`blocks.services`), split
  into cards the same way `lib/site-content.ts:214 servicesToCards` does.
- **Gallery:** https image URLs. `coverImage` is the first gallery photo.
- **Socials:** object keyed by platform (`twitter`, `instagram`, `facebook`,
  `linkedin`, `tiktok`, `youtube`); empty/whitespace values are dropped.
- **Theme selection:** `{ design, orientation, font, accent, header, hero,
  shop, contact }` — hex overrides allowed for header/hero/shop/contact; empty
  string means "use the theme default".

## Variants

| Variant | File | Purpose |
| --- | --- | --- |
| **rich** | `websites/<theme>/data/sample-business.json` | Everything present: WhatsApp ordering, 6 items, 4 reviews, full hours, gallery, socials, coordinates. Default `/`. |
| **bare** | `websites/<theme>/data/sample-bare-content.json` | Voice-only business (no WhatsApp digits → `voiceOnly: true`, `orderDigits: ''`), empty items + gallery, closed days. Exercises empty states and `tel:` CTAs. `/?variant=bare`. |
| **long** | `websites/<theme>/data/sample-long-content.json` | Stress test: 80-char business name, long tagline/hero/bio, 50 items (shim replicates a curated base list), 6 reviews incl. one long, 2 closed days, 8-photo gallery, dark shop background, editorial serif font. `/?variant=long`. |

The shim exposes exactly one entry point per theme:

```ts
buildSampleSiteView(variant: 'rich' | 'bare' | 'long'): ThemeSiteView
```

Values the shim computes (do not put these in the JSON):

- `initials` (first two words of the name, 2 chars, uppercase)
- `whatsappHref` / `orderDigits` / `voiceOnly`
- `accentDark`, `accentCtaText`, `accentSoftBg`, `accentMutedBg`, `accentGlow`
- `headerBg/heroBg/shopBg/contactBg` + their dark flags
- `isHeroDark` (true whenever `coverImage` exists, else luminance of `heroBg`)
- `mapsHref` (coords first, else geocoded address, else `''`)
- `fontPair` (via the mirrored `getFontPair` in `shim/fonts.ts`)
- `stats`, `navItems`, `jsonLd`, `profileHref`
