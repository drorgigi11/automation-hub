'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '../../_components/Header'
import { Phone, CheckCircle } from 'lucide-react'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

const phoneNumber = '(425) 532-4714'
const phoneLink = 'tel:+14255324714'

const STYLE_LABELS: Record<string, { name: string; gradient: string; isLight?: boolean }> = {
  'modern-spa':           { name: 'Modern Spa',         gradient: 'linear-gradient(135deg, #2a3a4f 0%, #1a2a3f 100%)' },
  'clean-contemporary':   { name: 'Clean Contemporary', gradient: 'linear-gradient(135deg, #e8eaef 0%, #f5f6f8 100%)', isLight: true },
  'natural-pnw-spa':      { name: 'Natural PNW Spa',    gradient: 'linear-gradient(135deg, #4a3a2f 0%, #2f261d 100%)' },
  'modern-wet-room':      { name: 'Modern Wet Room',    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)' },
}

function cityFromZip(zip: string): string {
  const prefix = zip.slice(0, 3)
  if (['980', '981'].includes(prefix)) return 'Seattle'
  if (['984'].includes(prefix)) return 'Bellevue'
  if (['982'].includes(prefix)) return 'Everett'
  if (['983'].includes(prefix)) return 'Tacoma'
  return 'your'
}

function ThankYouContent() {
  const params = useSearchParams()
  const styleId = params.get('style') ?? ''
  const firstName = params.get('first') ?? ''
  const zip = params.get('zip') ?? ''
  const city = cityFromZip(zip)

  const isConsult = styleId === 'design-consultation'
  const styleInfo = STYLE_LABELS[styleId]

  useEffect(() => {
    let tracked = false
    const timeouts: ReturnType<typeof setTimeout>[] = []
    const trackLead = () => {
      if (!tracked && typeof window.fbq === 'function') {
        window.fbq('track', 'Lead')
        tracked = true
        timeouts.forEach(clearTimeout)
        return true
      }
      return false
    }
    if (trackLead()) return
    ;[100, 300, 500, 1000, 2000].forEach(d => { timeouts.push(setTimeout(trackLead, d)) })
    return () => timeouts.forEach(clearTimeout)
  }, [])

  const headline = firstName
    ? `Thanks, ${firstName}! Your designer will call within 24 hours.`
    : `Thanks! Your designer will call within 24 hours.`

  const subhead = isConsult
    ? `Your designer will help you find the perfect style for your home. While you wait — here are a few recent projects from the ${city} area:`
    : styleInfo
      ? `While you wait — here are 3 ${styleInfo.name} bathrooms we recently completed in the ${city} area:`
      : `While you wait — here are a few recent projects from the ${city} area:`

  // For consult, show one image from each of 3 different styles. Otherwise 3 of the picked style.
  const tiles = isConsult
    ? [STYLE_LABELS['modern-spa'], STYLE_LABELS['clean-contemporary'], STYLE_LABELS['natural-pnw-spa']]
        .filter((s): s is NonNullable<typeof s> => Boolean(s))
        .map((s, i) => ({ ...s, n: i + 1 }))
    : styleInfo
      ? [1, 2, 3].map(n => ({ ...styleInfo, n }))
      : [1, 2, 3].map(n => ({ name: 'Renovision', gradient: 'linear-gradient(135deg, #2a3a4f 0%, #1a2a3f 100%)', isLight: false, n }))

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--rv-bg)' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '1.5rem 1rem 3rem' }}>
        <div style={{ width: '100%', maxWidth: 720 }}>
          <div
            className="rv-fade-in"
            style={{
              background: 'var(--rv-card)',
              borderRadius: 12,
              padding: '2rem 1.5rem',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(230,144,32,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle size={32} color="var(--rv-primary)" />
            </div>

            <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)', fontWeight: 700, color: 'var(--rv-card-fg)', lineHeight: 1.25, marginBottom: 12 }}>
              {headline}
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.55, marginBottom: 24, maxWidth: 540, margin: '0 auto 24px' }}>
              {subhead}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12, marginBottom: 28,
            }}>
              {tiles.map((tile, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '4/3',
                    borderRadius: 8, overflow: 'hidden',
                    background: tile.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: tile.isLight ? '#666' : 'rgba(255,255,255,0.75)',
                  }}
                >
                  <div style={{ textAlign: 'center', padding: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{tile.name}</div>
                    <div style={{ fontSize: 11, opacity: 0.6 }}>Image {tile.n}</div>
                    <div style={{ fontSize: 9, opacity: 0.45, marginTop: 4 }}>(placeholder)</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 20 }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 12 }}>
                Can&apos;t wait? Call us now:
              </p>
              <a href={phoneLink} className="rv-btn-cta" style={{ textDecoration: 'none', maxWidth: 320, margin: '0 auto' }}>
                <Phone size={18} />
                {phoneNumber}
              </a>
            </div>
          </div>
        </div>
      </main>
      <footer style={{ padding: '16px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#888' }}>
          © 2024 Renovision Design and Build. All rights reserved. Licensed & Insured.
        </p>
      </footer>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  )
}
