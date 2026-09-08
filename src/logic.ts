import { ACT_ORDER, DATE_MAX, DATE_MIN, MAIL_TO as CONTENT_MAIL, farewells, flavors, formatOptions, japanOptions, limits, secretOptions, sportOptions } from './content/evening'
import type { ActId, DateFormatId, LocationId, SlotId } from './content/types'

export const SESSION_KEY = 'lilia-evening-v5'
export const DATE_MIN_ISO = DATE_MIN
export const DATE_MAX_ISO = DATE_MAX
export const MAIL_TO = CONTENT_MAIL

export type InviteState = {
  location: LocationId
  letterDone: boolean
  japanIds: string[]
  japanCustom: string
  sportIds: string[]
  sportCustom: string
  secretIds: string[]
  secretCustom: string
  noAttempts: number
  crashed: boolean
  restored: boolean
  saidYes: boolean
  format: DateFormatId | null
  flavorId: string
  customPlace: string
  date: string
  slot: SlotId | null
  sentAt: string | null
  toast: string
}

export const INITIAL_STATE: InviteState = {
  location: 'hub',
  letterDone: false,
  japanIds: [],
  japanCustom: '',
  sportIds: [],
  sportCustom: '',
  secretIds: [],
  secretCustom: '',
  noAttempts: 0,
  crashed: false,
  restored: false,
  saidYes: false,
  format: null,
  flavorId: '',
  customPlace: '',
  date: '',
  slot: null,
  sentAt: null,
  toast: '',
}

export function isDateAllowed(date: string): boolean {
  return date >= DATE_MIN && date <= DATE_MAX
}

export function toggleLimited(list: string[], item: string, max: number): string[] {
  if (list.includes(item)) return list.filter((x) => x !== item)
  if (list.length >= max) return list
  return [...list, item]
}

export function japanDone(s: InviteState): boolean {
  return s.japanIds.length >= limits.japan.min || s.japanCustom.trim().length > 0
}
export function sportDone(s: InviteState): boolean {
  return s.sportIds.length >= limits.sport.min || s.sportCustom.trim().length > 0
}
export function secretDone(s: InviteState): boolean {
  return s.secretIds.length >= limits.secret.min || s.secretCustom.trim().length > 0
}
export function dateDone(s: InviteState): boolean {
  if (!isDateAllowed(s.date) || !s.slot) return false
  if (s.format === 'custom') return s.customPlace.trim().length > 0
  return s.format !== null && s.flavorId.length > 0
}

export function actDone(s: InviteState, id: ActId): boolean {
  if (id === 'letter') return s.letterDone
  if (id === 'japan') return japanDone(s)
  if (id === 'sport') return sportDone(s)
  if (id === 'secret') return secretDone(s)
  if (id === 'yesno') return s.saidYes
  if (id === 'date') return dateDone(s)
  return s.sentAt !== null
}

export function actUnlocked(s: InviteState, id: ActId): boolean {
  const i = ACT_ORDER.indexOf(id)
  if (i <= 0) return true
  return actDone(s, ACT_ORDER[i - 1])
}

export function currentAct(s: InviteState): ActId {
  for (const id of ACT_ORDER) {
    if (!actDone(s, id)) return id
  }
  return 'send'
}

export function canSend(s: InviteState): boolean {
  return ACT_ORDER.every((id) => (id === 'send' ? true : actDone(s, id))) && dateDone(s) && s.saidYes
}

export function labelFor(list: { id: string; playerLine: string }[], ids: string[], extra: string): string {
  const parts = ids.map((id) => list.find((o) => o.id === id)?.playerLine.replace(/\.$/, '') || id)
  if (extra.trim()) parts.push(extra.trim())
  return parts.join(', ') || '—'
}

export function meetingLine(s: InviteState): string {
  if (s.format === 'custom') return `своё место: ${s.customPlace.trim()}`
  const fmt = formatOptions.find((o) => o.id === s.format)?.playerLine.replace(/\.$/, '') || '—'
  return `${fmt} → ${s.flavorId || '—'}`
}

export function formatRuDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export function formatEmailBody(s: InviteState, sentAt: string): string {
  const noLine =
    s.noAttempts > 0
      ? `да, попыток: ${s.noAttempts}${s.crashed || s.restored ? ' (занавес падал)' : ''}`
      : 'нет'
  return [
    'Лилия собрала вечер по актам.',
    '',
    `Япония: ${labelFor(japanOptions, s.japanIds, s.japanCustom)}`,
    `Спорт: ${labelFor(sportOptions, s.sportIds, s.sportCustom)}`,
    `А ещё: ${labelFor(secretOptions, s.secretIds, s.secretCustom)}`,
    `Жала «Нет»: ${noLine}`,
    `Встреча: ${meetingLine(s)}`,
    `Дата: ${formatRuDate(s.date)}`,
    `Слот: ${s.slot === 'day' ? 'день' : s.slot === 'evening' ? 'вечер' : '—'}`,
    `Отправлено: ${sentAt}`,
  ].join('\n')
}

export function summaryLines(s: InviteState): string[] {
  return [
    `Япония: ${labelFor(japanOptions, s.japanIds, s.japanCustom)}`,
    `Спорт: ${labelFor(sportOptions, s.sportIds, s.sportCustom)}`,
    `А ещё: ${labelFor(secretOptions, s.secretIds, s.secretCustom)}`,
    `Встреча: ${meetingLine(s)}`,
    `Когда: ${formatRuDate(s.date) || '—'} · ${s.slot === 'day' ? 'день' : s.slot === 'evening' ? 'вечер' : '—'}`,
  ]
}

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export { flavors, farewells }
