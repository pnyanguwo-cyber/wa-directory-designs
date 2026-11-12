import {
  DM_Sans,
  DM_Serif_Display,
  Inter,
  Playfair_Display,
  Space_Grotesk,
} from 'next/font/google'

export type SiteFontKey = 'modern' | 'editorial' | 'grotesk' | 'warm'
export type FontPair = {
  head: string
  body: string
  headVars: string
}

/* Mirrors wa.directory/lib/site-fonts.ts exactly. `head`/`body` are full
 * next/font font-family strings (hashed webfont family names), so themes can
 * set `font-family` directly from fontPair values. The @font-face CSS is
 * emitted because `.style.fontFamily` flows into rendered output via
 * getFontPair — no className or `variable` usage needed. */
const fontModernHead = Inter({ subsets: ['latin'], display: 'swap' })
const fontModernBody = Inter({ subsets: ['latin'], display: 'swap' })
const fontEditorialHead = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
})
const fontEditorialBody = Inter({ subsets: ['latin'], display: 'swap' })
const fontGroteskHead = Space_Grotesk({ subsets: ['latin'], display: 'swap' })
const fontGroteskBody = Inter({ subsets: ['latin'], display: 'swap' })
const fontWarmHead = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})
const fontWarmBody = DM_Sans({ subsets: ['latin'], display: 'swap' })

export function getFontPair(key?: string | null): FontPair {
  switch (key) {
    case 'editorial':
      return {
        head: fontEditorialHead.style.fontFamily,
        body: fontEditorialBody.style.fontFamily,
        headVars: 'var(--font-playfair)',
      }
    case 'grotesk':
      return {
        head: fontGroteskHead.style.fontFamily,
        body: fontGroteskBody.style.fontFamily,
        headVars: '',
      }
    case 'warm':
      return {
        head: fontWarmHead.style.fontFamily,
        body: fontWarmBody.style.fontFamily,
        headVars: '',
      }
    default:
      return {
        head: fontModernHead.style.fontFamily,
        body: fontModernBody.style.fontFamily,
        headVars: '',
      }
  }
}
