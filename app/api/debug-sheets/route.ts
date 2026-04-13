import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:4242/callback'
    )
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client })
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: '17nqqtWxIFIgQw2kWxBpbPFXcSjUU7c5ZN6QiImJsEQk',
      range: `Main CRM!A:Y`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [['Debug', '', 'lovable', '4/6/2026', '054-0000000', 'debug@test.com']] },
    })
    return NextResponse.json({ ok: true, range: res.data.updates?.updatedRange })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
