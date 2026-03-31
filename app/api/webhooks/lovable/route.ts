import { NextRequest, NextResponse } from 'next/server'
import { processIncomingLead } from '@/lib/process-lead'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Lovable typically sends { name, email, phone, message, ... }
    await processIncomingLead('lovable', body)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Lovable webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
