'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, Home, DollarSign, ShieldCheck } from 'lucide-react'
import AddressAutocomplete, { type SelectedAddress } from './AddressAutocomplete'
import RoofEstimate from './RoofEstimate'
import {
  calculateRoofEstimate,
  MANUAL_AREA_BANDS,
  type RoofComplexity,
  type RoofMaterial,
} from '@/lib/roof-pricing'

interface FormData {
  address: string
  pitch: string      // flat | low | moderate | steep | not-sure
  roofType: string   // asphalt | tiles | flat | not-sure
  financing: string  // yes | no | maybe
  name: string
  email: string
  phone: string
}

interface RoofState {
  status: 'idle' | 'loading' | 'done' | 'manual'
  source: 'solar' | 'manual'
  lat: number | null
  lng: number | null
  areaMeters2: number
  areaSqft: number
}

const PITCH_OPTIONS: { value: string; label: string; sub?: string; img: string }[] = [
  { value: 'flat', label: 'Flat', img: '/peakbuilders/quiz/pitch-flat.png' },
  { value: 'low', label: 'Low', sub: 'Easily walked on', img: '/peakbuilders/quiz/pitch-low.png' },
  { value: 'moderate', label: 'Moderate', sub: 'Not easily walked on', img: '/peakbuilders/quiz/pitch-moderate.png' },
  { value: 'steep', label: 'Steep', sub: "Can't be walked on", img: '/peakbuilders/quiz/pitch-steep.png' },
  { value: 'not-sure', label: "I'm not sure", img: '/peakbuilders/quiz/pitch-unsure.png' },
]

const ROOF_TYPE_OPTIONS: { value: string; label: string; img: string }[] = [
  { value: 'asphalt', label: 'Asphalt Shingles', img: '/peakbuilders/quiz/type-asphalt.png' },
  { value: 'tiles', label: 'Tiles', img: '/peakbuilders/quiz/type-tiles.png' },
  { value: 'flat', label: 'Flat Roof', img: '/peakbuilders/quiz/type-flat-roof.png' },
  { value: 'not-sure', label: 'Not Sure', img: '/peakbuilders/quiz/type-unsure.png' },
]

const FINANCING_OPTIONS: { value: string; label: string; sub: string }[] = [
  { value: 'yes', label: 'Yes', sub: 'I am interested in financing' },
  { value: 'no', label: 'No', sub: 'I am not interested in financing' },
  { value: 'maybe', label: 'Maybe', sub: 'I would like to learn more about financing' },
]

// Map the user-facing answers onto the pricing model.
const PITCH_TO_COMPLEXITY: Record<string, RoofComplexity> = {
  flat: 'simple', low: 'simple', moderate: 'moderate', steep: 'complex', 'not-sure': 'moderate',
}
const ROOFTYPE_TO_MATERIAL: Record<string, RoofMaterial> = {
  asphalt: 'asphalt', tiles: 'tile', flat: 'asphalt', 'not-sure': 'asphalt',
}

type LeadFormVariant = 'standard' | 'financing'

interface LeadFormProps {
  variant?: LeadFormVariant
}

// Steps:
// 1 intro · 2 address · 3 roof pitch · 4 roof type · 5 financing ·
// 6 estimate reveal · 7 contact (name+email+phone, submits)
const TOTAL_STEPS = 7

const extractZip = (address: string): string => {
  const matches = address.match(/\b\d{5}\b/g)
  return matches ? matches[matches.length - 1] : ''
}

