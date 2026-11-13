import type {
  ThemeFaqEntry,
  ThemeHoursEntry,
  ThemeItem,
  ThemeNavItem,
  ThemeSiteView,
  ThemeStat,
  ThemeTestimonial,
} from '@/theme/types'
import { getFontPair } from './fonts'
import richRaw from '@/data/sample-business.json'
import bareRaw from '@/data/sample-bare-content.json'
import longRaw from '@/data/sample-long-content.json'

export type SampleVariant = 'rich' | 'bare' | 'long'

type RawItem = {
  id: string
  name: string
  slug: string
  price: number | null
  price_type?: 'fixed' | 'on_request'
  availability_status?:
    | 'in_stock'
    | 'available_on_order'
    | 'out_of_stock'
    | 'availability_unknown'
  currency_code?: string
  image_url?: string | null
  description?: string
  category?: string
  subcategory?: string
  brand?: string
}

type RawSample = {
  id: string
  name: string
  slug: string
  city: string
  area: string
  areas: string[]
  bio: string
  logo_url: string | null
  verified: boolean
  rating: number
  review_count: number
  years_on_directory: number
  category: string
  categories: string[]
  phone_clean: string
  phone_type: 'whatsapp' | 'voice'
  voice_phone: string | null
  email: string
  website: string | null
  address: string | null
  lat: number | null
  lng: number | null
  show_location: boolean
  theme: {
    design: string
    orientation: string
    font: string
    accent: string
    header: string
    hero: string
    shop: string
    contact: string
  }
  blocks: {
    tagline: string
    hero: string
    services: string
    faq: { q: string; a: string }[]
    hours: { day: string; open: string; close: string }[]
    gallery: string[]
  }
  testimonials: { rating: number; comment: string; name: string; created_at: string }[]
  socials: Record<string, string>
  items: RawItem[]
}

