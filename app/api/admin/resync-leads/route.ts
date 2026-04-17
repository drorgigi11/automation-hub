import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { appendLeadToSheet, ensureSheetHeaders } from '@/lib/google-sheets'
import { Lead } from '@/lib/supabase'

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

  for (const lead of leads as Lead[]) {
    const matching = connections.filter(c =>
      Array.isArray(c.sources) && c.sources.includes(lead.source)
    )

    if (matching.length === 0) {
      errors.push(`Lead ${lead.id} (${lead.source}): no matching sheet connection`)
      failed++
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
    failed,
    errors: errors.length > 0 ? errors : undefined,
  })
}
