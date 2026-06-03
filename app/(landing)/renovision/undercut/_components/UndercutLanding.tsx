'use client'

import { useState } from 'react'
import Header from '../../_components/Header'
import UndercutQuiz from './UndercutQuiz'

export default function UndercutLanding() {
  const [projectType, setProjectType] = useState<string | null>(null)

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
            Got a {projectType ?? 'Renovation'} Quote in The Seattle Area?
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
            We Can Beat Your Quote with a{' '}
            <span style={{ color: 'var(--rv-primary)' }}>Better, Safer Offer.</span>
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
            Leave your project details below. Our design-build team will review your quote and show
            you whether we can offer a better price, clearer scope, and safer build process.
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: 440 }}>
          <UndercutQuiz onProjectType={setProjectType} />
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
