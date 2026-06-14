import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendLeadEmail } from '@/lib/send-lead-email'
import type { Lead } from '@/lib/supabase'

// Peak Builders DENVER basement-finishing funnel.
//
// This endpoint deliberately does NOT forward to any outbound CRM webhook —
// per Dror, the Denver webhook will be supplied separately. When it's ready,
// add the forward below (mirror app/api/webhooks/peakbuilders/route.ts) using a
// new env var, e.g. GHL_PEAKBUILDERS_DENVER_WEBHOOK_URL.

interface IncomingLead {
  name?: string
  email?: string
  phone?: string
  zip_code?: string
  homeowner?: string
  ownership?: string
  basement_goals?: string[]
  interested_multiple?: string[]
  project_type?: string
  landing_page?: string
  page_url?: string
  submitted_at?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  fbclid?: string
  gclid?: string
  [key: string]: unknown
}

export async function POST(req: NextRequest) {
  let body: IncomingLead = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const name = (body.name ?? '').toString().trim() || null
  const email = (body.email ?? '').toString().trim().toLowerCase() || null
  const phone = (body.phone ?? '').toString().trim() || null
  const zip = (body.zip_code ?? '').toString().trim() || null

  if (!phone && !email) {
    return NextResponse.json({ error: 'phone_or_email_required' }, { status: 400 })
  }

  // Save to Supabase as backup (source='lovable' keeps it inside the existing
  // landing-page bucket; client tag routes the notification email and isolates
  // Denver leads from the San Diego Peak Builders funnel).
  const rawData = {
    ...body,
    zip_code: zip,
    client: 'peakbuilders-denver',
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
    console.error('peakbuilders-denver supabase save failed:', err)
    // continue — the notification email is still attempted below
  }

  // Send notification email. The email's "All details" dump for the
  // peakbuilders-denver client guarantees every submitted field is included.
  if (insertedLead) {
    try {
      await sendLeadEmail(insertedLead)
    } catch (err) {
      console.error('peakbuilders-denver sendLeadEmail failed:', err)
    }
  }

  return NextResponse.json({ ok: true })
}
