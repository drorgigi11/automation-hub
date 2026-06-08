import { Resend } from 'resend'
import { Lead } from './supabase'

const esc = (v: unknown): string =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const ROOF_TYPE_LABELS: Record<string, string> = {
  asphalt: 'Asphalt Shingles', tiles: 'Tiles', flat: 'Flat Roof', 'not-sure': 'Not Sure',
}
const PITCH_LABELS: Record<string, string> = {
  flat: 'Flat', low: 'Low', moderate: 'Moderate', steep: 'Steep', 'not-sure': "I'm not sure",
}
const FINANCING_LABELS: Record<string, string> = {
  yes: 'Yes', no: 'No', maybe: 'Maybe',
}
const SOURCE_LABELS: Record<string, string> = {
  solar: 'Satellite measurement', manual: 'Manual size estimate',
}

export async function sendLeadEmail(lead: Lead) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const raw = (lead.raw_data ?? {}) as Record<string, unknown>

  const isFromFacebook = lead.source === 'facebook' ||
    (lead.source === 'lovable' && (
      String(raw.utm_source ?? '').toLowerCase().includes('facebook') ||
      String(raw.utm_source ?? '').toLowerCase() === 'fb' ||
      Boolean(raw.campaign_name)
    ))

  const sourceLabel: Record<string, string> = {
    lovable: 'Landing Page',
    facebook: 'Facebook',
    elementor: 'Elementor',
  }
  const displaySource = isFromFacebook ? 'Facebook' : (sourceLabel[lead.source] ?? lead.source)

  const interestedMultiple = raw.interested_multiple ?? raw.interestedMultiple
  const formAnswer = raw.interested ??
    (Array.isArray(interestedMultiple) ? (interestedMultiple as string[]).join(', ') : interestedMultiple) ?? ''
  const zipCode = raw.zip_code ?? raw.zipCode ?? raw.zip ?? ''
  const projectType = raw.project_type ?? raw.help_type ?? ''
  const timeline = raw.timeline ?? ''

  const rows = [
    lead.name     && `<tr><td><b>Name</b></td><td>${lead.name}</td></tr>`,
    lead.email    && `<tr><td><b>Email</b></td><td>${lead.email}</td></tr>`,
    lead.phone    && `<tr><td><b>Phone</b></td><td>${lead.phone}</td></tr>`,
    zipCode       && `<tr><td><b>Zip Code</b></td><td>${zipCode}</td></tr>`,
    projectType   && `<tr><td><b>Project Type</b></td><td>${projectType}</td></tr>`,
    timeline      && `<tr><td><b>Timeline</b></td><td>${timeline}</td></tr>`,
    formAnswer    && `<tr><td><b>Interested In</b></td><td>${formAnswer}</td></tr>`,
    lead.message  && `<tr><td><b>Message</b></td><td>${lead.message}</td></tr>`,
    raw.ownership && `<tr><td><b>Ownership</b></td><td>${raw.ownership}</td></tr>`,
  ].filter(Boolean).join('\n')

  const utmRows = [
    raw.campaign_name && `<tr><td><b>Campaign</b></td><td>${raw.campaign_name}</td></tr>`,
    raw.adset_name    && `<tr><td><b>Ad Set</b></td><td>${raw.adset_name}</td></tr>`,
    raw.ad_name       && `<tr><td><b>Ad</b></td><td>${raw.ad_name}</td></tr>`,
  ].filter(Boolean).join('\n')

  const extraFields = ''

  // Instant-quote ("Roof Estimate") leads carry a lot more than name/email/phone.
  // Surface everything in the email: a readable curated section + a full raw dump.
  const hasRoofData = Boolean(raw.address || raw.estimate_low || raw.roof_sqft)

  const labelOf = (map: Record<string, string>, v: unknown) =>
    map[String(v ?? '')] ?? esc(v)

  const estimateRange =
    raw.estimate_low != null && raw.estimate_high != null
      ? `$${Number(raw.estimate_low).toLocaleString()} – $${Number(raw.estimate_high).toLocaleString()}`
      : ''

  const roofRows = [
    raw.address       && `<tr><td><b>Address</b></td><td>${esc(raw.address)}</td></tr>`,
    estimateRange     && `<tr><td><b>Estimated Cost</b></td><td>${estimateRange}</td></tr>`,
    raw.roof_sqft     && `<tr><td><b>Roof Area</b></td><td>${Number(raw.roof_sqft).toLocaleString()} sqft</td></tr>`,
    raw.roof_squares  && `<tr><td><b>Roofing Squares</b></td><td>${esc(raw.roof_squares)}</td></tr>`,
    raw.roof_type     && `<tr><td><b>Roof Type</b></td><td>${labelOf(ROOF_TYPE_LABELS, raw.roof_type)}</td></tr>`,
    raw.roof_pitch    && `<tr><td><b>Roof Pitch</b></td><td>${labelOf(PITCH_LABELS, raw.roof_pitch)}</td></tr>`,
    raw.material      && `<tr><td><b>Material</b></td><td>${esc(raw.material)}</td></tr>`,
    raw.financing     && `<tr><td><b>Financing</b></td><td>${labelOf(FINANCING_LABELS, raw.financing)}</td></tr>`,
    raw.roof_source   && `<tr><td><b>Measurement</b></td><td>${labelOf(SOURCE_LABELS, raw.roof_source)}</td></tr>`,
  ].filter(Boolean).join('\n')

  const RECIPIENTS_BY_CLIENT: Record<string, string[]> = {
    renovision:   ['drorgigi11@gmail.com', 'renovisiondesign.build@gmail.com'],
    peakbuilders: ['drorgigi11@gmail.com', 'Raphael@venado.life'],
  }
  const CLIENT_LABEL: Record<string, string> = {
    renovision:   'Renovision',
    peakbuilders: 'Peak Builders',
  }
  const clientKey = String(raw.client ?? 'renovision').toLowerCase()
  const recipients = RECIPIENTS_BY_CLIENT[clientKey] ?? RECIPIENTS_BY_CLIENT.renovision
  const clientLabel = CLIENT_LABEL[clientKey] ?? 'Lead'

  // Full raw-data backup for Peak Builders leads, so no field is ever silently
  // dropped (including any added in the future).
  const allDetailsRows = clientKey === 'peakbuilders'
    ? Object.entries(raw)
        .map(([k, v]) => {
          const display = v != null && typeof v === 'object' ? JSON.stringify(v) : v
          return `<tr><td style="padding:2px 8px 2px 0"><b>${esc(k)}</b></td><td style="padding:2px 0">${esc(display)}</td></tr>`
        })
        .join('\n')
    : ''

  const { data, error } = await resend.emails.send({
    from: 'GG Marketing <info@ggmarketing-s.com>',
    to: recipients,
    subject: `New ${clientLabel} Lead from ${displaySource}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px">
        <h2 style="color:#2563eb">New Lead!</h2>
        <p>Source: <b>${displaySource}</b></p>
        <table style="border-collapse:collapse;width:100%">
          <tbody>
            ${rows}
            ${extraFields}
          </tbody>
        </table>
        ${hasRoofData && roofRows.length > 0 ? `
        <h3 style="color:#2563eb;margin-top:20px">Roof Estimate</h3>
        <table style="border-collapse:collapse;width:100%">
          <tbody>${roofRows}</tbody>
        </table>` : ''}
        ${utmRows.length > 0 ? `
        <h3 style="color:#2563eb;margin-top:20px">Campaign Info</h3>
        <table style="border-collapse:collapse;width:100%">
          <tbody>${utmRows}</tbody>
        </table>` : ''}
        ${allDetailsRows.length > 0 ? `
        <h3 style="color:#888;margin-top:24px;font-size:14px">All details</h3>
        <table style="border-collapse:collapse;width:100%;color:#888;font-size:12px">
          <tbody>${allDetailsRows}</tbody>
        </table>` : ''}
        <p style="color:#888;font-size:12px;margin-top:24px">
          ${new Date(lead.created_at).toLocaleString('he-IL')}
        </p>
      </div>
    `,
  })

  // Resend does NOT throw on send failure — it returns the error in the result.
  // Surface it so the webhook's try/catch logs it instead of failing silently.
  if (error) {
    throw new Error(`Resend send failed: ${error.name} — ${error.message}`)
  }
  return data
}
