'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react'

/* ------------------------------------------------------------------ *
 *  Renovision — "Beat Your Quote" Undercut funnel
 *  Reuses the shared renovision-theme (rv-* classes / --rv-* vars from
 *  app/(landing)/layout.tsx). Posts to /api/webhooks/lovable and routes
 *  to /renovision/undercut/thank-you.
 * ------------------------------------------------------------------ */

interface QuizData {
  projectType: string
  quoteStatus: string
  budgetQuoted: string
  details: string
  name: string
  email: string
  phone: string
  zipCode: string
}

const PROJECT_OPTIONS = [
  { value: 'kitchen', label: 'Kitchen Remodel' },
  { value: 'bathroom', label: 'Bathroom Remodel' },
  { value: 'full-home', label: 'Full Home Renovation' },
  { value: 'addition-adu', label: 'Addition / ADU' },
  { value: 'outdoor', label: 'Outdoor project (deck, pergola, etc.)' },
  { value: 'other', label: 'Another home improvement project' },
]

const QUOTE_STATUS_OPTIONS = [
  { value: 'rough-number', label: 'I just have a rough number' },
  { value: 'detailed-no-3d', label: 'I have a detailed estimate, but no 3D design' },
  { value: 'full-design-price', label: 'I have a full design and price' },
  { value: 'no-quote', label: "I don't have a quote yet" },
]

const BUDGET_OPTIONS = [
  { value: 'under-30k', label: 'Under $30K' },
  { value: '30k-60k', label: '$30K - $60K' },
  { value: '60k-100k', label: '$60K - $100K' },
  { value: '100k-plus', label: '$100K+' },
]

const labelFor = (options: { value: string; label: string }[], value: string) =>
  options.find(o => o.value === value)?.label ?? value

