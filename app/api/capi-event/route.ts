import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const STATUS_MAP: Record<string, { event_name: string; value: number }> = {
  'Meeting Set Up':   { event_name: 'Contact',          value: 500 },
  'Meeting Occurred': { event_name: 'MeetingOccurred',  value: 1500 },
  'Won':              { event_name: 'Purchase',         value: 8000 },
  'Payment':          { event_name: 'Purchase',         value: 8000 },
  'Lost':             { event_name: 'Lost',             value: 200 },
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

function hashPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return crypto.createHash('sha256').update(digits).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { secret, status, name, email, phone, test_event_code } = body

    if (secret !== (process.env.WEBHOOK_SECRET ?? '').trim()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mapping = STATUS_MAP[status]
    if (!mapping) {
      return NextResponse.json({ error: `Unknown status: ${status}` }, { status: 400 })
    }

    const user_data: Record<string, unknown> = {}

    if (email) user_data.em = [sha256(email)]
    if (phone) user_data.ph = [hashPhone(phone)]

    if (name) {
      const parts = String(name).trim().split(/\s+/)
      if (parts[0]) user_data.fn = [sha256(parts[0])]
      if (parts[1]) user_data.ln = [sha256(parts.slice(1).join(' '))]
    }

    const pixelId = process.env.FACEBOOK_PIXEL_ID
    const token = process.env.FACEBOOK_SYSTEM_USER_TOKEN

    const payload: Record<string, unknown> = {
      ...(test_event_code ? { test_event_code } : {}),
      data: [
        {
          event_name: mapping.event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: crypto.randomUUID(),
          action_source: 'system_generated',
          user_data,
          custom_data: {
            value: mapping.value,
            currency: 'USD',
          },
        },
      ],
    }

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    const result = await res.json()

    if (!res.ok) {
      console.error('CAPI error:', result)
      return NextResponse.json({ error: result }, { status: 500 })
    }

    return NextResponse.json({ ok: true, event: mapping.event_name, result })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('CAPI route error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
