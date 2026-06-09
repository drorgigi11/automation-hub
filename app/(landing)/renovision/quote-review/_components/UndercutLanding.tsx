'use client'

import Header from '../../_components/Header'
import UndercutQuiz from './UndercutQuiz'

const TRUST_TAGS = ['Licensed & Insured', 'Hundreds of 5-Star Reviews', 'Local & Family Owned']

export default function UndercutLanding() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--rv-bg)' }}>
      <Header />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1rem 1rem 2rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: 560, textAlign: 'center', marginBottom: 28 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'hsl(165, 45%, 30%)',
              marginBottom: 14,
            }}
          >
            Got a remodeling quote in the Seattle area?
          </p>
          <h1
            style={{
              fontSize: 'clamp(1.9rem, 5vw, 2.75rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: 'hsl(165, 45%, 18%)',
              marginBottom: 16,
            }}
          >
            Before You Sign, Get a{' '}
            <span style={{ color: 'var(--rv-primary)' }}>Second Opinion</span> on Your Remodel
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.55,
              color: 'hsl(165, 12%, 35%)',
              maxWidth: 500,
              margin: '0 auto',
            }}
          >
            Share your project details below. Our design-build team will review your quote and see
            if we can offer a better price, clearer scope, and safer build process.
          </p>

          {/* Trust tags */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px 14px',
              marginTop: 20,
              fontSize: 13,
              fontWeight: 600,
              color: 'hsl(165, 30%, 32%)',
            }}
          >
            {TRUST_TAGS.map((tag, i) => (
              <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '14px' }}>
                {i > 0 && <span style={{ color: 'rgba(0,0,0,0.25)' }}>·</span>}
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: 440 }}>
          <UndercutQuiz />
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
