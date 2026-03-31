import { LeadSource } from '@/lib/supabase'

const config: Record<LeadSource, { label: string; color: string; bg: string }> = {
  facebook: { label: 'Facebook', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
  elementor: { label: 'Elementor', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
  lovable: { label: 'Lovable', color: '#F472B6', bg: 'rgba(244,114,182,0.12)' },
}

export default function SourceBadge({ source }: { source: LeadSource }) {
  const { label, color, bg } = config[source] ?? {
    label: source,
    color: 'var(--text-secondary)',
    bg: 'var(--surface)',
  }
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
