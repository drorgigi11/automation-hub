'use client'

import { useEffect, useState } from 'react'
import { supabase, Lead } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import SourceBadge from '@/components/SourceBadge'
import { CheckCircle2, Clock, RefreshCw, Users } from 'lucide-react'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)
      setLeads(data ?? [])
      setLoading(false)
    }
    load()

    const channel = supabase
      .channel('leads-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          setLeads((prev) => [payload.new as Lead, ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'leads' },
        (payload) => {
          setLeads((prev) =>
            prev.map((l) => (l.id === payload.new.id ? (payload.new as Lead) : l))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filtered = filter === 'all' ? leads : leads.filter((l) => l.source === filter)

  const stats = {
    total: leads.length,
    synced: leads.filter((l) => l.synced_to_sheets).length,
    facebook: leads.filter((l) => l.source === 'facebook').length,
    elementor: leads.filter((l) => l.source === 'elementor').length,
    lovable: leads.filter((l) => l.source === 'lovable').length,
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>לידים</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
            כל הלידים שנכנסו בזמן אמת
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'סה״כ לידים', value: stats.total, color: 'var(--accent)' },
            { label: 'סונכרן לשיטס', value: stats.synced, color: '#4CAF7C' },
            { label: 'Facebook', value: stats.facebook, color: '#60A5FA' },
            { label: 'Elementor + Lovable', value: stats.elementor + stats.lovable, color: '#A78BFA' },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '20px 24px',
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {/* Filter bar */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            {['all', 'facebook', 'elementor', 'lovable'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: filter === f ? 600 : 400,
                  background: filter === f ? 'var(--accent)' : 'var(--surface)',
                  color: filter === f ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                }}
              >
                {f === 'all' ? 'הכל' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: '#4CAF7C', fontSize: 13 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#4CAF7C',
                  display: 'inline-block',
                }}
              />
              עדכון חי
            </div>
          </div>

          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-secondary)' }}>
              <RefreshCw size={24} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Users size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p style={{ margin: 0 }}>אין לידים עדיין</p>
              <p style={{ fontSize: 13, marginTop: 4, color: 'var(--text-secondary)' }}>
                לידים יופיעו כאן ברגע שיגיעו
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['מקור', 'סוג טופס', 'שם', 'אימייל', 'טלפון', 'הודעה', 'סנכרון', 'תאריך'].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr
                      key={lead.id}
                      style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLTableRowElement).style.background = 'var(--surface)'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLTableRowElement).style.background = 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <SourceBadge source={lead.source} rawData={lead.raw_data as Record<string, unknown>} />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontSize: 12,
                          background: 'var(--surface)',
                          color: 'var(--text-secondary)',
                        }}>
                          {lead.source === 'facebook' ? 'Facebook Form' : lead.source === 'lovable' ? 'Landing Page' : 'Website Form'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 14 }}>
                        {lead.name ?? <span style={{ color: 'var(--text-secondary)' }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--text-secondary)' }}>
                        {lead.email ?? '—'}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--text-secondary)' }}>
                        {lead.phone ?? '—'}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          fontSize: 13,
                          color: 'var(--text-secondary)',
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {lead.message ?? '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {lead.synced_to_sheets ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4CAF7C', fontSize: 13 }}>
                            <CheckCircle2 size={14} /> סונכרן
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: 13 }}>
                            <Clock size={14} /> ממתין
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {formatDate(lead.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
