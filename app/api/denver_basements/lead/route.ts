import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendLeadEmail } from '@/lib/send-lead-email'
import type { Lead } from '@/lib/supabase'

// Peak Builders DENVER basement-finishing funnel.
//
// Forwards to the DENVER GoHighLevel inbound webhook via its own env var
// (GHL_PEAKBUILDERS_DENVER_WEBHOOK_URL) — kept strictly separate from the San
// Diego funnel (GHL_PEAKBUILDERS_WEBHOOK_URL in app/api/webhooks/peakbuilders).
// Mirrors that route: basement quiz answers are composed into proj_details
// ({{contact.proj_details}}) so nothing is lost downstream.

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
  // GHL maps a contact's name from first_name/last_name (no full_name field).
  // The Denver quiz collects a single "Full Name", so split it here.
  const nameParts = (name ?? '').split(/\s+/).filter(Boolean)
  const firstName = nameParts[0] ?? null
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null
  const email = (body.email ?? '').toString().trim().toLowerCase() || null
  const phone = (body.phone ?? '').toString().trim() || null
  const zip = (body.zip_code ?? '').toString().trim() || null

  // Basement goals selected in the quiz (already human-readable labels).
  const goals = (
    Array.isArray(body.basement_goals)
      ? body.basement_goals
      : Array.isArray(body.interested_multiple)
        ? body.interested_multiple
        : []
  )
    .map((g) => String(g).trim())
    .filter(Boolean)
  const projectType = (body.project_type ?? '').toString().trim() || (goals.join(', ') || null)
  const homeowner = (body.ownership ?? body.homeowner ?? '').toString().trim() || null

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

  // Compose the basement quiz answers into one human-readable blob for GHL
  // ({{contact.proj_details}}) — same single-field approach as the San Diego route.
  const projDetails =
    [
      homeowner && `Homeowner: ${homeowner}`,
      goals.length > 0 && `Basement goals: ${goals.join(', ')}`,
      zip && `ZIP code: ${zip}`,
    ]
      .filter(Boolean)
      .join('\n') || null

  // Forward to the DENVER GoHighLevel inbound webhook (separate from San Diego).
  const ghlUrl = process.env.GHL_PEAKBUILDERS_DENVER_WEBHOOK_URL
  if (ghlUrl) {
    try {
      const ghlRes = await fetch(ghlUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: name,
          name,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          zip,
          project_type: projectType,
          homeowner,
          basement_goals: goals.join(', ') || null,
          // All basement quiz answers dumped into one GHL field ({{contact.proj_details}}).
          proj_details: projDetails,
          page_url: body.page_url ?? null,
          landing_page: body.landing_page ?? 'denver_basements',
          utm_source: body.utm_source ?? null,
          utm_medium: body.utm_medium ?? null,
          utm_campaign: body.utm_campaign ?? null,
          utm_content: body.utm_content ?? null,
          utm_term: body.utm_term ?? null,
          fbclid: body.fbclid ?? null,
          gclid: body.gclid ?? null,
          submitted_at: body.submitted_at ?? new Date().toISOString(),
          // GHL contact lead.source — agency attribution.
          source: 'dror_gigi',
          // Mark the originating funnel so Denver is never confused with San Diego.
          source_page: 'peak-builders.net/denver_basements',
        }),
      })
      if (!ghlRes.ok) {
        console.error('Denver GHL webhook returned non-ok:', ghlRes.status, await ghlRes.text().catch(() => ''))
      }
    } catch (err) {
      console.error('Denver GHL webhook fetch failed:', err)
    }
  } else {
    console.warn('GHL_PEAKBUILDERS_DENVER_WEBHOOK_URL not configured — Denver lead saved to Supabase only')
  }

  return NextResponse.json({ ok: true })
}
