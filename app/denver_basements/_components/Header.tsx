'use client'

import { useState } from 'react'

function LogoMark() {
  // Crisp SVG recreation of the Peak Builders mark (gold disc + dark peaks).
  // Used until /public/denver_basements/logo.png is supplied.
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden style={{ flexShrink: 0 }}>
        <defs>
          <radialGradient id="pbdGold" cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#FFE680" />
            <stop offset="55%" stopColor="#F2B705" />
            <stop offset="100%" stopColor="#C89000" />
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="20" fill="url(#pbdGold)" />
        <path d="M7 28 L17 12 L21 19 L25 14 L33 28 Z" fill="#23262C" />
        <path d="M17 12 L19.5 16 L16 20 L13 16 Z" fill="#3a3e46" opacity="0.65" />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            fontSize: 'clamp(0.95rem, 3.6vw, 1.18rem)',
            fontWeight: 900,
            letterSpacing: '0.02em',
            color: 'var(--pb-gold)',
            textTransform: 'uppercase',
          }}
        >
          Peak Builders
        </div>
        <div
          style={{
            fontSize: 'clamp(0.5rem, 1.9vw, 0.62rem)',
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: '#C9CBCF',
            textTransform: 'uppercase',
            marginTop: 3,
          }}
        >
          &amp; Roofers of Denver
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const [logoOk, setLogoOk] = useState(true)

  return (
    <header
      style={{
        width: '100%',
        background: 'var(--pb-charcoal-2)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '12px clamp(1rem, 4vw, 2.5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          minHeight: 60,
        }}
      >
        {logoOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/denver_basements/logo.png"
            alt="Peak Builders & Roofers of Denver"
            onError={() => setLogoOk(false)}
            style={{ height: 42, width: 'auto', maxWidth: '70vw', display: 'block' }}
          />
        ) : (
          <LogoMark />
        )}

        <span
          style={{
            flexShrink: 0,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            background: 'var(--pb-gold)',
            borderRadius: 7,
            padding: '6px 11px',
            color: 'var(--pb-charcoal)',
          }}
        >
          Denver
        </span>
      </div>
    </header>
  )
}