function hexLuminance(hex: string): number {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim())
  if (!m) return 1
  const int = parseInt(m[1], 16)
  const lin = [(int >> 16) & 255, (int >> 8) & 255, int & 255].map(v => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

function getInitials(name: string): string {
  return (
    (name || '')
      .split(' ')
      .filter(Boolean)
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'WA'
  )
}

function replicateItems(base: RawItem[], total: number): RawItem[] {
  if (!base.length) return []
  return Array.from({ length: total }, (_, i) => {
    if (i < base.length) return base[i]
    const src = base[i % base.length]
    return {
      ...src,
      id: `${src.id}-${i + 1}`,
      slug: `${src.slug}-${i + 1}`,
      name: `${src.name} · Series ${i + 1}`,
    }
  })
}

function buildSite(raw: RawSample, opts?: { itemTotal?: number }): ThemeSiteView {
  const rawItems = opts?.itemTotal
    ? replicateItems(raw.items, opts.itemTotal)
    : raw.items

  const items: ThemeItem[] = rawItems.map(item => ({
    id: item.id,
    business_id: raw.id,
    name: item.name,
    slug: item.slug,
    price: item.price,
    image_url: item.image_url ?? undefined,
    description: item.description,
    category: item.category,
    subcategory: item.subcategory,
    brand: item.brand,
    currency_code: item.currency_code ?? 'USD',
    price_type: item.price_type ?? 'fixed',
    availability_status: item.availability_status ?? 'in_stock',
    is_active: true,
    created_at: '2025-03-04T08:00:00.000Z',
    updated_at: '2026-11-01T08:00:00.000Z',
  }))

  const gallery = raw.blocks.gallery ?? []
  const coverImage = gallery[0] ?? null
  const hours = (raw.blocks.hours ?? []) as ThemeHoursEntry[]
  const accent = raw.theme.accent || '#0F766E'
  const accentDark = hexLuminance(accent) < 0.25
  const accentCtaText = hexLuminance(accent) > 0.35 ? '#111B21' : '#FFFFFF'
  const headerBg = raw.theme.header || '#FFFFFF'
  const heroBg = raw.theme.hero || ''
  const shopBg = raw.theme.shop || '#FFFFFF'
  const contactBg = raw.theme.contact || '#FFFFFF'
  const isHeroDark = coverImage
    ? true
    : heroBg
      ? hexLuminance(heroBg) < 0.25
      : accentDark
  const orderDigits = raw.phone_type === 'whatsapp' ? raw.phone_clean : ''

  const services = (raw.blocks.services || '')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)

  const navItems: ThemeNavItem[] = []
  if (services.length) navItems.push({ href: '#services', label: 'Services' })
  if (items.length) navItems.push({ href: '#shop', label: 'Shop' })
  if (gallery.length) navItems.push({ href: '#gallery', label: 'Gallery' })
  if (raw.testimonials.length)
    navItems.push({ href: '#reviews', label: 'Reviews' })
  if (raw.blocks.faq.length) navItems.push({ href: '#faq', label: 'FAQ' })
  if (hours.length) navItems.push({ href: '#hours', label: 'Hours' })
  navItems.push({ href: '#contact', label: 'Contact' })

  const stats: ThemeStat[] = [
    {
      label: 'Rating',
      value: raw.rating ? `${raw.rating.toFixed(1)} / 5` : '—',
    },
    { label: 'Reviews', value: String(raw.review_count) },
    { label: 'Listed', value: String(items.length) },
    { label: 'Years here', value: `${raw.years_on_directory}+` },
  ]

  const openHours = hours.filter(h => h.open && h.close)
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: raw.name,
    description: raw.bio,
    telephone: raw.phone_clean ? `+${raw.phone_clean}` : undefined,
    address: raw.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: raw.address,
          addressLocality: raw.city,
          addressCountry: 'ZW',
        }
      : undefined,
    geo:
      raw.lat != null && raw.lng != null
        ? { '@type': 'GeoCoordinates', latitude: raw.lat, longitude: raw.lng }
        : undefined,
    openingHoursSpecification: openHours.length
      ? openHours.map(h => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.day,
          opens: h.open,
          closes: h.close,
        }))
      : undefined,
    aggregateRating: raw.review_count
      ? {
          '@type': 'AggregateRating',
          ratingValue: raw.rating,
          reviewCount: raw.review_count,
        }
      : undefined,
  }

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    city: raw.city,
    area: raw.area,
    areas: raw.areas,
    bio: raw.bio,
    logoUrl: raw.logo_url ?? '',
    verified: raw.verified,
    website: raw.website ?? undefined,
    address: raw.address ?? undefined,
    lat: raw.lat,
    lng: raw.lng,
    showLocation: raw.show_location,
    rating: raw.rating,
    reviewCount: raw.review_count,
    yearsOn: raw.years_on_directory,
    initials: getInitials(raw.name),
    profileHref: `/business/${raw.slug}`,
    categories: raw.categories,
    category: raw.category,
    phoneClean: raw.phone_clean,
    phoneType: raw.phone_type,
    voicePhone: raw.voice_phone ?? null,
    whatsappHref: orderDigits ? `https://wa.me/${orderDigits}` : '',
    orderDigits,
    voiceOnly: !orderDigits,
    email: raw.email,
    theme: raw.theme,
    fontKey: raw.theme.font || 'modern',
    preset: raw.theme.design || 'classic',
    isPreset: true,
    fontPair: getFontPair(raw.theme.font),
    accent,
    accentDark,
    accentCtaText,
    headerBg,
    isHeaderDark: hexLuminance(headerBg) < 0.25,
    heroBg,
    shopBg,
    isShopDark: hexLuminance(shopBg) < 0.25,
    contactBg,
    contactDark: hexLuminance(contactBg) < 0.25,
    contactCtaText: accentCtaText,
    accentSoftBg: `color-mix(in srgb, ${accent} 10%, transparent)`,
    accentMutedBg: `color-mix(in srgb, ${accent} 18%, transparent)`,
    accentGlow: `color-mix(in srgb, ${accent} 35%, transparent)`,
    tagline: raw.blocks.tagline,
    hero: raw.blocks.hero,
    coverImage,
    menuServices: services,
    faq: raw.blocks.faq as ThemeFaqEntry[],
    hours,
    gallery,
    isHeroDark,
    heroWash: { scrimL: 0.65, scrimM: 0.45, scrimB: 0.5 },
    testimonials: raw.testimonials as ThemeTestimonial[],
    socialLinks: Object.entries(raw.socials)
      .filter(([, url]) => !!url)
      .map(([key, url]) => ({ key, url })),
    mapsHref:
      raw.lat != null && raw.lng != null
        ? `https://www.google.com/maps/search/?api=1&query=${raw.lat},${raw.lng}`
        : '',
    navItems,
    stats,
    jsonLd,
    items,
  }
}

export function buildSampleSiteView(
  variant: SampleVariant = 'rich',
): ThemeSiteView {
  if (variant === 'bare') return buildSite(bareRaw as unknown as RawSample)
  if (variant === 'long')
    return buildSite(longRaw as unknown as RawSample, { itemTotal: 50 })
  return buildSite(richRaw as unknown as RawSample)
}
