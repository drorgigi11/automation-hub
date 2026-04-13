import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createSessionToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const expectedEmail = process.env.APP_EMAIL ?? ''
  const expectedHash = process.env.APP_PASSWORD_HASH ?? ''
  const hash = crypto.createHash('sha256').update(password ?? '').digest('hex')

  if (email !== expectedEmail || hash !== expectedHash) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await createSessionToken()

  const res = NextResponse.json({ ok: true })
  res.cookies.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
  return res
}
