'use client'

import { useEffect } from 'react'
import Header from '../_components/Header'
import { Phone, CheckCircle } from 'lucide-react'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

const phoneNumber = '(425) 532-4714'
const phoneLink = 'tel:+14255324714'

export default function ThankYou() {
  useEffect(() => {
    let tracked = false
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
    const timeouts: ReturnType<typeof setTimeout>[] = []
    retryDelays.forEach(delay => { timeouts.push(setTimeout(trackLead, delay)) })
    return () => timeouts.forEach(clearTimeout)
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--rv-bg)' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div
            className="rv-fade-in"
            style={{
              background: 'var(--rv-card)',
              borderRadius: 12,
              padding: '2rem',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(230,144,32,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <CheckCircle size={32} color="var(--rv-primary)" />
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--rv-card-fg)', marginBottom: 12 }}>
              Thank you.
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--rv-card-fg)', marginBottom: 8 }}>
              Your remodeling inquiry has been received.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>
              We&apos;re glad you reached out. A member of our team will call you shortly from{' '}
              <span style={{ color: 'var(--rv-card-fg)', fontWeight: 500 }}>{phoneNumber}</span>.
            </p>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 8, fontSize: 14 }}>
                Prefer not to wait?
              </p>
              <p style={{ color: 'var(--rv-card-fg)', marginBottom: 16, fontWeight: 500 }}>
                Call us now and get priority assistance:
              </p>
              <a href={phoneLink} className="rv-btn-cta" style={{ textDecoration: 'none', fontSize: '1.1rem' }}>
                <Phone size={20} />
                {phoneNumber}
              </a>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 24 }}>
              We&apos;ll Get Back To You Within 24 Hours
            </p>
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
