'use client'

import { Ruler, Home, Lock } from 'lucide-react'
import { formatUsd } from '@/lib/roof-pricing'

interface RoofEstimateProps {
  address: string
  lat: number | null
  lng: number | null
  areaSqft: number
  squares: number
  estimateLow: number
  estimateHigh: number
  source: 'solar' | 'manual'
  /** When true the price is blurred behind a "enter your info" overlay. */
  blurred?: boolean
}

function staticSatelliteUrl(lat: number, lng: number) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  const params = new URLSearchParams({
    center: `${lat},${lng}`,
    zoom: '20',
    size: '600x300',
    scale: '2',
    maptype: 'satellite',
    markers: `color:0x15803d|${lat},${lng}`,
    key: key ?? '',
  })
  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`
}

export default function RoofEstimate({
  address, lat, lng, areaSqft, squares, estimateLow, estimateHigh, source, blurred = false,
}: RoofEstimateProps) {
  const hasCoords = lat != null && lng != null
  return (
    <div className="pb-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {hasCoords && (
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--pb-divider)', lineHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={staticSatelliteUrl(lat!, lng!)}
            alt={`Satellite view of ${address}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      )}

      {address && (
        <p style={{ fontSize: 13, color: 'var(--pb-muted-fg)', textAlign: 'center', lineHeight: 1.4 }}>
          {address}
        </p>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <Stat icon={<Ruler size={16} />} label="Roof Area" value={`${areaSqft.toLocaleString()} sqft`} />
        <Stat icon={<Home size={16} />} label="Roofing Squares" value={`${squares}`} />
      </div>

      {/* Price reveal */}
      <div style={{ position: 'relative', borderRadius: 12, background: 'var(--pb-bg-soft)', border: '1px solid var(--pb-divider)', padding: '20px 18px', textAlign: 'center' }}>
        <div style={{ filter: blurred ? 'blur(8px)' : 'none', userSelect: blurred ? 'none' : 'auto', transition: 'filter 0.3s' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--pb-muted-fg)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            Estimated Project Cost
          </div>
          <div style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 800, color: 'var(--pb-primary)', lineHeight: 1.1 }}>
            {formatUsd(estimateLow)} – {formatUsd(estimateHigh)}
          </div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--pb-divider)' }}>
            <div style={{ fontSize: 'clamp(1.05rem, 3.2vw, 1.25rem)', fontWeight: 700, color: 'var(--pb-card-fg)', lineHeight: 1.15 }}>
              {formatUsd(Math.round(estimateLow / 24))} – {formatUsd(Math.round(estimateHigh / 24))}<span style={{ fontSize: '0.7em', fontWeight: 600 }}>/mo</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--pb-muted-fg)', marginTop: 3 }}>
              with 24 monthly payments &middot; 0% interest
            </div>
          </div>
        </div>
        {blurred && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--pb-card-fg)' }}>
            <Lock size={18} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Enter your info to reveal your price</span>
          </div>
        )}
      </div>

      <p style={{ fontSize: 11, color: 'var(--pb-muted-fg)', textAlign: 'center', lineHeight: 1.5 }}>
        {source === 'manual'
          ? 'Preliminary estimate based on your selected home size. '
          : 'Preliminary estimate based on satellite roof measurement. '}
        Final pricing confirmed after a free on-site inspection.
      </p>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ flex: 1, borderRadius: 10, background: 'var(--pb-bg-soft)', border: '1px solid var(--pb-divider)', padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--pb-muted-fg)', marginBottom: 4 }}>
        {icon}
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--pb-card-fg)' }}>{value}</div>
    </div>
  )
}
