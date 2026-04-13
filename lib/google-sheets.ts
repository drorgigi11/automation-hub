import { google } from 'googleapis'
import { Lead } from './supabase'

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

async function getSheetsClient() {
  const accessToken = await getAccessToken()
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  return google.sheets({ version: 'v4', auth })
}

export async function appendLeadToSheet(
  sheetId: string,
  tabName: string,
  lead: Lead
): Promise<void> {
  const sheets = await getSheetsClient()

  const raw = (lead.raw_data ?? {}) as Record<string, unknown>

  // If lovable lead came via Facebook ad (has utm_source=facebook or campaign data), show Facebook
  const isFromFacebook = lead.source === 'facebook' ||
    (lead.source === 'lovable' && (
      String(raw.utm_source ?? '').toLowerCase().includes('facebook') ||
      String(raw.utm_source ?? '').toLowerCase() === 'fb' ||
      Boolean(raw.campaign_name)
    ))

  const sourceLabel: Record<string, string> = {
    lovable: 'Landing Page',
    facebook: 'Facebook',
    elementor: 'Elementor',
  }
  const displaySource = isFromFacebook ? 'Facebook' : (sourceLabel[lead.source] ?? lead.source)

  // Date format: M/D/YYYY (e.g. 4/5/2026)
  const d = new Date(lead.created_at)
  const dateStr = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`

  // Form answer 1: interested or interested_multiple (handles both camelCase and snake_case)
  const interestedMultiple = raw.interested_multiple ?? raw.interestedMultiple
  const formAnswer1 = raw.interested ??
    (Array.isArray(interestedMultiple)
      ? (interestedMultiple as string[]).join(', ')
      : interestedMultiple) ?? ''

  // Zip code: handles both zip_code and zipCode
  const zipCode = raw.zip_code ?? raw.zipCode ?? ''

  const row = [
    lead.name ?? '',     // A: Name
    '',                  // B: Lead Owner
    displaySource,             // C: Lead Source
    dateStr,             // D: Date Received
    lead.phone ?? '',    // E: Phone Number
    lead.email ?? '',    // F: Email
    '',                  // G: Salutation
    '',                  // H: Status/
    '',                  // I: Substatus
    '',                  // J: Action Required
    '',                  // K: Service
    '',                  // L: Details
    '',                  // M: Follow up Date
    '',                  // N: Meeting Set up Date
    '',                  // O: Balance
    '',                  // P: Lead Form
    '',                  // Q: Last Activity Date
    '',                  // R: Column 18
    String(formAnswer1), // S: Form answer 1
    '',                  // T: Column 20
    '',                  // U: Column 21
    String(raw.campaign_name ?? ''), // V: campaign_name
    String(raw.adset_name ?? ''),    // W: adset_name
    String(raw.ad_name ?? ''),       // X: ad_name
    String(zipCode),                 // Y: Zip Code
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tabName}!A:Y`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  })
}

export async function ensureSheetHeaders(
  sheetId: string,
  tabName: string
): Promise<void> {
  const sheets = await getSheetsClient()

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!A1:F1`,
  })

  if (!res.data.values || res.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${tabName}!A1:F1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['Date', 'Source', 'Name', 'Email', 'Phone', 'Message']],
      },
    })
  }
}
