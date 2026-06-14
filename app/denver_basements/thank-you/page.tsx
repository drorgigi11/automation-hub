import Header from '../_components/Header'
import { CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Thank You — Peak Builders Denver',
}

export default function PeakBuildersDenverThankYou() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--pb-bg)' }}>
      <Header />
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(1.5rem, 4vw, 3rem) 1rem',
        }}
      >
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
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(21,128,61,0.14)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 22px',
              }}
            >
              <CheckCircle size={32} color="var(--pb-primary)" />
            </div>

            <h1
              className="pb-serif"
              style={{
                fontSize: 'clamp(1.6rem, 4.5vw, 2rem)',
                fontWeight: 700,
                color: 'var(--pb-card-fg)',
                marginBottom: 12,
                lineHeight: 1.2,
              }}
            >
              Thank You.
              <br />
              <span style={{ color: 'var(--pb-primary)' }}>Your Request Was Received.</span>
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--pb-body-fg)', marginBottom: 14, lineHeight: 1.55 }}>
              A Peak Builders Denver team member will call you soon to review your basement goals and
              help schedule your free consultation.
            </p>
            <p style={{ fontSize: 14, color: 'var(--pb-muted-fg)', lineHeight: 1.6 }}>
              Please keep your phone nearby so we can confirm a convenient time.
            </p>

            {/* TODO: add a "Call us now" CTA once Dror provides the Denver phone number. */}
          </div>
        </div>
      </main>
      <footer
        style={{
          padding: '20px 24px',
          textAlign: 'center',
          borderTop: '1px solid var(--pb-divider)',
        }}
      >
        <p style={{ fontSize: 12, color: 'var(--pb-muted-fg)' }}>
          © {new Date().getFullYear()} Peak Builders &amp; Roofers of Denver. Licensed &amp; Insured.
        </p>
      </footer>
    </div>
  )
}
