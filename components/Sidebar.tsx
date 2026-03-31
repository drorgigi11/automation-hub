'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Users, Settings, Link2 } from 'lucide-react'

const nav = [
  { href: '/', label: 'לידים', icon: Users },
  { href: '/connections', label: 'חיבורים', icon: Link2 },
  { href: '/webhooks', label: 'Webhooks', icon: Zap },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
            AutoHub
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: active ? '#fff' : 'var(--text-secondary)',
                background: active ? 'var(--accent)' : 'transparent',
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                transition: 'all 0.15s',
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0 12px' }}>
        <Link
          href="/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 8,
            textDecoration: 'none',
            color: 'var(--text-secondary)',
            fontSize: 14,
          }}
        >
          <Settings size={16} />
          הגדרות
        </Link>
      </div>
    </aside>
  )
}
