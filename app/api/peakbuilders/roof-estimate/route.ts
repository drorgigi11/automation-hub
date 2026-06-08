import { NextRequest, NextResponse } from 'next/server'
import { SQFT_PER_M2 } from '@/lib/roof-pricing'

/**
 * Roof measurement endpoint for the Peak Builders instant-quote flow.
 *
 * Input:  { lat: number, lng: number }
 * Output: { source: 'solar', areaMeters2, areaSqft } on success,
 *         { source: 'not_found' } when Google has no building there (caller
 *         then falls back to the manual size-band picker).
 *
 * Keeps SOLAR_API_KEY server-side only — it is never exposed to the browser.
 */

const SOLAR_ENDPOINT = 'https://solar.googleapis.com/v1/buildingInsights:findClosest'

export async function POST(req: NextRequest) {
  const apiKey = process.env.SOLAR_API_KEY
  if (!apiKey) {
    console.error('roof-estimate: SOLAR_API_KEY not configured')
    return NextResponse.json({ error: 'not_configured' }, { status: 500 })
  }

  let body: { lat?: number; lng?: number } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const lat = Number(body.lat)
  const lng = Number(body.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: 'lat_lng_required' }, { status: 400 })
  }

  const url =
    `${SOLAR_ENDPOINT}?location.latitude=${lat}&location.longitude=${lng}` +
    `&requiredQuality=BASE&key=${apiKey}`

  let res: Response
  try {
    res = await fetch(url, { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('roof-estimate: solar fetch failed', err)
    return NextResponse.json({ source: 'not_found' })
  }

  // 404 == no building within ~50m. Treat as a clean "not found" so the client
  // shows the manual fallback rather than an error.
  if (res.status === 404) {
    return NextResponse.json({ source: 'not_found' })
  }

  if (!res.ok) {
    console.error('roof-estimate: solar non-ok', res.status, await res.text().catch(() => ''))
    return NextResponse.json({ source: 'not_found' })
  }

  const data = await res.json().catch(() => null)
  const areaMeters2: number | undefined =
    data?.solarPotential?.wholeRoofStats?.areaMeters2 ??
    data?.solarPotential?.maxArrayAreaMeters2

  if (!areaMeters2 || !Number.isFinite(areaMeters2) || areaMeters2 <= 0) {
    return NextResponse.json({ source: 'not_found' })
  }

  return NextResponse.json({
    source: 'solar',
    areaMeters2,
    areaSqft: Math.round(areaMeters2 * SQFT_PER_M2),
  })
}
