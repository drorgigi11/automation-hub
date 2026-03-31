'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Copy, CheckCheck, ExternalLink } from 'lucide-react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://your-domain.com'

const webhooks = [
  {
    source: 'Facebook Ads',
    color: '#60A5FA',
    endpoint: '/api/webhooks/facebook',
    method: 'GET + POST',
    description: 'חבר ב-Facebook Developers → Webhooks → leadgen',
    steps: [
      'כנס ל-developers.facebook.com',
      'בחר את האפליקציה שלך',
      'עבור ל-Webhooks → Add Subscription → Page → leadgen',
      'הדבק את ה-URL ואת ה-Verify Token מה-.env',
    ],
  },
  {
    source: 'Elementor',
    color: '#A78BFA',
    endpoint: '/api/webhooks/elementor',
    method: 'POST',
    description: 'הוסף Webhook Action לטופס Elementor',
    steps: [
      'ערוך את הטופס ב-Elementor',
      'עבור ל-Actions After Submit',
      'הוסף "Webhook"',
      'הדבק את ה-URL',
    ],
  },
  {
    source: 'Lovable',
    color: '#F472B6',
    endpoint: '/api/webhooks/lovable',
    method: 'POST',
    description: 'הגדר Webhook בהגדרות הטופס ב-Lovable',
    steps: [
      'פתח את הפרויקט ב-Lovable',
      'עבור להגדרות הטופס',
      'הוסף Webhook URL',
      'שמור',
    ],
  },
]

export default function WebhooksPage() {
  const [copied, setCopied] = useState<string | null>(null)

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Webhooks</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
            ה-URLs שצריך לחבר בכל פלטפורמה
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {webhooks.map((wh) => {
            const fullUrl = `${BASE_URL}${wh.endpoint}`
            return (
              <div
                key={wh.source}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: wh.color,
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{wh.source}</span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: 'var(--surface)',
                      fontSize: 11,
                      color: 'var(--text-secondary)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {wh.method}
                  </span>
                </div>

                <div style={{ padding: 24 }}>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 16px' }}>
                    {wh.description}
                  </p>

                  {/* URL Box */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      padding: '10px 14px',
                      marginBottom: 20,
                    }}
                  >
                    <code style={{ flex: 1, fontSize: 13, color: wh.color, wordBreak: 'break-all' }}>
                      {fullUrl}
                    </code>
                    <button
                      onClick={() => copy(fullUrl, wh.source)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: copied === wh.source ? '#4CAF7C' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 13,
                        padding: '4px 8px',
                        borderRadius: 6,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {copied === wh.source ? <CheckCheck size={15} /> : <Copy size={15} />}
                      {copied === wh.source ? 'הועתק!' : 'העתק'}
                    </button>
                  </div>

                  {/* Steps */}
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      הוראות חיבור
                    </p>
                    <ol style={{ margin: 0, paddingRight: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {wh.steps.map((step, i) => (
                        <li key={i} style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Env vars reminder */}
        <div
          style={{
            marginTop: 24,
            background: 'rgba(108,99,255,0.08)',
            border: '1px solid rgba(108,99,255,0.25)',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <p style={{ fontWeight: 600, margin: '0 0 10px', fontSize: 14 }}>
            ⚙️ הגדרת NEXT_PUBLIC_BASE_URL
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 10px' }}>
            הוסף ל-.env.local את הדומיין שלך:
          </p>
          <code
            style={{
              display: 'block',
              background: 'var(--surface)',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 13,
              color: '#A78BFA',
            }}
          >
            NEXT_PUBLIC_BASE_URL=https://your-domain.com
          </code>
        </div>
      </main>
    </div>
  )
}
