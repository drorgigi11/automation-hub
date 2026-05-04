'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, X, Loader2 } from 'lucide-react'

interface StyleDef {
  id: string
  name: string
  description: string
  gradient: string
  isLight?: boolean
}

const STYLES: StyleDef[] = [
  {
    id: 'modern-spa',
    name: 'Modern Spa',
    description: 'Clean lines, glass showers, freestanding tubs, calm colors, and a relaxing spa-inspired feel.',
    gradient: 'linear-gradient(135deg, #2a3a4f 0%, #1a2a3f 100%)',
  },
  {
    id: 'clean-contemporary',
    name: 'Clean Contemporary',
    description: 'Bright finishes, marble-look tile, glass shower doors, and a fresh modern look.',
    gradient: 'linear-gradient(135deg, #e8eaef 0%, #f5f6f8 100%)',
    isLight: true,
  },
  {
    id: 'natural-pnw-spa',
    name: 'Natural PNW Spa',
    description: 'Warm wood tones, soft natural colors, black fixtures, and a calm Pacific Northwest feel.',
    gradient: 'linear-gradient(135deg, #4a3a2f 0%, #2f261d 100%)',
  },
  {
    id: 'modern-wet-room',
    name: 'Modern Wet Room',
    description: 'A bold modern layout with dark tile, black fixtures, glass walls, and a shower-and-tub wet room feel.',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
  },
]

const IMAGES_PER_STYLE = 5

const TIMING_OPTIONS = [
  { value: 'asap', label: 'ASAP (within 1-2 months)' },
  { value: '3-6-months', label: 'Within 3-6 months' },
  { value: '6-plus-months', label: '6+ months out' },
  { value: 'exploring', label: 'Just exploring ideas' },
]

const TOTAL_STEPS = 4

