import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { processIncomingLead } from '@/lib/process-lead'

async function fetchAllFormIds(token: string, pageId: string): Promise<string[]> {
  const formIds: string[] = []
  let url = `https://graph.facebook.com/v19.0/${pageId}/leadgen_forms?fields=id,leads_count&limit=50&access_token=${token}`

  while (url) {
    const res = await fetch(url)
    if (!res.ok) break
    const data = await res.json()
    for (const form of data.data ?? []) {
      if ((form.leads_count ?? 0) > 0) formIds.push(form.id)
    }
    url = data.paging?.next ?? null
  }

  return formIds
}

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
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!
  const pageId = process.env.FACEBOOK_PAGE_ID!

  let processed = 0
  let skipped = 0

  const formIds = await fetchAllFormIds(token, pageId)

  for (const formId of formIds) {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${formId}/leads?fields=id,created_time&limit=25&access_token=${token}`
      )
      if (!res.ok) continue
      const data = await res.json()

      for (const lead of data.data ?? []) {
        const { data: existing } = await supabaseAdmin
          .from('leads')
          .select('id')
          .filter('raw_data->leadgen_id', 'eq', `"${lead.id}"`)
          .maybeSingle()

        if (existing) { skipped++; continue }

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

  return NextResponse.json({ ok: true, processed, skipped, forms_scanned: formIds.length })
}
