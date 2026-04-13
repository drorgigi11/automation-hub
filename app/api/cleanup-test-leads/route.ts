import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { google } from 'googleapis'

const TEST_LEAD_IDS = [
  '7a887bcb', '3fc33a6f', 'da7ac885', 'dbbd254b', '226d757c', '68f5c34c',
  'ba38d372', 'e3821c43', '0f997425', 'c0c2ec8b', 'b010d91f', '8fa418d9',
  '154e3f73', 'e8e456d1', 'f6fb1c0b', 'bdd067e0', 'a4ac6ac2', 'e1429923',
  '8b6750c4', '4d395f49', '236c13e5', '712061ef', '5327124b',
]

const SPREADSHEET_ID = '17nqqtWxIFIgQw2kWxBpbPFXcSjUU7c5ZN6QiImJsEQk'
const SHEET_TAB = 'Main CRM'

async function getAccessToken(): Promise<string> {
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
  const data = await res.json() as { access_token?: string; error?: string }
  if (!data.access_token) throw new Error(`Token error: ${data.error}`)
  return data.access_token
}

export async function GET(req: NextRequest) {
  // Simple auth check
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, unknown> = {}

  // Step 1: Find full UUIDs in Supabase matching partial IDs
  const { data: allLeads, error: fetchError } = await supabaseAdmin
    .from('leads')
    .select('id, name, source, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  const idsToDelete = (allLeads ?? [])
    .filter(lead => TEST_LEAD_IDS.some(partial => lead.id.startsWith(partial)))
    .map(lead => lead.id)

  results.found = (allLeads ?? [])
    .filter(lead => TEST_LEAD_IDS.some(partial => lead.id.startsWith(partial)))
    .map(lead => ({ id: lead.id, name: lead.name, source: lead.source }))

  // Step 2: Delete from Supabase
  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabaseAdmin
      .from('leads')
      .delete()
      .in('id', idsToDelete)

    results.supabase_deleted = deleteError ? `Error: ${deleteError.message}` : idsToDelete.length
  } else {
    results.supabase_deleted = 0
    results.note = 'No matching leads found — may already be deleted'
  }

  // Step 3: Delete rows from Google Sheets (row 28 first, then row 25)
  try {
    const accessToken = await getAccessToken()
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })
    const sheets = google.sheets({ version: 'v4', auth })

    // Get spreadsheet to find the sheetId for "Main CRM"
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID })
    const sheetMeta = spreadsheet.data.sheets?.find(s => s.properties?.title === SHEET_TAB)
    const sheetId = sheetMeta?.properties?.sheetId ?? 0

    // Delete row 28 first (index 27), then row 25 (index 24) — higher index first avoids shift
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: 27, // row 28 (0-indexed)
                endIndex: 28,
              },
            },
          },
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: 24, // row 25 (0-indexed)
                endIndex: 25,
              },
            },
          },
        ],
      },
    })

    results.sheets_deleted = 'Rows 25 and 28 deleted successfully'
  } catch (err) {
    results.sheets_error = err instanceof Error ? err.message : String(err)
  }

  return NextResponse.json(results)
}
