import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { appendLeadToSheet, ensureSheetHeaders } from '@/lib/google-sheets'
import { Lead } from '@/lib/supabase'

// Sheet connections are shared across clients via the `sources` array, so a
// Peak Builders lead (source='lovable') would otherwise sync into Renovision's
// sheet. Until the table has a real client column, derive the connection's
// client from its name.
function clientForConnection(connName: string | null | undefined): string {
  const n = (connName ?? '').toLowerCase()
  if (n.includes('peak')) return 'peakbuilders'
  if (n.includes('patnet')) return 'patnetpro'
  return 'renovision'
}

function clientForLead(lead: Lead): string {
  const raw = (lead.raw_data ?? {}) as Record<string, unknown>
  return String(raw.client ?? 'renovision').toLowerCase()
}

export async function GET(req: NextRequest) {
  // Protect with CRON_SECRET so it's not publicly accessible
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch all leads that failed to sync
  const { data: leads, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('synced_to_sheets', false)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!leads || leads.length === 0) {
    return NextResponse.json({ ok: true, message: 'No unsynced leads', synced: 0, failed: 0 })
  }

  // Fetch all sheet connections once
  const { data: connections } = await supabaseAdmin
    .from('sheet_connections')
    .select('*')

  if (!connections || connections.length === 0) {
    return NextResponse.json({ error: 'No sheet connections configured' }, { status: 500 })
  }

  let synced = 0
  let failed = 0
  const errors: string[] = []

  let skipped = 0
  for (const lead of leads as Lead[]) {
    const leadClient = clientForLead(lead)
    const matching = connections.filter(c =>
      Array.isArray(c.sources) &&
      c.sources.includes(lead.source) &&
      clientForConnection(c.name) === leadClient
    )

    if (matching.length === 0) {
      // No sheet configured for this client (e.g., Peak Builders has no sheet
      // yet). Mark synced so the cron stops retrying — it's not a failure.
      await supabaseAdmin
        .from('leads')
        .update({ synced_to_sheets: true })
        .eq('id', lead.id)
      skipped++
      continue
    }

    let success = true
    for (const conn of matching) {
      try {
        await ensureSheetHeaders(conn.sheet_id, conn.sheet_tab)
        await appendLeadToSheet(conn.sheet_id, conn.sheet_tab, lead)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        errors.push(`Lead ${lead.id} → ${conn.name}: ${msg}`)
        success = false
      }
    }

    if (success) {
      await supabaseAdmin
        .from('leads')
        .update({ synced_to_sheets: true })
        .eq('id', lead.id)
      synced++
    } else {
      failed++
    }
  }

  return NextResponse.json({
    ok: true,
    total: leads.length,
    synced,
    skipped,
    failed,
    errors: errors.length > 0 ? errors : undefined,
  })
}
