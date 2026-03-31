import { NextRequest, NextResponse } from 'next/server'
import { processIncomingLead } from '@/lib/process-lead'

export async function POST(req: NextRequest) {
  try {
    // Elementor sends form fields as JSON or form-encoded
    const contentType = req.headers.get('content-type') ?? ''
    let body: Record<string, unknown> = {}

    if (contentType.includes('application/json')) {
      body = await req.json()
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text()
      const params = new URLSearchParams(text)
      params.forEach((value, key) => {
        body[key] = value
      })
    } else {
      body = await req.json().catch(() => ({}))
    }

    // Elementor webhooks often wrap fields inside "fields" array
    // e.g. { fields: [{ id: "name", value: "John" }, ...] }
    if (Array.isArray(body.fields)) {
      const flat: Record<string, unknown> = {}
      for (const field of body.fields as Array<{ id: string; value: unknown }>) {
        flat[field.id] = field.value
      }
      body = { ...body, ...flat }
    }

    await processIncomingLead('elementor', body)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Elementor webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
