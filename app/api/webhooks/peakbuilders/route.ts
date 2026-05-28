import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendLeadEmail } from '@/lib/send-lead-email'
import type { Lead } from '@/lib/supabase'

interface IncomingLead {
  // Legacy field names (from internal landing page form)
  name?: string
  zip_code?: string
  help_type?: string
  // New field names (from external quiz/ad webhook)
  first_name?: string
  last_name?: string
  zip?: string
  project_type?: string
  timeline?: string
  // Shared
  email?: string
  phone?: string
  submitted_at?: string
  page_url?: string
  landing_page?: string
  referrer?: string
  source?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  utm_id?: string
  fbclid?: string
  gclid?: string
  ttclid?: string
  msclkid?: string
  // Ad-platform fields (FB/Google), accepted under multiple aliases
  campaign?: string
  campaign_name?: string
  ad_set?: string
  adset?: string
  adset_name?: string
  ad?: string
  ad_name?: string
  partial_id?: string
}

export async function POST(req: NextRequest) {
  let body: IncomingLead = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const composedName = [body.first_name, body.last_name]
    .map((s) => (s ?? '').toString().trim())
    .filter(Boolean)
    .join(' ')
  const name = (body.name ?? '').toString().trim() || composedName || null
  const email = (body.email ?? '').toString().trim().toLowerCase() || null
  const phone = (body.phone ?? '').toString().trim() || null
  const zip = (body.zip ?? body.zip_code ?? '').toString().trim() || null
  const projectType = (body.project_type ?? body.help_type ?? '').toString().trim() || null
  const timeline = (body.timeline ?? '').toString().trim() || null
  const campaignName = (body.campaign_name ?? body.campaign ?? '').toString().trim() || null
  const adsetName = (body.adset_name ?? body.ad_set ?? body.adset ?? '').toString().trim() || null
  const adName = (body.ad_name ?? body.ad ?? '').toString().trim() || null

  if (!phone && !email) {
    return NextResponse.json({ error: 'phone_or_email_required' }, { status: 400 })
  }

  // Save to Supabase as backup (source='lovable' keeps it inside the existing
  // landing-page bucket; client tag distinguishes Peak Builders from Renovision).
  const rawData = {
    ...body,
    // Normalized aliases so downstream (email, sheets) can rely on stable keys
    zip_code: zip,
    project_type: projectType,
    timeline,
    campaign_name: campaignName,
    adset_name: adsetName,
    ad_name: adName,
    client: 'peakbuilders',
    received_at: new Date().toISOString(),
  }

  let insertedLead: Lead | null = null
  try {
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({
        source: 'lovable',
        name,
        email,
        phone,
        message: null,
        raw_data: rawData,
        synced_to_sheets: false,
      })
      .select()
      .single()
    if (error) throw error
    insertedLead = data as Lead
  } catch (err) {
    console.error('peakbuilders supabase save failed:', err)
    // continue — GHL forward + email still attempted
  }

  // Send notification email (recipients routed by client = 'peakbuilders')
  if (insertedLead) {
    try {
      await sendLeadEmail(insertedLead)
    } catch (err) {
      console.error('peakbuilders sendLeadEmail failed:', err)
    }
  }

  // Forward to GoHighLevel inbound webhook.
  const ghlUrl = process.env.GHL_PEAKBUILDERS_WEBHOOK_URL
  if (ghlUrl) {
    try {
      const ghlRes = await fetch(ghlUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: name,
          first_name: body.first_name ?? null,
          last_name: body.last_name ?? null,
          email,
          phone,
          zip,
          project_type: projectType,
          timeline,
          page_url: body.page_url ?? null,
          landing_page: body.landing_page ?? null,
          referrer: body.referrer ?? null,
          utm_source: body.utm_source ?? null,
          utm_medium: body.utm_medium ?? null,
          utm_campaign: body.utm_campaign ?? null,
          utm_content: body.utm_content ?? null,
          utm_term: body.utm_term ?? null,
          utm_id: body.utm_id ?? null,
          campaign: campaignName,
          campaign_name: campaignName,
          ad_set: adsetName,
          adset_name: adsetName,
          ad: adName,
          ad_name: adName,
          fbclid: body.fbclid ?? null,
          gclid: body.gclid ?? null,
          ttclid: body.ttclid ?? null,
          msclkid: body.msclkid ?? null,
          submitted_at: body.submitted_at ?? new Date().toISOString(),
          source: body.source ?? 'peak-builders.net',
        }),
      })
      if (!ghlRes.ok) {
        console.error('GHL webhook returned non-ok:', ghlRes.status, await ghlRes.text().catch(() => ''))
      }
    } catch (err) {
      console.error('GHL webhook fetch failed:', err)
    }
  } else {
    console.warn('GHL_PEAKBUILDERS_WEBHOOK_URL not configured — lead saved to Supabase only')
  }

  return NextResponse.json({ ok: true })
}