export default function QuoteLeadForm({ variant = 'standard' }: LeadFormProps = {}) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    address: '',
    pitch: '',
    roofType: '',
    financing: '',
    name: '',
    email: '',
    phone: '',
  })
  const [roof, setRoof] = useState<RoofState>({
    status: 'idle', source: 'solar', lat: null, lng: null, areaMeters2: 0, areaSqft: 0,
  })
  const roofRef = useRef(roof)
  roofRef.current = roof
  const formRef = useRef(formData)
  formRef.current = formData

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const submitGuardRef = useRef(false)
  const totalSteps = TOTAL_STEPS

  const validatePhone = (phone: string) => phone.replace(/\D/g, '').length >= 10
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const goToNextStep = () => setStep(prev => Math.min(prev + 1, totalSteps))

  // Kick off the roof measurement as soon as we have an address, so the result
  // is usually ready by the time the user reaches the estimate-reveal step.
  const startMeasurement = useCallback((lat: number | null, lng: number | null) => {
    if (lat == null || lng == null) {
      setRoof(prev => ({ ...prev, status: 'manual', source: 'manual' }))
      return
    }
    setRoof(prev => ({ ...prev, status: 'loading' }))
    ;(async () => {
      try {
        const res = await fetch('/api/peakbuilders/roof-estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lng }),
        })
        const data = await res.json()
        if (data?.source === 'solar' && data.areaMeters2 > 0) {
          setRoof(prev => ({
            ...prev,
            status: 'done',
            source: 'solar',
            areaMeters2: data.areaMeters2,
            areaSqft: data.areaSqft,
          }))
        } else {
          setRoof(prev => ({ ...prev, status: 'manual', source: 'manual' }))
        }
      } catch {
        setRoof(prev => ({ ...prev, status: 'manual', source: 'manual' }))
      }
    })()
  }, [])

  const handleAddressSelect = (addr: SelectedAddress) => {
    setFormData(prev => ({ ...prev, address: addr.address }))
    setRoof(prev => ({ ...prev, lat: addr.lat, lng: addr.lng, status: 'idle' }))
    startMeasurement(addr.lat, addr.lng)
    setTimeout(goToNextStep, 120)
  }

  const handleManualBand = (areaMeters2: number) => {
    const areaSqft = Math.round(areaMeters2 * 10.7639)
    setRoof(prev => ({ ...prev, status: 'done', source: 'manual', areaMeters2, areaSqft }))
  }

  const handleOptionSelect = (field: 'pitch' | 'roofType' | 'financing', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setTimeout(goToNextStep, 130)
  }

  const getEstimate = () =>
    calculateRoofEstimate({
      areaMeters2: roofRef.current.areaMeters2,
      material: ROOFTYPE_TO_MATERIAL[formRef.current.roofType] ?? 'asphalt',
      complexity: PITCH_TO_COMPLEXITY[formRef.current.pitch] ?? 'moderate',
      helpType: 'full-replacement',
    })

  const validateContactField = (field: 'name' | 'email' | 'phone', value: string): string => {
    if (field === 'name') return value.trim().length > 0 ? '' : 'Please enter your name'
    if (field === 'email') return validateEmail(value) ? '' : 'Please enter a valid email address'
    return validatePhone(value) ? '' : 'Please enter a valid phone number'
  }

  const handleContactSubmit = () => {
    const data = formRef.current
    const nextErrors: Partial<Record<keyof FormData, string>> = {
      name: validateContactField('name', data.name) || undefined,
      email: validateContactField('email', data.email) || undefined,
      phone: validateContactField('phone', data.phone) || undefined,
    }
    if (nextErrors.name || nextErrors.email || nextErrors.phone) {
      setErrors(nextErrors)
      return
    }
    setErrors({})
    handleSubmit({
      ...data,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
    })
  }

  const handleSubmit = async (data: FormData) => {
    if (submitGuardRef.current) return
    submitGuardRef.current = true
    setIsSubmitting(true)
    setSubmitError(null)

    const r = roofRef.current
    const estimate = getEstimate()
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      zip_code: extractZip(data.address),
      help_type: 'full-replacement',
      // Instant-quote fields (flow into Supabase raw_data + GHL)
      address: data.address,
      lat: r.lat,
      lng: r.lng,
      roof_area_m2: r.areaMeters2 || null,
      roof_sqft: r.areaSqft || null,
      roof_squares: estimate.squares,
      roof_source: r.source,
      roof_pitch: data.pitch || null,
      roof_type: data.roofType || null,
      roof_complexity: estimate.complexity,
      financing: data.financing || null,
      material: estimate.material,
      estimate_low: estimate.estimateLow,
      estimate_high: estimate.estimateHigh,
      landing_variant: variant,
      page_url: typeof window !== 'undefined' ? window.location.href : null,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term'),
      fbclid: params.get('fbclid'),
      submitted_at: new Date().toISOString(),
    }

    try {
      const res = await fetch('/api/webhooks/peakbuilders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
    } catch (err) {
      console.error('Lead submit failed:', err)
      setSubmitError('Something went wrong. Please try again or call (619) 330-8185.')
      setIsSubmitting(false)
      submitGuardRef.current = false
      return
    }

    // Stash the estimate + project details so the thank-you page can show them.
    // Same-origin client-side navigation → sessionStorage survives the redirect.
    if (typeof window !== 'undefined') {
      try {
        const pitchLabel = PITCH_OPTIONS.find(o => o.value === data.pitch)?.label ?? ''
        const roofTypeLabel = ROOF_TYPE_OPTIONS.find(o => o.value === data.roofType)?.label ?? ''
        const financingLabel = FINANCING_OPTIONS.find(o => o.value === data.financing)?.label ?? ''
        sessionStorage.setItem('pb_quote_result', JSON.stringify({
          address: data.address,
          areaSqft: r.areaSqft,
          squares: estimate.squares,
          estimateLow: estimate.estimateLow,
          estimateHigh: estimate.estimateHigh,
          source: r.source,
          pitchLabel,
          roofTypeLabel,
          financingLabel,
        }))
      } catch {
        // sessionStorage unavailable (private mode / disabled) — thank-you page falls back gracefully.
      }
    }

    const host = typeof window !== 'undefined' ? window.location.hostname.replace(/^www\./, '') : ''
    const onCustomDomain = host === 'peak-builders.net'
    router.push(onCustomDomain ? '/thank-you' : '/peakbuilders/thank-you')
  }

  const renderProgressBar = () => (
    <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 3,
            flex: 1,
            borderRadius: 9999,
            background: i < step ? 'var(--pb-primary)' : 'rgba(10,31,61,0.10)',
            transition: 'background 0.5s',
          }}
        />
      ))}
    </div>
  )

  const renderBadges = () => {
    const isFinancing = variant === 'financing'
    const financeBadge = isFinancing
      ? {
          title: 'Roof Replacement from $179/mo',
          sub: 'Affordable monthly payments — no upfront cost.',
        }
      : {
          title: '$0 Down & 0% Interest Financing Options',
          sub: 'Get started without paying upfront.',
        }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        <div className="pb-badge">
          <div className="pb-badge-icon"><Home size={14} /></div>
          <div>
            <div className="pb-badge-title">2,100+ Roofs Completed in San Diego</div>
            <div className="pb-badge-sub">Local roofing experience homeowners can trust.</div>
          </div>
        </div>
        <div className="pb-badge">
          <div className="pb-badge-icon"><DollarSign size={14} /></div>
          <div>
            <div className="pb-badge-title">{financeBadge.title}</div>
            <div className="pb-badge-sub">{financeBadge.sub}</div>
          </div>
        </div>
        <div className="pb-badge">
          <div className="pb-badge-icon"><ShieldCheck size={14} /></div>
          <div>
            <div className="pb-badge-title">The Longest Roofing Warranty in San Diego</div>
            <div className="pb-badge-sub">Lifetime shingles warranty + 30-year labor warranty.</div>
          </div>
        </div>
      </div>
    )
  }

  const sectionHeading = (text: string) => (
    <h2 className="pb-serif" style={{
      fontSize: 'clamp(1.4rem, 3.5vw, 1.7rem)',
      fontWeight: 700,
      marginBottom: 22,
      lineHeight: 1.25,
      color: 'var(--pb-card-fg)',
    }}>
      {text}
    </h2>
  )

  const questionHeading = (text: string) => (
    <p style={{
      fontSize: 'clamp(1.05rem, 2.6vw, 1.2rem)',
      fontWeight: 700,
      color: 'var(--pb-card-fg)',
      marginBottom: 14,
      lineHeight: 1.35,
    }}>
      {text}
    </p>
  )

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div key="step1" className="pb-slide-up">
            <h2 style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 'clamp(1.5rem, 4vw, 1.85rem)',
              fontWeight: 700,
              marginBottom: 14,
              lineHeight: 1.2,
              color: 'var(--pb-card-fg)',
              letterSpacing: '-0.01em',
            }}>
              Get a <span style={{ color: 'var(--pb-primary)' }}>free instant</span> estimate
            </h2>
            <p style={{
              fontSize: 15,
              color: 'var(--pb-muted-fg)',
              marginBottom: 22,
              lineHeight: 1.55,
            }}>
              We use satellite imagery to measure your roof and provide an instant estimate for your
              roof replacement.
            </p>
            <button type="button" className="pb-btn-cta" onClick={goToNextStep}>
              Get Started
              <ArrowRight size={16} />
            </button>
            {renderBadges()}
          </div>
        )

      case 2:
        return (
          <div key="step2" className="pb-slide-up">
            {sectionHeading("What's your home address?")}
            <p style={{ fontSize: 14, color: 'var(--pb-muted-fg)', marginBottom: 18, lineHeight: 1.5 }}>
              We&apos;ll measure your roof from satellite imagery to build your estimate.
            </p>
            <AddressAutocomplete
              defaultValue={formData.address}
              onSelect={handleAddressSelect}
            />
          </div>
        )

      case 3:
        return (
          <div key="step3" className="pb-slide-up">
            {questionHeading('How steep is your roof?')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PITCH_OPTIONS.map(opt => (
                <IconOption
                  key={opt.value}
                  img={opt.img}
                  title={opt.label}
                  sub={opt.sub}
                  selected={formData.pitch === opt.value}
                  onClick={() => handleOptionSelect('pitch', opt.value)}
                />
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div key="step4" className="pb-slide-up">
            {questionHeading('What type of roof would you like?')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ROOF_TYPE_OPTIONS.map(opt => (
                <IconOption
                  key={opt.value}
                  img={opt.img}
                  title={opt.label}
                  selected={formData.roofType === opt.value}
                  onClick={() => handleOptionSelect('roofType', opt.value)}
                />
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div key="step5" className="pb-slide-up">
            {questionHeading('Are you interested in financing?')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FINANCING_OPTIONS.map(opt => (
                <IconOption
                  key={opt.value}
                  title={opt.label}
                  sub={opt.sub}
                  selected={formData.financing === opt.value}
                  onClick={() => handleOptionSelect('financing', opt.value)}
                />
              ))}
            </div>
          </div>
        )

      case 6: {
        // Measurement still running → show a brief loader until it resolves.
        if (roof.status === 'idle' || roof.status === 'loading') {
          return (
            <div key="step6-loading" className="pb-slide-up" style={{ textAlign: 'center', padding: '32px 0' }}>
              <Loader2 size={40} style={{ animation: 'pbSpin 1s linear infinite', color: 'var(--pb-primary)', margin: '0 auto 18px' }} />
              <h2 className="pb-serif" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8, color: 'var(--pb-card-fg)' }}>
                Measuring your roof…
              </h2>
              <p style={{ fontSize: 14, color: 'var(--pb-muted-fg)', lineHeight: 1.5 }}>
                Pulling satellite imagery for {formData.address || 'your address'}.
              </p>
            </div>
          )
        }
        // Solar measurement failed → ask for an approximate home size first.
        if (roof.status === 'manual' && roof.areaMeters2 === 0) {
          return (
            <div key="step6-manual" className="pb-slide-up">
              {sectionHeading('About how big is your home?')}
              <p style={{ fontSize: 14, color: 'var(--pb-muted-fg)', marginBottom: 18, lineHeight: 1.5 }}>
                We couldn&apos;t auto-measure this address — pick the closest match and we&apos;ll
                refine it during your free inspection.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MANUAL_AREA_BANDS.map(band => (
                  <button
                    key={band.value}
                    className="pb-btn-form"
                    onClick={() => handleManualBand(band.areaMeters2)}
                  >
                    {band.label}
                    <ArrowRight size={16} style={{ opacity: 0.4 }} />
                  </button>
                ))}
              </div>
            </div>
          )
        }
        const est = getEstimate()
        return (
          <div key="step6-estimate" className="pb-slide-up">
            {sectionHeading('Your instant estimate is ready')}
            <RoofEstimate
              address={formData.address}
              lat={roof.lat}
              lng={roof.lng}
              areaSqft={roof.areaSqft}
              squares={est.squares}
              estimateLow={est.estimateLow}
              estimateHigh={est.estimateHigh}
              source={roof.source}
              blurred
            />
            <button
              type="button"
              className="pb-btn-cta"
              style={{ marginTop: 18 }}
              onClick={goToNextStep}
            >
              Reveal My Price
              <ArrowRight size={16} />
            </button>
          </div>
        )
      }

      case 7:
        return (
          <div key="step7" className="pb-slide-up">
            <h2 className="pb-serif" style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 1.7rem)',
              fontWeight: 700,
              marginBottom: 8,
              lineHeight: 1.25,
              color: 'var(--pb-card-fg)',
            }}>
              Where should we send your estimate?
            </h2>
            <p style={{ fontSize: 14, color: 'var(--pb-muted-fg)', marginBottom: 22, lineHeight: 1.5 }}>
              A Peak Builders roofing specialist will confirm your estimate and schedule your free inspection.
            </p>
            <ContactStep
              values={{ name: formData.name, email: formData.email, phone: formData.phone }}
              errors={errors}
              onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
              onSubmit={handleContactSubmit}
              isSubmitting={isSubmitting}
            />
            {submitError && (
              <p style={{
                fontSize: 13,
                color: 'var(--pb-destructive)',
                marginTop: 12,
                textAlign: 'center',
                fontWeight: 500,
              }}>
                {submitError}
              </p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={{
      background: 'var(--pb-card)',
      borderRadius: 14,
      padding: 'clamp(1.5rem, 5vw, 2.25rem)',
      border: '1px solid var(--pb-divider)',
      boxShadow: '0 14px 50px rgba(10,31,61,0.10), 0 2px 8px rgba(10,31,61,0.04)',
    }}>
      {step > 1 && renderProgressBar()}
      {renderStep()}
    </div>
  )
}

interface IconOptionProps {
  icon?: React.ReactNode
  img?: string
  title: string
  sub?: string
  selected: boolean
  onClick: () => void
}

function IconOption({ icon, img, title, sub, selected, onClick }: IconOptionProps) {
  return (
    <button
      type="button"
      className={`pb-btn-form ${selected ? 'pb-btn-selected' : ''}`}
      onClick={onClick}
      style={{ gap: 14 }}
    >
      {img ? (
        <span style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          flexShrink: 0,
          overflow: 'hidden',
          background: '#ffffff',
          border: '1px solid var(--pb-input-border)',
          lineHeight: 0,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={title}
            width={48}
            height={48}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </span>
      ) : icon ? (
        <span style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 42,
          height: 42,
          borderRadius: 8,
          flexShrink: 0,
          background: selected ? 'rgba(255,255,255,0.18)' : 'var(--pb-bg-soft)',
          color: selected ? 'var(--pb-primary-fg)' : 'var(--pb-primary)',
        }}>
          {icon}
        </span>
      ) : null}
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
        <span style={{ fontWeight: 700 }}>{title}</span>
        {sub && (
          <span style={{
            fontSize: 12,
            fontWeight: 400,
            color: selected ? 'rgba(255,255,255,0.85)' : 'var(--pb-muted-fg)',
          }}>
            {sub}
          </span>
        )}
      </span>
      <ArrowRight size={16} style={{ opacity: 0.4, flexShrink: 0 }} />
    </button>
  )
}