export default function UndercutQuiz({
  onProjectType,
}: {
  onProjectType?: (label: string) => void
}) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const [data, setData] = useState<QuizData>({
    projectType: '',
    quoteStatus: '',
    budgetQuoted: '',
    details: '',
    name: '',
    email: '',
    phone: '',
    zipCode: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof QuizData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const submitGuardRef = useRef(false)
  const totalSteps = 5

  const validateZipCode = (zip: string) => /^\d{5}$/.test(zip)
  const validatePhone = (phone: string) => /^[\d\s\-()]{10,}$/.test(phone.replace(/\D/g, ''))
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const goToNextStep = () => {
    setDirection('up')
    setStep(prev => Math.min(prev + 1, totalSteps + 1))
  }

  const goToPrevStep = () => {
    setSubmitError(null)
    setDirection('down')
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSingleSelect = (field: keyof QuizData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
    if (field === 'projectType') onProjectType?.(labelFor(PROJECT_OPTIONS, value))
    setTimeout(goToNextStep, 140)
  }

  const handleSubmit = async (final: QuizData) => {
    if (submitGuardRef.current) return
    submitGuardRef.current = true
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const projectLabel = labelFor(PROJECT_OPTIONS, final.projectType)
      const quoteLabel = labelFor(QUOTE_STATUS_OPTIONS, final.quoteStatus)
      const budgetLabel = labelFor(BUDGET_OPTIONS, final.budgetQuoted)

      const message = [
        `Project: ${projectLabel}`,
        `Quote status: ${quoteLabel}`,
        `Budget quoted: ${budgetLabel}`,
        final.details.trim() ? `Details: ${final.details.trim()}` : null,
      ]
        .filter(Boolean)
        .join('\n')

      const payload = {
        name: final.name,
        email: final.email,
        phone: final.phone,
        client: 'renovision',
        variant: 'undercut',
        zip_code: final.zipCode,
        project_type: projectLabel,
        quote_status: quoteLabel,
        budget_quoted: budgetLabel,
        details: final.details.trim() || null,
        message,
        submitted_at: new Date().toISOString(),
      }

      const res = await fetch('/api/webhooks/lovable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to submit')

      router.push('/renovision/undercut/thank-you')
    } catch {
      setSubmitError('Something went wrong. Please try again.')
      setIsSubmitting(false)
      submitGuardRef.current = false
    }
  }

  const animClass = direction === 'up' ? 'rv-slide-up' : 'rv-slide-down'

  const renderProgressBar = () => (
    <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 4,
            flex: 1,
            borderRadius: 9999,
            background: i < step ? 'var(--rv-primary)' : 'rgba(255,255,255,0.2)',
            transition: 'background 0.5s',
          }}
        />
      ))}
    </div>
  )

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SelectStep
            key="step1"
            animClass={animClass}
            heading="What type of project are you planning?"
            options={PROJECT_OPTIONS}
            selected={data.projectType}
            onSelect={v => handleSingleSelect('projectType', v)}
          />
        )
      case 2:
        return (
          <SelectStep
            key="step2"
            animClass={animClass}
            heading="What is the status of your current quote?"
            options={QUOTE_STATUS_OPTIONS}
            selected={data.quoteStatus}
            onSelect={v => handleSingleSelect('quoteStatus', v)}
          />
        )
      case 3:
        return (
          <SelectStep
            key="step3"
            animClass={animClass}
            heading="What budget range were you quoted?"
            options={BUDGET_OPTIONS}
            selected={data.budgetQuoted}
            onSelect={v => handleSingleSelect('budgetQuoted', v)}
          />
        )
      case 4:
        return (
          <DetailsStep
            key="step4"
            animClass={animClass}
            defaultValue={data.details}
            onContinue={v => {
              setData(prev => ({ ...prev, details: v }))
              goToNextStep()
            }}
            onSkip={() => {
              setData(prev => ({ ...prev, details: '' }))
              goToNextStep()
            }}
          />
        )
      case 5:
        return (
          <ContactStep
            key="step5"
            animClass={animClass}
            data={data}
            errors={errors}
            isSubmitting={isSubmitting}
            onSubmit={values => {
              const next: Partial<Record<keyof QuizData, string>> = {}
              if (!values.name.trim()) next.name = 'Please enter your name'
              if (!validateEmail(values.email)) next.email = 'Please enter a valid email address'
              if (!validatePhone(values.phone)) next.phone = 'Please enter a valid US phone number'
              if (!validateZipCode(values.zipCode)) next.zipCode = 'Please enter a valid 5-digit ZIP code'

              if (Object.keys(next).length > 0) {
                setErrors(next)
                return
              }
              setErrors({})
              const merged = { ...data, ...values }
              setData(merged)
              handleSubmit(merged)
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      className="uc-quiz"
      style={{
        background: 'var(--rv-card)',
        borderRadius: 12,
        padding: '2rem',
        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
      }}
    >
      {/* Snappier step transitions, scoped to this funnel only */}
      <style>{`
        .uc-quiz .rv-slide-up { animation-duration: 0.28s; }
        .uc-quiz .rv-slide-down { animation-duration: 0.28s; }
      `}</style>
      <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 8 }}>
        <p style={{ fontSize: 13, color: 'var(--rv-muted-fg)', letterSpacing: '0.05em', marginBottom: 12 }}>
          Free, no-obligation
        </p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: 'var(--rv-card-fg)', lineHeight: 1.2, marginBottom: 8 }}>
          Second Opinion
          <span style={{ color: 'var(--rv-primary)' }}> Proposal </span>
          Review
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
          See if we can beat your current quote
        </p>
        <div style={{ width: 48, height: 2, background: 'rgba(230,144,32,0.4)', margin: '20px auto 0' }} />
      </div>

      {step > 1 && !isSubmitting && (
        <button
          type="button"
          onClick={goToPrevStep}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            padding: 0,
            marginBottom: 14,
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.65)',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={15} /> Back
        </button>
      )}

      {renderProgressBar()}
      {renderStep()}

      {submitError && (
        <p style={{ color: 'var(--rv-destructive)', fontSize: 14, marginTop: 12, textAlign: 'center' }}>
          {submitError}
        </p>
      )}

      <p style={{ textAlign: 'center', color: 'var(--rv-muted-fg)', fontSize: 12, marginTop: 24 }}>
        Your answers help us prepare an accurate, side-by-side review of your quote
      </p>
    </div>
  )
}

/* ----------------------------- Select step ----------------------------- */

interface SelectStepProps {
  animClass: string
  heading: string
  options: { value: string; label: string }[]
  selected: string
  onSelect: (value: string) => void
}

