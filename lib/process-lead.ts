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
): Promise<Lead> {
  const normalized = normalizeLead(rawData)

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

  if (error) throw new Error(`Failed to save lead: ${error.message}`)

  // 2. Find matching sheet connections for this source
  const { data: connections } = await supabaseAdmin
    .from('sheet_connections')
    .select('*')
    .contains('sources', [source])

  if (connections && connections.length > 0) {
    for (const conn of connections) {
      await ensureSheetHeaders(conn.sheet_id, conn.sheet_tab)
      await appendLeadToSheet(conn.sheet_id, conn.sheet_tab, lead)
    }

    // Mark as synced
    await supabaseAdmin
      .from('leads')
      .update({ synced_to_sheets: true })
      .eq('id', lead.id)

    lead.synced_to_sheets = true
  }

  // Send email notification
  try {
    await sendLeadEmail(lead)
  } catch (err) {
    console.error('Failed to send lead email:', err)
  }

  return lead
}
