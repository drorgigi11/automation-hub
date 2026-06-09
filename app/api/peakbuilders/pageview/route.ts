import { NextRequest, NextResponse } from 'next/server'

/**
 * Server-side Meta Conversions API "PageView" for the Peak Builders landing pages.
 *
 * Fired alongside the browser pixel (see _components/PixelPageView.tsx) with the SAME
 * `event_id`, so Meta deduplicates the two into a single view. The point: visitors whose
 * browser blocks fbevents.js (Safari/iOS ATT, ad-blockers) still get counted from the server,
 * closing the gap between ad clicks and landing-page views.
 *
 * Pattern mirrors app/api/capi-event/route.ts. Lives under the public /api/peakbuilders prefix
 * (see middleware.ts), so no auth gate.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { eventId, fbp, fbclid, url } = body as {
      eventId?: string
      fbp?: string
      fbc?: string
      fbclid?: string
      url?: string
    }
    let { fbc } = body as { fbc?: string }

    const pixelId = process.env.FACEBOOK_PIXEL_ID
    const token = process.env.FACEBOOK_SYSTEM_USER_TOKEN
    if (!pixelId || !token) {
      console.error('pageview CAPI: missing FACEBOOK_PIXEL_ID / FACEBOOK_SYSTEM_USER_TOKEN')
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    const eventTimeMs = Date.now()

    // Client IP from the proxy headers (first hop in x-forwarded-for).
    const xff = req.headers.get('x-forwarded-for') ?? ''
    const clientIp = xff.split(',')[0]?.trim() || req.headers.get('x-real-ip') || undefined
    const userAgent = req.headers.get('user-agent') || undefined

    // If the browser didn't have an _fbc cookie yet but we have an fbclid, synthesize it.
    if (!fbc && fbclid) {
      fbc = `fb.1.${eventTimeMs}.${fbclid}`
    }

    const user_data: Record<string, unknown> = {}
    if (clientIp) user_data.client_ip_address = clientIp
    if (userAgent) user_data.client_user_agent = userAgent
    if (fbp) user_data.fbp = fbp
    if (fbc) user_data.fbc = fbc

    // Optional Meta Test Events code via ?test_event_code=XXXX
    const testEventCode = req.nextUrl.searchParams.get('test_event_code') || undefined

    const payload: Record<string, unknown> = {
      ...(testEventCode ? { test_event_code: testEventCode } : {}),
      data: [
        {
          event_name: 'PageView',
          event_time: Math.floor(eventTimeMs / 1000),
          event_id: eventId || undefined,
          action_source: 'website',
          ...(url ? { event_source_url: url } : {}),
          user_data,
        },
      ],
    }

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    if (!res.ok) {
      const result = await res.json().catch(() => null)
      console.error('pageview CAPI error:', result)
      // Never block the page on a tracking failure.
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('pageview CAPI route error:', message)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
