'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Loader2 } from 'lucide-react'

interface FormData {
  interested: string
  interestedMultiple: string[]
  zipCode: string
  name: string
  phone: string
  email: string
}

interface LeadFormProps {
  variant?: 'kitchen' | 'general' | 'outdoor'
}

const KITCHEN_OPTIONS = [
  { value: 'yes', label: 'Yes, I am' },
  { value: 'no', label: 'No, I am not' },
]

const GENERAL_OPTIONS = [
  { value: 'kitchen', label: 'Kitchen remodeling' },
  { value: 'bathroom', label: 'Bathroom remodeling' },
  { value: 'full-home', label: 'Full home remodel / addition' },
  { value: 'garage-basement', label: 'Garage / basement conversion' },
  { value: 'outdoor', label: 'Outdoor project (deck, patio, etc.)' },
  { value: 'other', label: 'Other home improvement project' },
]

const OUTDOOR_OPTIONS = [
  { value: 'covered-patio', label: 'Covered patio' },
  { value: 'deck', label: 'Deck' },
  { value: 'jacuzzi', label: 'Jacuzzi' },
  { value: 'siding', label: 'Siding' },
  { value: 'hardscape', label: 'Hardscape' },
  { value: 'pavers', label: 'Pavers' },
]

export default function LeadForm({ variant = 'kitchen' }: LeadFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const [formData, setFormData] = useState<FormData>({
    interested: '',
    interestedMultiple: [],
    zipCode: '',
    name: '',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
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

  const handleOptionSelect = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setTimeout(goToNextStep, 300)
  }

  const handleMultiSelect = (value: string) => {
    setFormData(prev => {
      const current = prev.interestedMultiple
      if (current.includes(value)) {
        return { ...prev, interestedMultiple: current.filter(v => v !== value) }
      }
      return { ...prev, interestedMultiple: [...current, value] }
    })
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
        errorMessage = 'Please enter a valid US phone number'
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
    const updatedData = { ...formData, [field]: value }
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

    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        variant,
        zip_code: data.zipCode,
        interested: variant === 'kitchen' ? data.interested : null,
        interested_multiple: variant !== 'kitchen' ? data.interestedMultiple : null,
        submitted_at: new Date().toISOString(),
      }

      const res = await fetch('/api/webhooks/lovable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error('Failed to submit')
      }

      router.push('/renovision/thank-you')
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
        if (variant === 'general' || variant === 'outdoor') {
          const options = variant === 'outdoor' ? OUTDOOR_OPTIONS : GENERAL_OPTIONS
          return (
            <div key="step1" className={animClass}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8, color: 'var(--rv-card-fg)', lineHeight: 1.3 }}>
                What can we help you with? <span style={{ color: 'var(--rv-primary)' }}>*</span>
              </h2>
              <p style={{ fontSize: 13, color: 'var(--rv-muted-fg)', marginBottom: 16 }}>Select all that apply</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {options.map(opt => (
                  <button
                    key={opt.value}
                    className={`rv-btn-form ${formData.interestedMultiple.includes(opt.value) ? 'rv-btn-selected' : ''}`}
                    onClick={() => handleMultiSelect(opt.value)}
                  >
                    {opt.label}
                    {formData.interestedMultiple.includes(opt.value) && <Check size={18} />}
                  </button>
                ))}
              </div>
              <button
                className="rv-btn-cta"
                style={{ marginTop: 20 }}
                disabled={formData.interestedMultiple.length === 0}
                onClick={goToNextStep}
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )
        }
        return (
          <div key="step1" className={animClass}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 20, color: 'var(--rv-card-fg)', lineHeight: 1.3 }}>
              Are you looking to remodel your kitchen? <span style={{ color: 'var(--rv-primary)' }}>*</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {KITCHEN_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`rv-btn-form ${formData.interested === opt.value ? 'rv-btn-selected' : ''}`}
                  onClick={() => handleOptionSelect('interested', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <InputStep
            key="step2"
            animClass={animClass}
            label="My ZIP code is..."
            placeholder="Enter your 5-digit ZIP code"
            defaultValue={formData.zipCode}
            error={errors.zipCode}
            onSubmit={v => handleInputSubmit('zipCode', v)}
            inputMode="numeric"
            maxLength={5}
          />
        )

      case 3:
        return (
          <InputStep
            key="step3"
            animClass={animClass}
            label="My name is..."
            placeholder="Enter your full name"
            defaultValue={formData.name}
            error={errors.name}
            onSubmit={v => handleInputSubmit('name', v)}
          />
        )

      case 4:
        return (
          <InputStep
            key="step4"
            animClass={animClass}
            label="My phone is..."
            placeholder="(555) 555-5555"
            defaultValue={formData.phone}
            error={errors.phone}
            onSubmit={v => handleInputSubmit('phone', v)}
            type="tel"
          />
        )

      case 5:
        return (
          <InputStep
            key="step5"
            animClass={animClass}
            label="My email is..."
            placeholder="you@example.com"
            defaultValue={formData.email}
            error={errors.email}
            onSubmit={v => handleInputSubmit('email', v)}
            type="email"
            buttonText={isSubmitting ? 'Submitting...' : 'Get My Free Quote'}
            isLoading={isSubmitting}
          />
        )

      default:
        return null
    }
  }

  return (
    <div style={{
      background: 'var(--rv-card)',
      borderRadius: 12,
      padding: '2rem',
      boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 8 }}>
        <p style={{ fontSize: 13, color: 'var(--rv-muted-fg)', letterSpacing: '0.05em', marginBottom: 12 }}>
          Fill in your details to receive
        </p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: 'var(--rv-card-fg)', lineHeight: 1.2, marginBottom: 8 }}>
          Free Design Consultation
          <span style={{ color: 'var(--rv-primary)' }}> & </span>
          Estimate
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
          For Your {variant === 'outdoor' ? 'Outdoor' : variant === 'general' ? 'Home Remodeling' : 'Kitchen'} Project
        </p>
        <div style={{ width: 48, height: 2, background: 'rgba(230,144,32,0.4)', margin: '20px auto 0' }} />
      </div>

      {renderProgressBar()}
      {renderStep()}

      {submitError && (
        <p style={{ color: 'var(--rv-destructive)', fontSize: 14, marginTop: 12, textAlign: 'center' }}>
          {submitError}
        </p>
      )}

      <p style={{ textAlign: 'center', color: 'var(--rv-muted-fg)', fontSize: 12, marginTop: 24 }}>
        Your answers help us prepare an accurate estimate for your project
      </p>
    </div>
  )
}

interface InputStepProps {
  animClass: string
  label: string
  placeholder: string
  defaultValue: string
  error?: string
  onSubmit: (value: string) => void
  type?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email'
  maxLength?: number
  buttonText?: string
  isLoading?: boolean
}

function InputStep({
  animClass, label, placeholder, defaultValue, error,
  onSubmit, type = 'text', inputMode = 'text', maxLength,
  buttonText = 'Continue', isLoading = false,
}: InputStepProps) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => { setValue(defaultValue) }, [defaultValue])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(value)
  }, [value, onSubmit])

  return (
    <div className={animClass}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16, color: 'var(--rv-card-fg)' }}>
        {label} <span style={{ color: 'var(--rv-primary)' }}>*</span>
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          className={`rv-input${error ? ' rv-input-error' : ''}`}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
          maxLength={maxLength}
          autoFocus
        />
        {error && (
          <p style={{ color: 'var(--rv-destructive)', fontSize: 13 }} className="rv-fade-in">
            {error}
          </p>
        )}
        <button type="submit" className="rv-btn-cta" style={{ marginTop: 4 }} disabled={isLoading}>
          {isLoading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
          {buttonText}
          {!isLoading && <ArrowRight size={16} />}
        </button>
      </form>
    </div>
  )
}
