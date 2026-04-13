import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { processIncomingLead } from '@/lib/process-lead'

const FORM_IDS = [
  '872134585241561',   // patio_oct2025-copy
  '739123742520910',   // patio_oct2025
  '1945215816878207',  // patio_oct2025-copy-copy
  '1836221777103969',  // patio_oct2025_holiday
  '913048947947689',   // local-copy
  '1963030877940395',  // bathroom_gift1
  '4392281067765738',  // kitchen_gift1
  '1630392191249644',  // kitchen_gift
]

async function fetchLeadData(leadgenId: string) {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${leadgenId}?fields=id,created_time,ad_id,adset_id,campaign_id,form_id,field_data&access_token=${token}`
  )
  if (!res.ok) throw new Error(`Graph API error: ${res.status}`)
  const data = await res.json()

  const fields: Record<string, string> = {}
  for (const field of data.field_data ?? []) {
    fields[field.name] = field.values?.[0] ?? ''
  }

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
    } catch { /* non-critical */ }
  } else if (data.campaign_id) {
    try {
      const [campaignRes, adsetRes] = await Promise.all([
        fetch(`https://graph.facebook.com/v19.0/${data.campaign_id}?fields=name&access_token=${token}`),
        data.adset_id ? fetch(`https://graph.facebook.com/v19.0/${data.adset_id}?fields=name&access_token=${token}`) : Promise.resolve(null),
      ])
      if (campaignRes.ok) campaign_name = (await campaignRes.json()).name ?? null
      if (adsetRes?.ok) adset_name = (await adsetRes.json()).name ?? null
    } catch { /* non-critical */ }
  }

  const standardFields = new Set(['full_name', 'full name', 'name', 'first_name', 'last_name', 'email', 'phone_number', 'phone', 'message', 'zip', 'zip_code', 'postal_code', 'inbox_url'])
  const interested = Object.entries(fields).find(([k]) => !standardFields.has(k))?.[1] ?? null

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
    zip_code: fields['zip'] ?? fields['zip_code'] ?? fields['postal_code'] ?? null,
    interested,
    ...fields,
  }
}

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let processed = 0
  let skipped = 0

  for (const formId of FORM_IDS) {
    try {
      const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${formId}/leads?fields=id,created_time&limit=10&access_token=${token}`
      )
      if (!res.ok) continue
      const data = await res.json()

      for (const lead of data.data ?? []) {
        // Check if already in Supabase
        const { data: existing } = await supabaseAdmin
          .from('leads')
          .select('id')
          .filter('raw_data->leadgen_id', 'eq', `"${lead.id}"`)
          .maybeSingle()

        if (existing) { skipped++; continue }

        // New lead - process it
        try {
          const leadData = await fetchLeadData(lead.id)
          await processIncomingLead('facebook', leadData)
          processed++
        } catch (err) {
          console.error(`Failed to process lead ${lead.id}:`, err)
        }
      }
    } catch (err) {
      console.error(`Failed to fetch form ${formId}:`, err)
    }
  }

  return NextResponse.json({ ok: true, processed, skipped })
}
