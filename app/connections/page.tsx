'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import SourceBadge from '@/components/SourceBadge'
import { LeadSource, SheetConnection } from '@/lib/supabase'
import { Plus, Trash2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react'

const SOURCES: LeadSource[] = ['facebook', 'elementor', 'lovable']

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<SheetConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: '',
    sheet_id: '',
    sheet_tab: 'Sheet1',
    sources: [] as LeadSource[],
  })

  useEffect(() => {
    fetch('/api/connections')
      .then((r) => r.json())
      .then((data) => {
        setConnections(data)
        setLoading(false)
      })
  }, [])

  async function handleSave() {
    setError(null)
    if (!form.name || !form.sheet_id || !form.sources.length) {
      setError('נא למלא את כל השדות ולבחור לפחות מקור אחד')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setConnections((prev) => [data, ...prev])
      setShowForm(false)
      setForm({ name: '', sheet_id: '', sheet_tab: 'Sheet1', sources: [] })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('למחוק את החיבור הזה?')) return
    await fetch(`/api/connections?id=${id}`, { method: 'DELETE' })
    setConnections((prev) => prev.filter((c) => c.id !== id))
  }

  function toggleSource(s: LeadSource) {
    setForm((f) => ({
      ...f,
      sources: f.sources.includes(s)
        ? f.sources.filter((x) => x !== s)
        : [...f.sources, s],
    }))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>חיבורים</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
              חבר מקורות לידים לגוגל שיטס
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <Plus size={16} /> חיבור חדש
          </button>
        </div>

        {success && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 16px',
              background: 'rgba(76,175,124,0.15)',
              border: '1px solid rgba(76,175,124,0.3)',
              borderRadius: 8,
              color: '#4CAF7C',
              marginBottom: 20,
              fontSize: 14,
            }}
          >
            <CheckCircle2 size={16} /> החיבור נוצר בהצלחה! Headers נוספו לגיליון.
          </div>
        )}

        {/* New Connection Form */}
        {showForm && (
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--accent)',
              borderRadius: 12,
              padding: 24,
              marginBottom: 24,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>חיבור חדש</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>שם החיבור</label>
                <input
                  style={inputStyle}
                  placeholder="למשל: לידים אתר ראשי"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Google Sheet ID{' '}
                  <a
                    href="https://docs.google.com/spreadsheets"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--accent)', fontSize: 11 }}
                  >
                    <ExternalLink size={11} style={{ display: 'inline' }} /> פתח שיטס
                  </a>
                </label>
                <input
                  style={inputStyle}
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
                  value={form.sheet_id}
                  onChange={(e) => setForm((f) => ({ ...f, sheet_id: e.target.value }))}
                />
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                  מהכתובת: docs.google.com/spreadsheets/d/<strong>ID</strong>/edit
                </p>
              </div>
              <div>
                <label style={labelStyle}>שם הטאב (גיליון)</label>
                <input
                  style={inputStyle}
                  placeholder="Sheet1"
                  value={form.sheet_tab}
                  onChange={(e) => setForm((f) => ({ ...f, sheet_tab: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>מקורות לידים</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                {SOURCES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSource(s)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: `2px solid ${form.sources.includes(s) ? 'var(--accent)' : 'var(--border)'}`,
                      background: form.sources.includes(s) ? 'rgba(108,99,255,0.15)' : 'transparent',
                      color: form.sources.includes(s) ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: form.sources.includes(s) ? 600 : 400,
                      transition: 'all 0.15s',
                    }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 8,
                  color: '#EF4444',
                  marginBottom: 16,
                  fontSize: 13,
                }}
              >
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '10px 24px',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: 14,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'שומר...' : 'שמור חיבור'}
              </button>
              <button
                onClick={() => { setShowForm(false); setError(null) }}
                style={{
                  padding: '10px 20px',
                  background: 'var(--surface)',
                  color: 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                ביטול
              </button>
            </div>
          </div>
        )}

        {/* Connections List */}
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>טוען...</p>
        ) : connections.length === 0 ? (
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 60,
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <p style={{ margin: 0 }}>אין חיבורים עדיין</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>צור חיבור חדש לכדי לסנכרן לידים לגוגל שיטס</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {connections.map((conn) => (
              <div
                key={conn.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'rgba(76,175,124,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={20} color="#4CAF7C" />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{conn.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Sheet: <code style={{ fontSize: 11, background: 'var(--surface)', padding: '1px 6px', borderRadius: 4 }}>{conn.sheet_id.slice(0, 20)}...</code>
                    {' → '}טאב: <strong>{conn.sheet_tab}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    {conn.sources.map((s) => (
                      <SourceBadge key={s} source={s} />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(conn.id)}
                  style={{
                    padding: 8,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="מחק חיבור"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text-primary)',
  fontSize: 14,
  outline: 'none',
}