interface ContactStepProps {
  values: { name: string; email: string; phone: string }
  errors: Partial<Record<keyof FormData, string>>
  onChange: (field: 'name' | 'email' | 'phone', value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}

function ContactStep({ values, errors, onChange, onSubmit, isSubmitting }: ContactStepProps) {
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }, [onSubmit])

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field
        label="Full Name"
        placeholder="Enter your full name"
        value={values.name}
        error={errors.name}
        onChange={v => onChange('name', v)}
        autoFocus
      />
      <Field
        label="Email Address"
        placeholder="you@example.com"
        value={values.email}
        error={errors.email}
        onChange={v => onChange('email', v)}
        type="email"
        inputMode="email"
      />
      <Field
        label="Phone Number"
        placeholder="(555) 555-5555"
        value={values.phone}
        error={errors.phone}
        onChange={v => onChange('phone', v)}
        type="tel"
        inputMode="tel"
      />
      <button type="submit" className="pb-btn-cta" style={{ marginTop: 4 }} disabled={isSubmitting}>
        {isSubmitting && <Loader2 size={16} style={{ animation: 'pbSpin 1s linear infinite' }} />}
        {isSubmitting ? 'Submitting...' : 'See My Estimate'}
        {!isSubmitting && <ArrowRight size={16} />}
      </button>
    </form>
  )
}

interface FieldProps {
  label: string
  placeholder: string
  value: string
  error?: string
  onChange: (value: string) => void
  type?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email'
  autoFocus?: boolean
}

function Field({ label, placeholder, value, error, onChange, type = 'text', inputMode = 'text', autoFocus }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--pb-muted-fg)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {label}
      </label>
      <input
        className={`pb-input${error ? ' pb-input-error' : ''}`}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
      />
      {error && (
        <p style={{ color: 'var(--pb-destructive)', fontSize: 13 }} className="pb-fade-in">
          {error}
        </p>
      )}
    </div>
  )
}
