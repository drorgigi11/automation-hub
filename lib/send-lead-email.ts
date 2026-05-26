import { Resend } from 'resend'
import { Lead } from './supabase'

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
  const zipCode = raw.zip_code ?? raw.zipCode ?? ''

  const rows = [
    lead.name    && `<tr><td><b>Name</b></td><td>${lead.name}</td></tr>`,
    lead.email   && `<tr><td><b>Email</b></td><td>${lead.email}</td></tr>`,
    lead.phone   && `<tr><td><b>Phone</b></td><td>${lead.phone}</td></tr>`,
    zipCode      && `<tr><td><b>Zip Code</b></td><td>${zipCode}</td></tr>`,
    formAnswer   && `<tr><td><b>Interested In</b></td><td>${formAnswer}</td></tr>`,
    lead.message && `<tr><td><b>Message</b></td><td>${lead.message}</td></tr>`,
    raw.ownership && `<tr><td><b>Ownership</b></td><td>${raw.ownership}</td></tr>`,
  ].filter(Boolean).join('\n')

  const utmRows = [
    raw.campaign_name && `<tr><td><b>Campaign</b></td><td>${raw.campaign_name}</td></tr>`,
    raw.adset_name    && `<tr><td><b>Ad Set</b></td><td>${raw.adset_name}</td></tr>`,
    raw.ad_name       && `<tr><td><b>Ad</b></td><td>${raw.ad_name}</td></tr>`,
  ].filter(Boolean).join('\n')

  const extraFields = ''

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

  await resend.emails.send({
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
        ${utmRows.length > 0 ? `
        <h3 style="color:#2563eb;margin-top:20px">Campaign Info</h3>
        <table style="border-collapse:collapse;width:100%">
          <tbody>${utmRows}</tbody>
        </table>` : ''}
        <p style="color:#888;font-size:12px;margin-top:24px">
          ${new Date(lead.created_at).toLocaleString('he-IL')}
        </p>
      </div>
    `,
  })
}
