import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    CLIENT_ID_SET: !!process.env.GOOGLE_CLIENT_ID,
    CLIENT_ID_PREFIX: process.env.GOOGLE_CLIENT_ID?.slice(0, 10),
    SECRET_SET: !!process.env.GOOGLE_CLIENT_SECRET,
    SECRET_PREFIX: process.env.GOOGLE_CLIENT_SECRET?.slice(0, 6),
    REFRESH_SET: !!process.env.GOOGLE_REFRESH_TOKEN,
    REFRESH_PREFIX: process.env.GOOGLE_REFRESH_TOKEN?.slice(0, 10),
  })
}
