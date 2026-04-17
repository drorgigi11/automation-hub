import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  // Step 1: Try to get an access token
  let accessToken: string
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
        grant_type: 'refresh_token',
      }),
    })
    const data = await res.json() as { access_token?: string; error?: string; error_description?: string }
    if (!data.access_token) {
      return NextResponse.json(
        { ok: false, step: 'token', error: data.error, description: data.error_description },
        { status: 500 }
      )
    }
    accessToken = data.access_token
  } catch (e) {
    return NextResponse.json({ ok: false, step: 'token', error: String(e) }, { status: 500 })
  }

  // Step 2: Load sheet connections from Supabase
  const { data: connections, error: dbError } = await supabaseAdmin
    .from('sheet_connections')
    .select('*')

  if (dbError || !connections || connections.length === 0) {
    return NextResponse.json({
      ok: false,
      step: 'connections',
      error: dbError?.message ?? 'No sheet connections found in database',
    }, { status: 500 })
  }

  // Step 3: Test access to each connection's sheet
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  const sheets = google.sheets({ version: 'v4', auth })

  const results = []
  for (const conn of connections) {
    try {
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: conn.sheet_id })
      const tabs = spreadsheet.data.sheets?.map(s => s.properties?.title) ?? []
      const tabFound = tabs.includes(conn.sheet_tab)
      results.push({
        name: conn.name,
        sheet_id: conn.sheet_id,
        sheet_tab: conn.sheet_tab,
        sources: conn.sources,
        accessible: true,
        tab_found: tabFound,
        available_tabs: tabs,
      })
    } catch (e) {
      results.push({
        name: conn.name,
        sheet_id: conn.sheet_id,
        sheet_tab: conn.sheet_tab,
        sources: conn.sources,
        accessible: false,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  const allOk = results.every(r => r.accessible && r.tab_found)
  return NextResponse.json({ ok: allOk, token: 'valid', connections: results })
}
