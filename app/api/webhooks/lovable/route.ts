import { NextRequest, NextResponse } from 'next/server'
import { processIncomingLead } from '@/lib/process-lead'

const isNumericId = (val: unknown) => typeof val === 'string' && /^\d{10,}$/.test(val.trim())

async function resolveAdNames(body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  if (!token) return body

  const adId = body.ad_name
  const adsetId = body.adset_name
  const campaignId = body.campaign_name

  if (!isNumericId(adId) && !isNumericId(adsetId) && !isNumericId(campaignId)) return body

  const resolved: Record<string, unknown> = { ...body }

  try {
    const fetches: Promise<void>[] = []

    if (isNumericId(adId)) {
      fetches.push(
        fetch(`https://graph.facebook.com/v19.0/${adId}?fields=name&access_token=${token}`)
          .then(r => r.json())
          .then(d => { if (d.name) resolved.ad_name = d.name })
          .catch(() => {})
      )
    }
    if (isNumericId(adsetId)) {
      fetches.push(
        fetch(`https://graph.facebook.com/v19.0/${adsetId}?fields=name&access_token=${token}`)
          .then(r => r.json())
          .then(d => { if (d.name) resolved.adset_name = d.name })
          .catch(() => {})
      )
    }
    if (isNumericId(campaignId)) {
      fetches.push(
        fetch(`https://graph.facebook.com/v19.0/${campaignId}?fields=name&access_token=${token}`)
          .then(r => r.json())
          .then(d => { if (d.name) resolved.campaign_name = d.name })
          .catch(() => {})
      )
    }

    await Promise.all(fetches)
  } catch {
    // non-critical
  }

  return resolved
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const resolved = await resolveAdNames(body)
    await processIncomingLead('lovable', resolved)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Lovable webhook error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
