import { Resend } from 'resend'
import { Lead } from './supabase'

const RENOVISION_AUDIENCE_ID = 'fee4746a-d45c-4ba8-b8a1-de910677e1dd'

async function getAudienceEmails(): Promise<string[]> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data } = await resend.contacts.list({ audienceId: RENOVISION_AUDIENCE_ID })
  return (data?.data ?? [])
    .filter(c => !c.unsubscribed && c.email)
    .map(c => c.email)
}

export async function sendLeadEmail(lead: Lead) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const toEmails = await getAudienceEmails()
  if (toEmails.length === 0) return

  const sourceLabel: Record<string, string> = {
    lovable: 'Landing Page (Lovable)',
    facebook: 'Facebook',
    elementor: 'Elementor',
  }

  const rows = [
    lead.name    && `<tr><td><b>Name</b></td><td>${lead.name}</td></tr>`,
    lead.email   && `<tr><td><b>Email</b></td><td>${lead.email}</td></tr>`,
    lead.phone   && `<tr><td><b>Phone</b></td><td>${lead.phone}</td></tr>`,
    lead.message && `<tr><td><b>Message</b></td><td>${lead.message}</td></tr>`,
  ].filter(Boolean).join('\n')

  const extraFields = lead.raw_data
    ? Object.entries(lead.raw_data as Record<string, unknown>)
        .filter(([k]) => !['name', 'email', 'phone', 'message'].includes(k))
        .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${String(v)}</td></tr>`)
        .join('\n')
    : ''

  // Resend free tier only allows sending to the registered email.
  // Filter to only allowed recipients.
  const allowedEmail = process.env.RESEND_ALLOWED_EMAIL ?? 'drorgigi11@gmail.com'
  const filteredEmails = toEmails.filter(e => e === allowedEmail)
  if (filteredEmails.length === 0) return

  await resend.emails.send({
    from: 'Automation Hub <onboarding@resend.dev>',
    to: filteredEmails,
    subject: `New Lead from ${sourceLabel[lead.source] ?? lead.source}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px">
        <h2 style="color:#2563eb">New Lead!</h2>
        <p>Source: <b>${sourceLabel[lead.source] ?? lead.source}</b></p>
        <table style="border-collapse:collapse;width:100%">
          <tbody>
            ${rows}
            ${extraFields}
          </tbody>
        </table>
        <p style="color:#888;font-size:12px;margin-top:24px">
          ${new Date(lead.created_at).toLocaleString('he-IL')}
        </p>
      </div>
    `,
  })
}
