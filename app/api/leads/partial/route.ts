import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const partialId = typeof body.partial_id === 'string' ? body.partial_id.trim() : ''
    if (!partialId) {
      return NextResponse.json({ error: 'partial_id required' }, { status: 400 })
    }

    const firstName = typeof body.first_name === 'string' ? body.first_name : null
    const lastName = typeof body.last_name === 'string' ? body.last_name : null
    const email = typeof body.email === 'string' && body.email ? body.email : null
    const phone = typeof body.phone === 'string' && body.phone ? body.phone : null
    const name = [firstName, lastName].filter(Boolean).join(' ').trim() || null

    const { data: existing } = await supabaseAdmin
      .from('leads')
      .select('id, raw_data')
      .filter('raw_data->>partial_id', 'eq', partialId)
      .limit(1)
      .maybeSingle()

    const existingRaw = (existing?.raw_data as Record<string, unknown> | undefined) ?? {}
    const mergedRaw = {
      ...existingRaw,
      ...body,
      partial_id: partialId,
      is_partial: true,
    }

    if (existing) {
      const update: Record<string, unknown> = { raw_data: mergedRaw }
      if (name) update.name = name
      if (email) update.email = email
      if (phone) update.phone = phone
      const { error } = await supabaseAdmin.from('leads').update(update).eq('id', existing.id)
      if (error) throw new Error(error.message)
      return NextResponse.json({ ok: true, id: existing.id, updated: true })
    }

    const { data: created, error } = await supabaseAdmin
      .from('leads')
      .insert({
        source: 'lovable',
        name,
        email,
        phone,
        raw_data: mergedRaw,
        synced_to_sheets: false,
      })
      .select('id')
      .single()
    if (error) throw new Error(error.message)
    return NextResponse.json({ ok: true, id: created.id, created: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Partial lead error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
