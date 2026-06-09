'use client'

import { useEffect } from 'react'
import Header from '../../_components/Header'
import { CheckCircle, Search, PhoneCall, Lock, Phone } from 'lucide-react'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

const phoneNumber = '(425) 532-4714'
const phoneLink = 'tel:+14255324714'

const STEPS = [
  {
    icon: Search,
    title: 'Step 1: The Review.',
    body:
      'We are analyzing your project details to see where traditional contractors hide their "allowances" and how we can maximize your budget.',
  },
  {
    icon: PhoneCall,
    title: 'Step 2: The Call.',
    body:
      'A dedicated Project Manager will reach out to schedule a simple, 15-Minute Price-Range Call. Zero pressure. Zero pushy sales.',
  },
  {
    icon: Lock,
    title: 'Step 3: The Pre-Build Lock™.',
    body:
      "We'll show you how we lock in your entire 3D design and material list before you spend a dime, guaranteeing your project finishes on time and on budget.",
  },
]

export default function UndercutThankYou() {
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
    retryDelays.forEach(delay => {
      timeouts.push(setTimeout(trackLead, delay))
    })
    return () => timeouts.forEach(clearTimeout)
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--rv-bg)' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '1rem 1rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>
          {/* Hero */}
          <div className="rv-fade-in" style={{ textAlign: 'center', marginBottom: 28 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(230,144,32,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle size={32} color="var(--rv-primary)" />
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.7rem, 4.5vw, 2.3rem)',
                fontWeight: 700,
                lineHeight: 1.18,
                color: 'hsl(165, 45%, 18%)',
                marginBottom: 12,
              }}
            >
              You&apos;re One Step Closer to a{' '}
              <span style={{ color: 'var(--rv-primary)' }}>Safer, Smarter Remodel.</span>
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.55, color: 'hsl(165, 12%, 35%)', maxWidth: 520, margin: '0 auto' }}>
              We&apos;ve successfully received your project details. Our Seattle design-build experts
              are already on it.
            </p>
          </div>

          {/* What happens next */}
          <div
            className="rv-fade-in"
            style={{
              background: 'var(--rv-card)',
              borderRadius: 12,
              padding: '2rem',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            }}
          >
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--rv-card-fg)', marginBottom: 4 }}>
              Here is exactly what you can expect in the next 24 hours:
            </h2>
            <div style={{ width: 48, height: 2, background: 'rgba(230,144,32,0.4)', margin: '14px 0 24px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {STEPS.map(step => {
                const Icon = step.icon
                return (
                  <div key={step.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        flex: '0 0 auto',
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        background: 'rgba(230,144,32,0.18)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={20} color="var(--rv-primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--rv-card-fg)', marginBottom: 4 }}>
                        {step.title}
                      </h3>
                      <p style={{ fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.75)' }}>{step.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Skip the line / call us now */}
          <div className="rv-fade-in" style={{ textAlign: 'center', margin: '36px 0 16px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'hsl(165, 45%, 18%)', marginBottom: 8 }}>
              Don&apos;t want to wait? Skip the line.
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.55, color: 'hsl(165, 12%, 35%)', maxWidth: 520, margin: '0 auto 20px' }}>
              Call us now to talk about your project today and get priority assistance.
            </p>
            <a
              href={phoneLink}
              className="rv-btn-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                fontSize: '1.15rem',
              }}
            >
              <Phone size={20} />
              {phoneNumber}
            </a>
          </div>
        </div>
      </main>
      <footer style={{ padding: '16px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#888' }}>
          © 2024 Renovision Design and Build. All rights reserved. Licensed &amp; Insured.
        </p>
      </footer>
    </div>
  )
}
