'use client'

import { useEffect } from 'react'
import Header from '../_components/Header'
import { Phone, CheckCircle } from 'lucide-react'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

const phoneNumber = '(619) 330-8185'
const phoneLink = 'tel:+16193308185'

export default function PeakBuildersThankYou() {
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