function SelectStep({ animClass, heading, options, selected, onSelect }: SelectStepProps) {
  return (
    <div className={animClass}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 20, color: 'var(--rv-card-fg)', lineHeight: 1.3 }}>
        {heading} <span style={{ color: 'var(--rv-primary)' }}>*</span>
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map(opt => (
          <button
            key={opt.value}
            className={`rv-btn-form ${selected === opt.value ? 'rv-btn-selected' : ''}`}
            onClick={() => onSelect(opt.value)}
          >
            {opt.label}
            {selected === opt.value && <Check size={18} />}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------- Details step ----------------------------- */

interface DetailsStepProps {
  animClass: string
  defaultValue: string
  onContinue: (value: string) => void
  onSkip: () => void
}

function DetailsStep({ animClass, defaultValue, onContinue, onSkip }: DetailsStepProps) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <div className={animClass}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16, color: 'var(--rv-card-fg)', lineHeight: 1.3 }}>
        Tell us a little more about the quote you received and your project.
      </h2>
      <textarea
        className="rv-input"
        style={{ minHeight: 120, resize: 'vertical', fontFamily: 'inherit' }}
        placeholder="Example: What work is included, what price you were quoted, what feels unclear, or what you'd like us to improve."
        value={value}
        onChange={e => setValue(e.target.value)}
        autoFocus
      />
      <p style={{ fontSize: 12, color: 'var(--rv-muted-fg)', marginTop: 8 }}>
        Optional. You can skip this step if you prefer.
      </p>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button
          className="rv-btn-cta"
          style={{ flex: 1 }}
          onClick={() => onContinue(value)}
        >
          Continue <ArrowRight size={16} />
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            flex: '0 0 auto',
            padding: '16px 20px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.8)',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Skip This Step
        </button>
      </div>
    </div>
  )
}

/* ----------------------------- Contact step ----------------------------- */

interface ContactValues {
  name: string
  email: string
  phone: string
  zipCode: string
}

interface ContactStepProps {
  animClass: string
  data: QuizData
  errors: Partial<Record<keyof QuizData, string>>
  isSubmitting: boolean
  onSubmit: (values: ContactValues) => void
}

function ContactStep({ animClass, data, errors, isSubmitting, onSubmit }: ContactStepProps) {
  const [values, setValues] = useState<ContactValues>({
    name: data.name,
    email: data.email,
    phone: data.phone,
    zipCode: data.zipCode,
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(values)
    },
    [values, onSubmit]
  )

  const field = (key: keyof ContactValues, v: string) =>
    setValues(prev => ({ ...prev, [key]: v }))

  return (
    <div className={animClass}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16, color: 'var(--rv-card-fg)', lineHeight: 1.3 }}>
        Where should we send your second opinion? <span style={{ color: 'var(--rv-primary)' }}>*</span>
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <input
            className={`rv-input${errors.name ? ' rv-input-error' : ''}`}
            type="text"
            placeholder="Full name"
            value={values.name}
            onChange={e => field('name', e.target.value)}
            autoFocus
          />
          {errors.name && <p style={{ color: 'var(--rv-destructive)', fontSize: 13, marginTop: 4 }}>{errors.name}</p>}
        </div>
        <div>
          <input
            className={`rv-input${errors.email ? ' rv-input-error' : ''}`}
            type="email"
            inputMode="email"
            placeholder="Email address"
            value={values.email}
            onChange={e => field('email', e.target.value)}
          />
          {errors.email && <p style={{ color: 'var(--rv-destructive)', fontSize: 13, marginTop: 4 }}>{errors.email}</p>}
        </div>
        <div>
          <input
            className={`rv-input${errors.phone ? ' rv-input-error' : ''}`}
            type="tel"
            inputMode="tel"
            placeholder="Phone number"
            value={values.phone}
            onChange={e => field('phone', e.target.value)}
          />
          {errors.phone && <p style={{ color: 'var(--rv-destructive)', fontSize: 13, marginTop: 4 }}>{errors.phone}</p>}
        </div>
        <div>
          <input
            className={`rv-input${errors.zipCode ? ' rv-input-error' : ''}`}
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="ZIP code"
            value={values.zipCode}
            onChange={e => field('zipCode', e.target.value)}
          />
          {errors.zipCode && <p style={{ color: 'var(--rv-destructive)', fontSize: 13, marginTop: 4 }}>{errors.zipCode}</p>}
        </div>
        <button type="submit" className="rv-btn-cta" style={{ marginTop: 4 }} disabled={isSubmitting}>
          {isSubmitting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
          {isSubmitting ? 'Submitting...' : 'Get My Free Proposal Review'}
          {!isSubmitting && <ArrowRight size={16} />}
        </button>
      </form>
    </div>
  )
}
