import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendLeadEmail } from '@/lib/send-lead-email'
import type { Lead } from '@/lib/supabase'

interface IncomingLead {
  name?: string
  email?: string
  phone?: string
  zip_code?: string
  help_type?: string
  submitted_at?: string
  page_url?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  fbclid?: string
  partial_id?: string
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

  if (!phone && !email) {
    return NextResponse.json({ error: 'phone_or_email_required' }, { status: 400 })
  }

  // Save to Supabase as backup (source='lovable' keeps it inside the existing
  // landing-page bucket; client tag distinguishes Peak Builders from Renovision).
  const rawData = {
    ...body,
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
          email,
          phone,
          zip_code: body.zip_code ?? null,
          help_type: body.help_type ?? null,
          page_url: body.page_url ?? null,
          utm_source: body.utm_source ?? null,
          utm_medium: body.utm_medium ?? null,
          utm_campaign: body.utm_campaign ?? null,
          utm_content: body.utm_content ?? null,
          utm_term: body.utm_term ?? null,
          fbclid: body.fbclid ?? null,
          submitted_at: body.submitted_at ?? new Date().toISOString(),
          source: 'peak-builders.net',
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
