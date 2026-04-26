import { supabaseAdmin } from './supabase-admin'
import { Lead, LeadSource } from './supabase'
import { appendLeadToSheet, ensureSheetHeaders } from './google-sheets'
import { sendLeadEmail } from './send-lead-email'

interface RawLead {
  name?: string
  full_name?: string
  first_name?: string
  last_name?: string
  email?: string
  email_address?: string
  phone?: string
  phone_number?: string
  message?: string
  leadgen_id?: string
  [key: string]: unknown
}

function normalizeLead(raw: RawLead) {
  const name =
    raw.name ??
    raw.full_name ??
    [raw.first_name, raw.last_name].filter(Boolean).join(' ') ??
    null

  return {
    name: name || null,
    email: raw.email ?? raw.email_address ?? null,
    phone: raw.phone ?? raw.phone_number ?? null,
    message: raw.message ?? null,
  }
}

export async function processIncomingLead(
  source: LeadSource,
  rawData: RawLead
): Promise<Lead | null> {
  const normalized = normalizeLead(rawData)

  // --- Dedup: Facebook ---
  // .limit(1) instead of .maybeSingle() — maybeSingle returns null when
  // multiple rows match, which silently breaks dedup once a duplicate
  // already exists and lets new copies pile up on every cron run.
  if (source === 'facebook' && rawData.leadgen_id) {
    const { data: existing } = await supabaseAdmin
      .from('leads')
      .select('id')
      .filter('raw_data->leadgen_id', 'eq', `"${rawData.leadgen_id}"`)
      .limit(1)
    if (existing && existing.length > 0) {
      console.log(`Dedup: Facebook lead ${rawData.leadgen_id} already exists, skipping`)
      return null
    }
  }

  // 1. Save lead to Supabase
  const { data: lead, error } = await supabaseAdmin
    .from('leads')
    .insert({
      source,
      ...normalized,
      raw_data: rawData,
      synced_to_sheets: false,
    })
    .select()
    .single()

  if (error) {
    // 23505 = unique_violation — another concurrent request inserted the
    // same Facebook leadgen_id between our dedup check and this insert.
    // Treat as a successful skip rather than a failure.
    if (error.code === '23505') {
      console.log(`Dedup (DB): unique violation, lead already exists`)
      return null
    }
    throw new Error(`Failed to save lead: ${error.message}`)
  }

  // 2. Find matching sheet connections for this source
  const { data: connections } = await supabaseAdmin
    .from('sheet_connections')
    .select('*')
    .contains('sources', [source])

  if (connections && connections.length > 0) {
    const MAX_RETRIES = 3
    let syncSuccess = false
    let lastError: unknown = null

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        for (const conn of connections) {
          await ensureSheetHeaders(conn.sheet_id, conn.sheet_tab)
          await appendLeadToSheet(conn.sheet_id, conn.sheet_tab, lead)
        }
        syncSuccess = true
        break
      } catch (err) {
        lastError = err
        console.error(`Sheets sync attempt ${attempt}/${MAX_RETRIES} failed:`, err)
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, attempt * 1000))
        }
      }
    }

    if (syncSuccess) {
      await supabaseAdmin
        .from('leads')
        .update({ synced_to_sheets: true })
        .eq('id', lead.id)
      lead.synced_to_sheets = true
    } else {
      // Send alert email — sync failed after all retries
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        const errMsg = lastError instanceof Error ? lastError.message : String(lastError)
        await resend.emails.send({
          from: 'GG Marketing <info@ggmarketing-s.com>',
          to: ['drorgigi11@gmail.com'],
          subject: '⚠️ Lead sync to Google Sheets failed',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:500px">
              <h2 style="color:#dc2626">Sheets Sync Failed</h2>
              <p>Lead <b>${lead.name ?? 'Unknown'}</b> (${lead.source}) was saved to Supabase but failed to sync to Google Sheets after ${MAX_RETRIES} attempts.</p>
              <p><b>Error:</b> ${errMsg}</p>
              <p><b>Lead ID:</b> ${lead.id}</p>
              <p style="color:#888;font-size:12px">The hourly cron will retry automatically.</p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Failed to send sync alert email:', emailErr)
      }
    }
  }

  // 3. Send email notification
  try {
    await sendLeadEmail(lead)
  } catch (err) {
    console.error('Failed to send lead email:', err)
  }

  return lead
}
