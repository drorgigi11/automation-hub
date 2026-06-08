'use client'

import { useEffect, useState } from 'react'
import Header from '../_components/Header'
import { Phone, CheckCircle, Ruler, Home, MapPin } from 'lucide-react'
import { formatUsd } from '@/lib/roof-pricing'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

const phoneNumber = '(619) 330-8185'
const phoneLink = 'tel:+16193308185'

interface QuoteResult {
  address: string
  areaSqft: number
  squares: number
  estimateLow: number
  estimateHigh: number
  source: 'solar' | 'manual'
  pitchLabel: string
  roofTypeLabel: string
  financingLabel: string
}

export default function PeakBuildersThankYou() {
  const [quote, setQuote] = useState<QuoteResult | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('pb_quote_result')
      if (raw) setQuote(JSON.parse(raw) as QuoteResult)
    } catch {
      // ignore — fall back to the plain thank-you message
    }
  }, [])

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

    const retryDelays = [100, 300, 500, 1000, 2000]
    retryDelays.forEach(delay => { timeouts.push(setTimeout(trackLead, delay)) })
    return () => timeouts.forEach(clearTimeout)
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--pb-bg)' }}>
      <Header />
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1.5rem, 4vw, 3rem) 1rem',
      }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div
            className="pb-fade-in"
            style={{
              background: 'var(--pb-card)',
              borderRadius: 14,
              padding: 'clamp(1.75rem, 5vw, 2.5rem)',
              border: '1px solid var(--pb-divider)',
              boxShadow: '0 14px 50px rgba(10,31,61,0.10), 0 2px 8px rgba(10,31,61,0.04)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(245,197,24,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 22px',
            }}>
              <CheckCircle size={32} color="var(--pb-gold-dark)" />
            </div>

            <h1 className="pb-serif" style={{
              fontSize: 'clamp(1.6rem, 4.5vw, 2rem)',
              fontWeight: 700,
              color: 'var(--pb-card-fg)',
              marginBottom: 12,
              lineHeight: 1.2,
            }}>
              Thank You.
              <br />
              <span style={{ color: 'var(--pb-gold-dark)' }}>Your Request Was Received.</span>
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--pb-body-fg)', marginBottom: 14, lineHeight: 1.55 }}>
              A Peak Builders roofing specialist will contact you soon to schedule your free roof estimate &amp; consultation.
            </p>
            <p style={{ fontSize: 14, color: 'var(--pb-muted-fg)', marginBottom: 28, lineHeight: 1.6 }}>
              Please keep your phone nearby so we can confirm a convenient time and help you understand whether your roof needs a full replacement, a repair, or no work at all.
            </p>

            {quote && (
              <div
                className="pb-fade-in"
                style={{
                  borderTop: '1px solid var(--pb-divider)',
                  paddingTop: 24,
                  marginBottom: 28,
                  textAlign: 'left',
                }}
              >
                <div style={{
                  fontSize: 12, fontWeight: 600, color: 'var(--pb-muted-fg)',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  textAlign: 'center', marginBottom: 6,
                }}>
                  Your Estimated Project Cost
                </div>
                <div style={{
                  fontSize: 'clamp(1.7rem, 6vw, 2.3rem)', fontWeight: 800,
                  color: 'var(--pb-primary)', lineHeight: 1.1,
                  textAlign: 'center', marginBottom: 12,
                }}>
                  {formatUsd(quote.estimateLow)} – {formatUsd(quote.estimateHigh)}
                </div>

                <div style={{
                  textAlign: 'center', marginBottom: 18, paddingTop: 12,
                  borderTop: '1px dashed var(--pb-divider)',
                }}>
                  <div style={{ fontSize: 'clamp(1.15rem, 4vw, 1.4rem)', fontWeight: 700, color: 'var(--pb-card-fg)', lineHeight: 1.15 }}>
                    {formatUsd(Math.round(quote.estimateLow / 24))} – {formatUsd(Math.round(quote.estimateHigh / 24))}<span style={{ fontSize: '0.7em', fontWeight: 600 }}>/mo</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--pb-muted-fg)', marginTop: 3 }}>
                    with 24 monthly payments &middot; 0% interest
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  {quote.areaSqft > 0 && (
                    <Stat icon={<Ruler size={16} />} label="Roof Area" value={`${quote.areaSqft.toLocaleString()} sqft`} />
                  )}
                  {quote.squares > 0 && (
                    <Stat icon={<Home size={16} />} label="Roofing Squares" value={`${quote.squares}`} />
                  )}
                </div>

                <div style={{
                  borderRadius: 10, background: 'var(--pb-bg-soft)',
                  border: '1px solid var(--pb-divider)', padding: '14px 16px',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  {quote.address && <DetailRow icon={<MapPin size={14} />} label="Address" value={quote.address} />}
                  {quote.roofTypeLabel && <DetailRow label="Roof Type" value={quote.roofTypeLabel} />}
                  {quote.pitchLabel && <DetailRow label="Roof Pitch" value={quote.pitchLabel} />}
                  {quote.financingLabel && <DetailRow label="Interested in Financing" value={quote.financingLabel} />}
                </div>

                <p style={{ fontSize: 11, color: 'var(--pb-muted-fg)', textAlign: 'center', lineHeight: 1.5, marginTop: 12 }}>
                  {quote.source === 'manual'
                    ? 'Preliminary estimate based on your selected home size. '
                    : 'Preliminary estimate based on satellite roof measurement. '}
                  Final pricing confirmed after a free on-site inspection.
                </p>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--pb-divider)', paddingTop: 24 }}>
              <p style={{ color: 'var(--pb-muted-fg)', marginBottom: 6, fontSize: 13 }}>
                Prefer not to wait?
              </p>
              <p style={{ color: 'var(--pb-card-fg)', marginBottom: 16, fontWeight: 500, fontSize: 14 }}>
                Call us now for priority assistance:
              </p>
              <a
                href={phoneLink}
                className="pb-btn-cta"
                style={{ textDecoration: 'none', fontSize: '1.05rem' }}
              >
                <Phone size={18} />
                Call Now &mdash; {phoneNumber}
              </a>
            </div>

            <p style={{ color: 'var(--pb-muted-fg)', fontSize: 11, marginTop: 22 }}>
              We&apos;ll get back to you within 24 hours
            </p>
          </div>
        </div>
      </main>
      <footer style={{
        padding: '20px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--pb-divider)',
      }}>
        <p style={{ fontSize: 12, color: 'var(--pb-muted-fg)' }}>
          © {new Date().getFullYear()} Peak Builders &amp; Roofers of San Diego. Licensed &amp; Insured.
        </p>
      </footer>
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

function DetailRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--pb-muted-fg)', flexShrink: 0 }}>
        {icon}
        {label}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--pb-card-fg)', textAlign: 'right' }}>{value}</span>
    </div>
  )
}
