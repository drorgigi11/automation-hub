import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { processIncomingLead } from '@/lib/process-lead'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Verify webhook
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const secret = (process.env.WEBHOOK_SECRET ?? '').trim()
  if (mode === 'subscribe' && token === secret) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

async function fetchLeadData(leadgenId: string) {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${leadgenId}?fields=id,created_time,ad_id,adset_id,campaign_id,form_id,field_data&access_token=${token}`
  )
  if (!res.ok) throw new Error(`Graph API error: ${res.status}`)
  const data = await res.json()

  // field_data is an array like [{ name: "email", values: ["test@test.com"] }, ...]
  const fields: Record<string, string> = {}
  for (const field of data.field_data ?? []) {
    fields[field.name] = field.values?.[0] ?? ''
  }

  // Fetch ad/adset/campaign names if ad_id is available
  let campaign_name: string | null = null
  let adset_name: string | null = null
  let ad_name: string | null = null

  if (data.ad_id) {
    try {
      const adRes = await fetch(
        `https://graph.facebook.com/v19.0/${data.ad_id}?fields=name,adset{name},campaign{name}&access_token=${token}`
      )
      if (adRes.ok) {
        const adData = await adRes.json()
        ad_name = adData.name ?? null
        adset_name = adData.adset?.name ?? null
        campaign_name = adData.campaign?.name ?? null
      }
    } catch {
      // non-critical, continue without ad names
    }
  } else if (data.campaign_id) {
    // Fallback: fetch campaign/adset names directly from IDs
    try {
      const [campaignRes, adsetRes] = await Promise.all([
        fetch(`https://graph.facebook.com/v19.0/${data.campaign_id}?fields=name&access_token=${token}`),
        data.adset_id ? fetch(`https://graph.facebook.com/v19.0/${data.adset_id}?fields=name&access_token=${token}`) : Promise.resolve(null),
      ])
      if (campaignRes.ok) campaign_name = (await campaignRes.json()).name ?? null
      if (adsetRes?.ok) adset_name = (await adsetRes.json()).name ?? null
    } catch {
      // non-critical
    }
  }

  // Find the first non-standard field as "form answer 1"
  const standardFields = new Set(['full_name', 'full name', 'name', 'first_name', 'last_name', 'email', 'phone_number', 'phone', 'message', 'zip', 'zip_code', 'postal_code', 'inbox_url'])
  const formAnswer1 = Object.entries(fields).find(([k]) => !standardFields.has(k))?.[1] ?? null

  return {
    leadgen_id: leadgenId,
    form_id: data.form_id,
    ad_id: data.ad_id,
    campaign_name,
    adset_name,
    ad_name,
    name: (fields['full_name'] ?? fields['full name'] ?? fields['name'] ?? [fields['first_name'], fields['last_name']].filter(Boolean).join(' ')) || undefined,
    email: fields['email'] ?? null,
    phone: fields['phone_number'] ?? fields['phone'] ?? null,
    message: fields['message'] ?? null,
    zip_code: fields['zip'] ?? fields['zip_code'] ?? fields['postal_code'] ?? null,
    interested: formAnswer1,
    ...fields,
  }
}

async function processWebhookBody(body: unknown) {
  const entries = (body as { entry?: unknown[] })?.entry ?? []

  for (const entry of entries as { changes?: unknown[] }[]) {
    for (const change of (entry?.changes ?? []) as { field: string; value: { leadgen_id?: string } }[]) {
      if (change.field !== 'leadgen') continue

      const leadgenId = change.value?.leadgen_id
      if (!leadgenId) continue

      // Dedup - skip if already processed
      const { data: existing } = await supabaseAdmin
        .from('leads')
        .select('id')
        .filter('raw_data->leadgen_id', 'eq', `"${leadgenId}"`)
        .limit(1)
      if (existing && existing.length > 0) continue

      try {
        const leadData = await fetchLeadData(leadgenId)
        await processIncomingLead('facebook', leadData)
      } catch (err) {
        console.error(`Failed to fetch lead ${leadgenId}:`, err)
        try {
          await processIncomingLead('facebook', { leadgen_id: leadgenId, ...change.value })
        } catch (err2) {
          console.error(`Fallback also failed for lead ${leadgenId}:`, err2)
        }
      }
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Return 200 immediately so Facebook doesn't retry
    waitUntil(processWebhookBody(body))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Facebook webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