interface FormData {
  style: string
  timing: string
  zip: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export default function BathroomQuiz() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const [data, setData] = useState<FormData>({
    style: '',
    timing: '',
    zip: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<{ styleName: string; n: number; gradient: string; isLight?: boolean } | null>(null)
  const [utmParams, setUtmParams] = useState<Record<string, string>>({})
  const submitGuard = useRef(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const utm: Record<string, string> = {}
    for (const key of ['utm_campaign', 'utm_content', 'utm_term', 'utm_source', 'utm_medium']) {
      const v = params.get(key)
      if (v) utm[key] = v
    }
    setUtmParams(utm)
  }, [])

  const animClass = direction === 'up' ? 'rv-slide-up' : 'rv-slide-down'

  const goNext = () => {
    setDirection('up')
    setStep(s => Math.min(s + 1, TOTAL_STEPS))
  }

  const goBack = () => {
    setDirection('down')
    setStep(s => Math.max(s - 1, 1))
  }

  const selectStyle = (styleId: string) => {
    setData(d => ({ ...d, style: styleId }))
    setTimeout(goNext, 320)
  }

  const selectTiming = (val: string) => {
    setData(d => ({ ...d, timing: val }))
    setTimeout(goNext, 320)
  }

  const validateZip = (z: string) => /^\d{5}$/.test(z)
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const validatePhone = (p: string) => p.replace(/\D/g, '').length >= 10

  const submitZip = () => {
    if (!validateZip(data.zip)) {
      setErrors(e => ({ ...e, zip: 'Please enter a valid 5-digit ZIP code' }))
      return
    }
    setErrors(e => ({ ...e, zip: undefined }))
    goNext()
  }

  const submitContact = async () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!data.firstName.trim()) newErrors.firstName = 'Required'
    if (!data.lastName.trim()) newErrors.lastName = 'Required'
    if (!validateEmail(data.email)) newErrors.email = 'Please enter a valid email'
    if (!validatePhone(data.phone)) newErrors.phone = 'Please enter a valid phone'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (submitGuard.current) return
    submitGuard.current = true
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        variant: 'bathroomstyle',
        first_name: data.firstName,
        last_name: data.lastName,
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone,
        zip_code: data.zip,
        interested: data.style,
        timing: data.timing,
        submitted_at: new Date().toISOString(),
        campaign_name: utmParams.utm_campaign ?? null,
        adset_name: utmParams.utm_term ?? null,
        ad_name: utmParams.utm_content ?? null,
        utm_source: utmParams.utm_source ?? null,
        utm_medium: utmParams.utm_medium ?? null,
      }

      const res = await fetch('/api/webhooks/lovable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Submit failed')

      const params = new URLSearchParams({
        style: data.style,
        first: data.firstName,
        zip: data.zip,
      })
      router.push(`/renovision/bathroomstyle/thank-you?${params.toString()}`)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
      setIsSubmitting(false)
      submitGuard.current = false
    }
  }

  const containerMaxWidth = step === 1 ? 880 : 460

  return (
    <div style={{ width: '100%', maxWidth: containerMaxWidth, transition: 'max-width 0.3s' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        {step > 1 && (
          <button
            onClick={goBack}
            disabled={isSubmitting}
            aria-label="Back"
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'transparent', border: 'none', color: 'rgba(0,0,0,0.55)',
              fontSize: 13, cursor: 'pointer', padding: '4px 8px',
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>
            <span style={{ fontWeight: 600, letterSpacing: '0.05em' }}>STEP {step} OF {TOTAL_STEPS}</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 4, flex: 1, borderRadius: 9999,
                  background: i < step ? 'var(--rv-primary)' : 'rgba(0,0,0,0.1)',
                  transition: 'background 0.5s',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={animClass}
        key={`step-${step}`}
        style={{
          background: 'var(--rv-card)',
          borderRadius: 12,
          padding: step === 1 ? '1.75rem 1.5rem' : '2rem',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        }}
      >
        {step === 1 && <Step1Style data={data} onSelect={selectStyle} onOpenLightbox={setLightbox} />}
        {step === 2 && <Step2Timing data={data} onSelect={selectTiming} />}
        {step === 3 && (
          <Step3Zip
            data={data}
            error={errors.zip}
            onChange={v => setData(d => ({ ...d, zip: v.replace(/\D/g, '').slice(0, 5) }))}
            onSubmit={submitZip}
          />
        )}
        {step === 4 && (
          <Step4Contact
            data={data}
            errors={errors}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onChange={(field, v) => setData(d => ({ ...d, [field]: v }))}
            onSubmit={submitContact}
          />
        )}
      </div>

      {step === 1 && (
        <p style={{ textAlign: 'center', color: 'rgba(0,0,0,0.5)', fontSize: 12, marginTop: 16 }}>
          Browse, pick a style you love, and we&apos;ll send you a free design consultation.
        </p>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, cursor: 'zoom-out',
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close"
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
              borderRadius: '50%', width: 40, height: 40, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 900, aspectRatio: '4/3',
              borderRadius: 12, overflow: 'hidden',
              background: lightbox.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: lightbox.isLight ? '#666' : 'rgba(255,255,255,0.85)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{lightbox.styleName}</div>
              <div style={{ fontSize: 16, opacity: 0.7 }}>Image {lightbox.n}</div>
              <div style={{ fontSize: 12, opacity: 0.5, marginTop: 12 }}>(placeholder — replace with real photo)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ───────────────────── Step 1: Style ─────────────────────
function Step1Style({
  data,
  onSelect,
  onOpenLightbox,
}: {
  data: FormData
  onSelect: (id: string) => void
  onOpenLightbox: (img: { styleName: string; n: number; gradient: string; isLight?: boolean }) => void
}) {
  const designConsultId = 'design-consultation'
  const isConsult = data.style === designConsultId

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)', fontWeight: 700, color: 'var(--rv-card-fg)', lineHeight: 1.2, marginBottom: 8 }}>
          Step 1: Choose Your Bathroom Style
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', maxWidth: 560, margin: '0 auto', lineHeight: 1.5 }}>
          Browse our recent bathroom remodels, pick the look you love, and answer a few quick questions to get a realistic price range and free design consultation.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {STYLES.map(style => {
          const selected = data.style === style.id
          return (
            <div
              key={style.id}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: selected ? '2px solid var(--rv-primary)' : '2px solid transparent',
                borderRadius: 10,
                padding: 16,
                transition: 'border 0.2s',
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--rv-card-fg)', marginBottom: 4 }}>
                  {style.name}
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                  {style.description}
                </p>
              </div>

              {/* Horizontal carousel */}
              <div
                style={{
                  display: 'flex', gap: 10, overflowX: 'auto',
                  paddingBottom: 8, marginBottom: 14,
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {Array.from({ length: IMAGES_PER_STYLE }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onOpenLightbox({ styleName: style.name, n: i + 1, gradient: style.gradient, isLight: style.isLight })}
                    aria-label={`${style.name} image ${i + 1} — click to enlarge`}
                    style={{
                      flex: '0 0 auto', minWidth: 220, aspectRatio: '4/3',
                      border: 'none', cursor: 'zoom-in', padding: 0,
                      borderRadius: 8, overflow: 'hidden',
                      background: style.gradient,
                      scrollSnapAlign: 'start',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: style.isLight ? '#666' : 'rgba(255,255,255,0.7)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <div style={{ textAlign: 'center', padding: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{style.name}</div>
                      <div style={{ fontSize: 12, opacity: 0.65 }}>Image {i + 1}</div>
                      <div style={{ fontSize: 10, opacity: 0.45, marginTop: 6 }}>(placeholder)</div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => onSelect(style.id)}
                className={`rv-btn-form ${selected ? 'rv-btn-selected' : ''}`}
                style={{ justifyContent: 'center' }}
              >
                {selected ? `Selected: ${style.name}` : 'Choose This Style'}
                {selected && <Check size={18} style={{ marginLeft: 8 }} />}
              </button>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => onSelect(designConsultId)}
          className={`rv-btn-form ${isConsult ? 'rv-btn-selected' : ''}`}
          style={{ justifyContent: 'center' }}
        >
          {isConsult ? 'Selected: Design Consultation Needed' : 'I’m Not Sure Yet, I Need a Design Consultation'}
          {isConsult && <Check size={18} style={{ marginLeft: 8 }} />}
        </button>
      </div>
    </div>
  )
}

// ───────────────────── Step 2: Timing ─────────────────────
function Step2Timing({ data, onSelect }: { data: FormData; onSelect: (val: string) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--rv-card-fg)', marginBottom: 8, lineHeight: 1.3 }}>
        When would you like to begin? <span style={{ color: 'var(--rv-primary)' }}>*</span>
      </h2>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 24 }}>
        This helps your designer plan the best timeline for you.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TIMING_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`rv-btn-form ${data.timing === opt.value ? 'rv-btn-selected' : ''}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ───────────────────── Step 3: ZIP ─────────────────────
function Step3Zip({
  data,
  error,
  onChange,
  onSubmit,
}: {
  data: FormData
  error?: string
  onChange: (v: string) => void
  onSubmit: () => void
}) {
  return (
    <div>
      <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--rv-card-fg)', marginBottom: 8, lineHeight: 1.3 }}>
        What&apos;s your ZIP code? <span style={{ color: 'var(--rv-primary)' }}>*</span>
      </h2>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 20 }}>
        We want to make sure we serve your area.
      </p>
      <input
        autoFocus
        type="text"
        inputMode="numeric"
        maxLength={5}
        placeholder="Enter your 5-digit ZIP code"
        value={data.zip}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onSubmit() }}
        className={`rv-input ${error ? 'rv-input-error' : ''}`}
      />
      {error && <p style={{ color: 'var(--rv-destructive)', fontSize: 13, marginTop: 8 }}>{error}</p>}
      <button onClick={onSubmit} className="rv-btn-cta" style={{ marginTop: 20 }}>
        Continue <ArrowRight size={16} />
      </button>
    </div>
  )
}

// ───────────────────── Step 4: Contact ─────────────────────
function Step4Contact({
  data,
  errors,
  isSubmitting,
  submitError,
  onChange,
  onSubmit,
}: {
  data: FormData
  errors: Partial<Record<keyof FormData, string>>
  isSubmitting: boolean
  submitError: string | null
  onChange: (field: keyof FormData, v: string) => void
  onSubmit: () => void
}) {
  return (
    <div>
      <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--rv-card-fg)', marginBottom: 8, lineHeight: 1.3 }}>
        Last step — where should we send your free consultation details? <span style={{ color: 'var(--rv-primary)' }}>*</span>
      </h2>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 20 }}>
        A senior designer will reach out within 24 hours to discuss your project.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <input
              type="text"
              placeholder="First name"
              autoComplete="given-name"
              value={data.firstName}
              onChange={e => onChange('firstName', e.target.value)}
              className={`rv-input ${errors.firstName ? 'rv-input-error' : ''}`}
            />
            {errors.firstName && <p style={{ color: 'var(--rv-destructive)', fontSize: 12, marginTop: 4 }}>{errors.firstName}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Last name"
              autoComplete="family-name"
              value={data.lastName}
              onChange={e => onChange('lastName', e.target.value)}
              className={`rv-input ${errors.lastName ? 'rv-input-error' : ''}`}
            />
            {errors.lastName && <p style={{ color: 'var(--rv-destructive)', fontSize: 12, marginTop: 4 }}>{errors.lastName}</p>}
          </div>
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={data.email}
            onChange={e => onChange('email', e.target.value)}
            className={`rv-input ${errors.email ? 'rv-input-error' : ''}`}
          />
          {errors.email && <p style={{ color: 'var(--rv-destructive)', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone"
            autoComplete="tel"
            value={data.phone}
            onChange={e => onChange('phone', e.target.value)}
            className={`rv-input ${errors.phone ? 'rv-input-error' : ''}`}
          />
          {errors.phone && <p style={{ color: 'var(--rv-destructive)', fontSize: 12, marginTop: 4 }}>{errors.phone}</p>}
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="rv-btn-cta"
        style={{ marginTop: 20 }}
      >
        {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : 'Get My Free Consultation'}
      </button>

      {submitError && (
        <p style={{ color: 'var(--rv-destructive)', fontSize: 13, marginTop: 12, textAlign: 'center' }}>
          {submitError}
        </p>
      )}
    </div>
  )
}
