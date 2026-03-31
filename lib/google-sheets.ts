import { google } from 'googleapis'
import { Lead } from './supabase'

function getAuth() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'urn:ietf:wg:oauth:2.0:oob'
  )
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  })
  return oauth2Client
}

export async function appendLeadToSheet(
  sheetId: string,
  tabName: string,
  lead: Lead
): Promise<void> {
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const row = [
    lead.created_at,
    lead.source,
    lead.name ?? '',
    lead.email ?? '',
    lead.phone ?? '',
    lead.message ?? '',
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tabName}!A:F`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  })
}

export async function ensureSheetHeaders(
  sheetId: string,
  tabName: string
): Promise<void> {
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

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
