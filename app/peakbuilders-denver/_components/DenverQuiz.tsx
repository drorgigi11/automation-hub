'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Loader2, Home, Check, ShieldCheck } from 'lucide-react'

interface FormData {
  homeowner: string
  goals: string[]
  zipCode: string
  name: string
  email: string
  phone: string
}

const HOMEOWNER_OPTIONS = [
  { value: 'yes', label: 'Yes, I am' },
  { value: 'no', label: 'No' },
]

const GOAL_OPTIONS = [
  { value: 'finish-unfinished', label: 'Finish an unfinished basement' },
  { value: 'extra-bedroom', label: 'Add an extra bedroom' },
  { value: 'bathroom', label: 'Add a bathroom' },
  { value: 'home-office', label: 'Create a home office' },
  { value: 'family-room', label: 'Create a family room / entertainment space' },
  { value: 'gym-hobby', label: 'Add a gym or hobby room' },
  { value: 'full-remodel', label: 'Full basement remodel' },
  { value: 'not-sure', label: "I'm not sure yet" },
]

const labelFor = (value: string) =>
  GOAL_OPTIONS.find(o => o.value === value)?.label ?? value

export default function DenverQuiz() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    homeowner: '',
    goals: [],
    zipCode: '',
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [disqualified, setDisqualified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const submitGuardRef = useRef(false)
  const totalSteps = 6

  const validateZipCode = (zip: string) => /^\d{5}$/.test(zip)
  const validatePhone = (phone: string) => phone.replace(/\D/g, '').length >= 10
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const goToNextStep = () => setStep(prev => Math.min(prev + 1, totalSteps + 1))

  const handleHomeownerSelect = (value: string) => {
    setFormData(prev => ({ ...prev, homeowner: value }))
    if (value === 'no') {
      setTimeout(() => setDisqualified(true), 250)
    } else {
      setTimeout(goToNextStep, 250)
    }
  }

  const handleDisqualifiedBack = () => {
    setDisqualified(false)
    setFormData(prev => ({ ...prev, homeowner: '' }))
  }

  const toggleGoal = (value: string) => {
    setFormData(prev => {
      const has = prev.goals.includes(value)
      // "I'm not sure yet" is exclusive — picking it clears the rest, and
      // picking anything else clears it.
      if (value === 'not-sure') {
        return { ...prev, goals: has ? [] : ['not-sure'] }
      }
      const next = has
        ? prev.goals.filter(g => g !== value)
        : [...prev.goals.filter(g => g !== 'not-sure'), value]
      return { ...prev, goals: next }
    })
    setErrors(prev => ({ ...prev, goals: undefined }))
  }

  const handleGoalsContinue = () => {
    if (formData.goals.length === 0) {
      setErrors(prev => ({ ...prev, goals: 'Please choose at least one option' }))
      return
    }
    goToNextStep()
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

    const params =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
    const goalLabels = data.goals.map(labelFor)
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      zip_code: data.zipCode,
      homeowner: data.homeowner,
      ownership: data.homeowner === 'yes' ? 'Yes, I am the homeowner' : 'No',
      // Basement goals — sent under several stable aliases so the notification
      // email and any future CRM mapping all surface them.
      basement_goals: goalLabels,
      interested_multiple: goalLabels,
      project_type: goalLabels.join(', '),
      landing_page: 'peakbuilders-denver',
      page_url: typeof window !== 'undefined' ? window.location.href : null,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term'),
      fbclid: params.get('fbclid'),
      gclid: params.get('gclid'),
      submitted_at: new Date().toISOString(),
    }

    try {
      const res = await fetch('/api/peakbuilders-denver/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
    } catch (err) {
      console.error('Lead submit failed:', err)
      setSubmitError('Something went wrong. Please try again in a moment.')
      setIsSubmitting(false)
      submitGuardRef.current = false
      return
    }

    router.push('/peakbuilders-denver/thank-you')
  }

  const renderProgressBar = () => (
    <div className="pbd-progress">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className={`pbd-progress-seg${i < step ? ' is-done' : ''}`} />
      ))}
    </div>
  )

  const questionHeading = (text: string, marginBottom = 14) => (
    <p
      style={{
        fontSize: 'clamp(1.05rem, 2.6vw, 1.2rem)',
        fontWeight: 700,
        color: 'var(--pb-card-fg)',
        marginBottom,
        lineHeight: 1.35,
      }}
    >
      {text}
    </p>
  )

  const inputHeading = (text: string, marginBottom = 22) => (
    <h2
      className="pb-serif"
      style={{
        fontSize: 'clamp(1.4rem, 3.5vw, 1.7rem)',
        fontWeight: 700,
        marginBottom,
        lineHeight: 1.25,
        color: 'var(--pb-card-fg)',
      }}
    >
      {text}
    </h2>
  )

  const renderStep = () => {
    if (disqualified) {
      return (
        <div key="disqualified" className="pb-slide-up" style={{ textAlign: 'center', padding: '8px 0' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 9999,
              background: 'rgba(10,31,61,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              color: 'var(--pb-primary)',
            }}
          >
            <Home size={24} />
          </div>
          <h2
            className="pb-serif"
            style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 1.7rem)',
              fontWeight: 700,
              marginBottom: 12,
              lineHeight: 1.25,
              color: 'var(--pb-card-fg)',
            }}
          >
            Thanks for your interest
          </h2>
          <p style={{ fontSize: 15, color: 'var(--pb-muted-fg)', marginBottom: 24, lineHeight: 1.55 }}>
            Our basement finishing consultations are for homeowners. If you own the home, head back
            and let us know — we&apos;d love to help with your basement project.
          </p>
          <button type="button" className="pb-btn-cta" onClick={handleDisqualifiedBack}>
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      )
    }

    switch (step) {
      case 1:
        return (
          <div key="step1" className="pb-slide-up">
            {questionHeading('Are you the homeowner?', 4)}
            <p style={{ fontSize: 13, color: 'var(--pb-muted-fg)', marginBottom: 16 }}>
              Click your answer to continue.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {HOMEOWNER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`pb-btn-form ${formData.homeowner === opt.value ? 'pb-btn-selected' : ''}`}
                  onClick={() => handleHomeownerSelect(opt.value)}
                >
                  {opt.label}
                  <ArrowRight size={16} style={{ opacity: 0.4 }} />
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div key="step2" className="pb-slide-up">
            {questionHeading('What would you like to do with your basement?', 4)}
            <p style={{ fontSize: 13, color: 'var(--pb-muted-fg)', marginBottom: 16 }}>
              Select all that apply.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {GOAL_OPTIONS.map(opt => {
                const selected = formData.goals.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    className={`pb-btn-form ${selected ? 'pb-btn-selected' : ''}`}
                    onClick={() => toggleGoal(opt.value)}
                  >
                    {opt.label}
                    <span
                      style={{
                        flexShrink: 0,
                        width: 20,
                        height: 20,
                        borderRadius: 5,
                        border: selected ? 'none' : '1.5px solid var(--pb-input-border)',
                        background: selected ? 'rgba(255,255,255,0.22)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {selected && <Check size={14} />}
                    </span>
                  </button>
                )
              })}
            </div>
            {errors.goals && (
              <p style={{ color: 'var(--pb-destructive)', fontSize: 13, marginTop: 10 }} className="pb-fade-in">
                {errors.goals}
              </p>
            )}
            <button type="button" className="pb-btn-cta" style={{ marginTop: 18 }} onClick={handleGoalsContinue}>
              Continue
              <ArrowRight size={16} />
            </button>
          </div>
        )

      case 3:
        return (
          <div key="step3" className="pb-slide-up">
            {inputHeading("What's your ZIP code?")}
            <p className="pb-why">
              <b>Why we ask:</b> We use your ZIP code to confirm that your home is within our Denver
              service area.
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
          </div>
        )

      case 4:
        return (
          <div key="step4" className="pb-slide-up">
            {inputHeading("What's your name?")}
            <p className="pb-why">
              <b>Why we ask:</b> So our team knows who to ask for when we contact you.
            </p>
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

      case 5:
        return (
          <div key="step5" className="pb-slide-up">
            {inputHeading("What's your email address?")}
            <p className="pb-why">
              <b>Why we ask:</b> We may send your consultation details or project information by email.
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

      case 6:
        return (
          <div key="step6" className="pb-slide-up">
            {inputHeading('What’s the best phone number to reach you?')}
            <p className="pb-why">
              <b>Why we ask:</b> A Peak Builders Denver team member will call you to review your
              basement goals and help schedule your free consultation.
            </p>
            <InputStep
              label="Phone Number"
              placeholder="(555) 555-5555"
              defaultValue={formData.phone}
              error={errors.phone}
              onSubmit={v => handleInputSubmit('phone', v)}
              type="tel"
              inputMode="tel"
              buttonText={isSubmitting ? 'Submitting...' : 'Start With a Free Basement Design Consultation'}
              isLoading={isSubmitting}
            />
            {submitError && (
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--pb-destructive)',
                  marginTop: 12,
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
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
    <div>
      {!disqualified && (
        <h2
          className="pb-serif"
          style={{
            fontSize: 'clamp(1.25rem, 3.2vw, 1.5rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: 'var(--pb-card-fg)',
            marginBottom: 12,
          }}
        >
          Get Your Free Basement Design Consultation
        </h2>
      )}
      {!disqualified && (
        <div className="pbd-card-kicker">
          <ShieldCheck size={14} color="var(--pb-gold)" />
          Free &amp; no obligation · takes 60 seconds
        </div>
      )}
      {!disqualified && renderProgressBar()}
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
  label,
  placeholder,
  defaultValue,
  error,
  onSubmit,
  type = 'text',
  inputMode = 'text',
  maxLength,
  buttonText,
  isLoading = false,
}: InputStepProps) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(value)
    },
    [value, onSubmit]
  )

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--pb-muted-fg)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
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
