import AtlasTheme from '@/theme'
import { buildSampleSiteView, type SampleVariant } from '@/shim/site'
import type { ThemeOrientation } from '@/theme/types'

export const dynamic = 'force-dynamic'

type SearchParams = { [key: string]: string | string[] | undefined }

function first(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function readVariant(raw?: string): SampleVariant {
  if (raw === 'bare') return 'bare'
  if (raw === 'long') return 'long'
  return 'rich'
}

function readOrientation(raw?: string): ThemeOrientation {
  return raw === 'stacked' ? 'stacked' : 'split'
}

export default function AtlasPreviewPage({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  const variant = readVariant(first(searchParams?.variant))
  const orientation = readOrientation(first(searchParams?.orientation))
  const site = buildSampleSiteView(variant)

  return <AtlasTheme site={site} orientation={orientation} mode="preview" />
}
