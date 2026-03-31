import { NextRequest, NextResponse } from 'next/server'
import { processIncomingLead } from '@/lib/process-lead'

// Verify webhook
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WEBHOOK_SECRET) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

async function fetchLeadData(leadgenId: string) {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${leadgenId}?access_token=${token}`
  )
  if (!res.ok) throw new Error(`Graph API error: ${res.status}`)
  const data = await res.json()

  // field_data is an array like [{ name: "email", values: ["test@test.com"] }, ...]
  const fields: Record<string, string> = {}
  for (const field of data.field_data ?? []) {
    fields[field.name] = field.values?.[0] ?? ''
  }

  return {
    leadgen_id: leadgenId,
    form_id: data.form_id,
    ad_id: data.ad_id,
    name: (fields['full_name'] ?? fields['name'] ?? [fields['first_name'], fields['last_name']].filter(Boolean).join(' ')) || null,
    email: fields['email'] ?? null,
    phone: fields['phone_number'] ?? fields['phone'] ?? null,
    message: fields['message'] ?? null,
    ...fields,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const entries = body?.entry ?? []

    for (const entry of entries) {
      for (const change of entry?.changes ?? []) {
        if (change.field !== 'leadgen') continue

        const leadgenId = change.value?.leadgen_id
        if (!leadgenId) continue

        try {
          const leadData = await fetchLeadData(leadgenId)
          await processIncomingLead('facebook', leadData)
        } catch (err) {
          console.error(`Failed to fetch lead ${leadgenId}:`, err)
          // Save raw data as fallback
          await processIncomingLead('facebook', { leadgen_id: leadgenId, ...change.value })
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Facebook webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
