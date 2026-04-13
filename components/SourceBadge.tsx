import { LeadSource } from '@/lib/supabase'

function getSourceInfo(source: LeadSource, rawData?: Record<string, unknown>) {
  if (source === 'facebook') {
    return { label: 'Facebook', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' }
  }
  if (source === 'elementor') {
    return { label: 'Website', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' }
  }
  if (source === 'lovable') {
    const utm = String(rawData?.utm_source ?? '').toLowerCase()
    if (utm.includes('facebook') || utm === 'fb') {
      return { label: 'Facebook', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' }
    }
    if (utm.includes('google')) {
      return { label: 'Google', color: '#34D399', bg: 'rgba(52,211,153,0.12)' }
    }
    if (utm.includes('instagram') || utm === 'ig') {
      return { label: 'Instagram', color: '#FB923C', bg: 'rgba(251,146,60,0.12)' }
    }
    // No utm_source but has campaign data → came from Facebook ad
    if (!utm && rawData?.campaign_name) {
      return { label: 'Facebook', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' }
    }
    return { label: 'Direct', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' }
  }
  return { label: source, color: 'var(--text-secondary)', bg: 'var(--surface)' }
}

export default function SourceBadge({
  source,
  rawData,
}: {
  source: LeadSource
  rawData?: Record<string, unknown>
}) {
  const { label, color, bg } = getSourceInfo(source, rawData)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        color,
        background: bg,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
        }}
      />
      {label}
    </span>
  )
}
