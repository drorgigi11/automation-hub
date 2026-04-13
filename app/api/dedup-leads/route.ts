import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== (process.env.WEBHOOK_SECRET ?? '').trim()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: leads, error } = await supabaseAdmin
    .from('leads')
    .select('id, email, phone, created_at')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const toDelete = new Set<string>()

  // Dedup by email
  const emailSeen = new Map<string, string>()
  for (const lead of leads ?? []) {
    if (!lead.email) continue
    const key = lead.email.toLowerCase().trim()
    if (emailSeen.has(key)) {
      toDelete.add(lead.id)
    } else {
      emailSeen.set(key, lead.id)
    }
  }

  // Dedup by phone
  const phoneSeen = new Map<string, string>()
  for (const lead of leads ?? []) {
    if (!lead.phone) continue
    const key = lead.phone.replace(/\D/g, '')
    if (key.length < 7) continue
    if (phoneSeen.has(key)) {
      toDelete.add(lead.id)
    } else {
      phoneSeen.set(key, lead.id)
    }
  }

  if (toDelete.size === 0) {
    return NextResponse.json({ deleted: 0, message: 'No duplicates found' })
  }

  const { error: deleteError } = await supabaseAdmin
    .from('leads')
    .delete()
    .in('id', Array.from(toDelete))

  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 })

  return NextResponse.json({ deleted: toDelete.size })
}
