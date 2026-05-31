'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, Home, DollarSign, ShieldCheck } from 'lucide-react'

interface FormData {
  zipCode: string
  helpType: string
  name: string
  email: string
  phone: string
}

const HELP_OPTIONS = [
  { value: 'full-replacement', label: 'Full Roof Replacement' },
  { value: 'repair', label: 'Roof Repair' },
  { value: 'not-sure', label: 'Not Sure Yet' },
]

type LeadFormVariant = 'standard' | 'financing'

interface LeadFormProps {
  variant?: LeadFormVariant
}

export default function LeadForm({ variant = 'standard' }: LeadFormProps = {}) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    zipCode: '',
    helpType: '',
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const submitGuardRef = useRef(false)
  const totalSteps = 5

  const validateZipCode = (zip: string) => /^\d{5}$/.test(zip)
  const validatePhone = (phone: string) => phone.replace(/\D/g, '').length >= 10
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const goToNextStep = () => setStep(prev => Math.min(prev + 1, totalSteps + 1))

  const handleOptionSelect = (value: string) => {
    setFormData(prev => ({ ...prev, helpType: value }))
    setTimeout(goToNextStep, 250)
  }

  const handleInputSubmit = (field: keyof FormData, value: string) => {
    let isValid = true
    let errorMessage = ''

    switch (field) {
      case 'zipCode':
        isValid = validateZipCode(value)
        errorMessage = 'Please enter a valid 5-digit ZIP code'
        break
      case 'phone':
        isValid = validatePhone(value)
        errorMessage = 'Please enter a valid phone number'
        break
      case 'email':
        isValid = validateEmail(value)
        errorMessage = 'Please enter a valid email address'
        break
      case 'name':
        isValid = value.trim().length > 0
        errorMessage = 'Please enter your name'
        break
    }

    if (!isValid) {
      setErrors(prev => ({ ...prev, [field]: errorMessage }))
      return
    }

    setErrors(prev => ({ ...prev, [field]: undefined }))
    const updatedData = { ...formData, [field]: value.trim() }
    setFormData(updatedData)

    if (step !== totalSteps) {
      goToNextStep()
    } else {
      handleSubmit(updatedData)
    }
  }

  const handleSubmit = async (data: FormData) => {
    if (submitGuardRef.current) return
    submitGuardRef.current = true
    setIsSubmitting(true)
    setSubmitError(null)

    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      zip_code: data.zipCode,
      help_type: data.helpType,
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

  const renderStep = () => {
    switch (step) {
      case 1: {
        const isFinancing = variant === 'financing'
        const headline = isFinancing ? (
          <>
            Check if You Qualify for Roof Replacement with{' '}
            <span style={{ color: 'var(--pb-primary)' }}>No Upfront Cost &amp; 0% Interest</span>
          </>
        ) : (
          <>
            Get Your <span style={{ color: 'var(--pb-primary)' }}>Free</span> Roof Estimate &amp; Consultation
          </>
        )
        const subtitle = isFinancing
          ? 'Enter your ZIP code to check eligibility in your area.'
          : 'Enter your ZIP code to see if we service your area.'
        return (
          <div key="step1" className="pb-slide-up">
            <h2 className="pb-serif" style={{
              fontSize: 'clamp(1.5rem, 4vw, 1.85rem)',
              fontWeight: 700,
              marginBottom: 8,
              lineHeight: 1.2,
              color: 'var(--pb-card-fg)',
            }}>
              {headline}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--pb-muted-fg)', marginBottom: 22, lineHeight: 1.5 }}>
              {subtitle}
            </p>
            <InputStep
              label="ZIP Code"
              placeholder="Enter your 5-digit ZIP code"
              defaultValue={formData.zipCode}
              error={errors.zipCode}
              onSubmit={v => handleInputSubmit('zipCode', v)}
              inputMode="numeric"
              maxLength={5}
              buttonText="Continue"
            />
            {renderBadges()}
          </div>
        )
      }

      case 2:
        return (
          <div key="step2" className="pb-slide-up">
            <h2 className="pb-serif" style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 1.7rem)',
              fontWeight: 700,
              marginBottom: 22,
              lineHeight: 1.25,
              color: 'var(--pb-card-fg)',
            }}>
              What do you need help with?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {HELP_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`pb-btn-form ${formData.helpType === opt.value ? 'pb-btn-selected' : ''}`}
                  onClick={() => handleOptionSelect(opt.value)}
                >
                  {opt.label}
                  <ArrowRight size={16} style={{ opacity: 0.4 }} />
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div key="step3" className="pb-slide-up">
            <h2 className="pb-serif" style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 1.7rem)',
              fontWeight: 700,
              marginBottom: 22,
              lineHeight: 1.25,
              color: 'var(--pb-card-fg)',
            }}>
              What&apos;s your name?
            </h2>
            <InputStep
              label="Full Name"
              placeholder="Enter your full name"
              defaultValue={formData.name}
              error={errors.name}
              onSubmit={v => handleInputSubmit('name', v)}
              buttonText="Continue"
            />
          </div>
        )

      case 4:
        return (
          <div key="step4" className="pb-slide-up">
            <h2 className="pb-serif" style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 1.7rem)',
              fontWeight: 700,
              marginBottom: 8,
              lineHeight: 1.25,
              color: 'var(--pb-card-fg)',
            }}>
              What&apos;s your email address?
            </h2>
            <p style={{ fontSize: 14, color: 'var(--pb-muted-fg)', marginBottom: 22, lineHeight: 1.5 }}>
              We&apos;ll use this to send your consultation details.
            </p>
            <InputStep
              label="Email Address"
              placeholder="you@example.com"
              defaultValue={formData.email}
              error={errors.email}
              onSubmit={v => handleInputSubmit('email', v)}
              type="email"
              inputMode="email"
              buttonText="Continue"
            />
          </div>
        )

      case 5:
        return (
          <div key="step5" className="pb-slide-up">
            <h2 className="pb-serif" style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 1.7rem)',
              fontWeight: 700,
              marginBottom: 8,
              lineHeight: 1.25,
              color: 'var(--pb-card-fg)',
            }}>
              What&apos;s the best number to reach you?
            </h2>
            <p style={{ fontSize: 14, color: 'var(--pb-muted-fg)', marginBottom: 22, lineHeight: 1.5 }}>
              A Peak Builders roofing specialist will contact you to schedule your free roof estimate &amp; consultation.
            </p>
            <InputStep
              label="Phone Number"
              placeholder="(555) 555-5555"
              defaultValue={formData.phone}
              error={errors.phone}
              onSubmit={v => handleInputSubmit('phone', v)}
              type="tel"
              inputMode="tel"
              buttonText={isSubmitting ? 'Submitting...' : 'Get My Free Estimate'}
              isLoading={isSubmitting}
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
            <p style={{
              fontSize: 11,
              color: 'var(--pb-muted-fg)',
              marginTop: 16,
              lineHeight: 1.5,
              textAlign: 'center',
            }}>
              By submitting, you agree to be contacted by Peak Builders &amp; Roofers regarding your roofing consultation. Message/data rates may apply.
            </p>
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
      {renderProgressBar()}
      {renderStep()}
    </div>
  )
}

interface InputStepProps {
  label: string
  placeholder: string
  defaultValue: string
  error?: string
  onSubmit: (value: string) => void
  type?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email'
  maxLength?: number
  buttonText: string
  isLoading?: boolean
}

function InputStep({
  label, placeholder, defaultValue, error,
  onSubmit, type = 'text', inputMode = 'text', maxLength,
  buttonText, isLoading = false,
}: InputStepProps) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => { setValue(defaultValue) }, [defaultValue])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(value)
  }, [value, onSubmit])

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
        onChange={e => setValue(e.target.value)}
        maxLength={maxLength}
        autoFocus
      />
      {error && (
        <p style={{ color: 'var(--pb-destructive)', fontSize: 13 }} className="pb-fade-in">
          {error}
        </p>
      )}
      <button type="submit" className="pb-btn-cta" style={{ marginTop: 8 }} disabled={isLoading}>
        {isLoading && <Loader2 size={16} style={{ animation: 'pbSpin 1s linear infinite' }} />}
        {buttonText}
        {!isLoading && <ArrowRight size={16} />}
      </button>
    </form>
  )
}
