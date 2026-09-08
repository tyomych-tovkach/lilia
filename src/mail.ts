import { formatEmailBody, MAIL_TO, type InviteState } from './logic'

export type SendResult = { ok: true } | { ok: false; reason: string }

export async function sendInvite(state: InviteState): Promise<SendResult> {
  const sentAt = new Date().toISOString()
  const message = formatEmailBody(state, sentAt)
  const key = import.meta.env.VITE_WEB3FORMS_KEY
  if (!key) return { ok: false, reason: 'no-key' }

  const payload = {
    access_key: key,
    subject: 'Письмо от Лилии',
    from_name: 'Почта театра — письмо для Лилии',
    to: MAIL_TO,
    botcheck: '',
    message: `Почта.\nЛилия сама положила письмо в ящик.\n\n${message}`,
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = (await res.json()) as { success?: boolean }
    if (!res.ok || !data.success) return { ok: false, reason: 'network' }
    return { ok: true }
  } catch {
    return { ok: false, reason: 'network' }
  }
}
