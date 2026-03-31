import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ensureSheetHeaders } from '@/lib/google-sheets'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('sheet_connections')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const { name, sheet_id, sheet_tab, sources } = await req.json()

    if (!name || !sheet_id || !sheet_tab || !sources?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify sheet access and set headers
    await ensureSheetHeaders(sheet_id, sheet_tab)

    const { data, error } = await supabaseAdmin
      .from('sheet_connections')
      .insert({ name, sheet_id, sheet_tab, sources })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('sheet_connections')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
