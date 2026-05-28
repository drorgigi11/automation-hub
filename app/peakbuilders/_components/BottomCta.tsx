'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import LeadForm from './LeadForm'

export default function BottomCta() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <section style={{
        width: '100%',
        padding: 'clamp(1.75rem, 5vw, 2.75rem) 1rem',
        background: 'var(--pb-bg)',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pb-btn-cta"
          style={{
            maxWidth: 360,
            fontSize: '1.05rem',
            padding: '18px 28px',
          }}
        >
          Get My Free Estimate
          <ArrowRight size={18} />
        </button>
      </section>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Free roof estimate request form"
          onClick={() => setOpen(false)}
          className="pb-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,31,61,0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 'clamp(1rem, 4vw, 2.5rem) 1rem',
            overflowY: 'auto',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="pb-slide-up"
            style={{
              width: '100%',
              maxWidth: 480,
              position: 'relative',
              margin: 'auto 0',
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: -14,
                right: -10,
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'var(--pb-primary)',
                color: 'var(--pb-primary-fg)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(10,31,61,0.35)',
                zIndex: 2,
              }}
            >
              <X size={20} />
            </button>
            <LeadForm />
          </div>
        </div>
      )}
    </>
  )
}
