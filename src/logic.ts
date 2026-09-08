import {
  ACT_ORDER,
  DATE_CHAT,
  DATE_MAX,
  DATE_MIN,
  MAIL_TO as CONTENT_MAIL,
  OPTIONAL_ACTS,
  REQUIRED_ACTS,
  copy,
  farewells,
  flavors,
  formatOptions,
  japanOptions,
  limits,
  secretOptions,
  signs,
  sportKindOptions,
  sportModeOptions,
} from './content/evening.ts'
import type { ActId, DateFormatId, LocationId, SlotId } from './content/types.ts'

export const SESSION_KEY = 'lilia-evening-v6'
export const DATE_MIN_ISO = DATE_MIN
export const DATE_MAX_ISO = DATE_MAX
export const MAIL_TO = CONTENT_MAIL

export type InviteState = {
  location: LocationId
  letterDone: boolean
  japanIds: string[]
  japanCustom: string
  sportIds: string[]
  sportModeIds: string[]
  sportCustom: string
  secretIds: string[]
  secretCustom: string
  noAttempts: number
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
  sportModeIds: [],
  sportCustom: '',
  secretIds: [],
  secretCustom: '',
  noAttempts: 0,
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
  if (date === DATE_CHAT) return true
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

export function isOptionalAct(id: ActId): boolean {
  return OPTIONAL_ACTS.includes(id)
}

export function actUnlocked(s: InviteState, id: ActId): boolean {
  if (id === 'letter') return true
  if (id === 'japan' || id === 'sport' || id === 'secret') return s.letterDone
  if (id === 'yesno') return s.letterDone
  if (id === 'date') return s.saidYes
  if (id === 'send') return dateDone(s)
  return false
}

export function easterUnlocked(s: InviteState): boolean {
  return s.letterDone
}

export function currentAct(s: InviteState): ActId {
  for (const id of REQUIRED_ACTS) {
    if (!actDone(s, id)) return id
  }
  return 'send'
}

export function canSend(s: InviteState): boolean {
  return s.letterDone && s.saidYes && dateDone(s)
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
  if (iso === DATE_CHAT) return 'напишет в чате, когда свободна'
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  const dow = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  return `${dow[day]}, ${d} ${months[m - 1]} ${y}`
}

export function slotLabel(slot: SlotId | null): string {
  if (slot === 'day') return 'день'
  if (slot === 'evening') return 'вечер'
  return '—'
}

export function formatEmailBody(s: InviteState, sentAt: string): string {
  const sport = [
    labelFor(sportKindOptions, s.sportIds, s.sportCustom),
    s.sportModeIds.length ? `как: ${labelFor(sportModeOptions, s.sportModeIds, '')}` : '',
  ]
    .filter(Boolean)
    .join('; ')
  return [
    'Письмо от Лилии.',
    '',
    `Япония: ${labelFor(japanOptions, s.japanIds, s.japanCustom)}`,
    `Спорт: ${sport || '—'}`,
    `Ещё любит: ${labelFor(secretOptions, s.secretIds, s.secretCustom)}`,
    `Встреча: ${meetingLine(s)}`,
    `Дата: ${formatRuDate(s.date)}`,
    `Время дня: ${slotLabel(s.slot)}`,
    `Отправлено: ${sentAt}`,
    '',
    'Почта театра: Лилия нажала отправить сама.',
  ].join('\n')
}

export function summaryLines(s: InviteState): string[] {
  const japan = labelFor(japanOptions, s.japanIds, s.japanCustom)
  const sport = `${labelFor(sportKindOptions, s.sportIds, s.sportCustom)}${s.sportModeIds.length ? ` · ${labelFor(sportModeOptions, s.sportModeIds, '')}` : ''}`
  const extra = labelFor(secretOptions, s.secretIds, s.secretCustom)
  return [
    'Вот как я это слышу — своими словами, не полями.',
    japan === '—' ? 'Японию оставила в стороне. Так и уйдёт — тоже ответ.' : `Про Японию: ${japan}`,
    sport === '—' ? 'Спорт не отмечала.' : `Спорт: ${sport}`,
    extra === '—' ? 'Про «ещё люблю» — тишина. Нормально.' : `Ещё любит: ${extra}`,
    `Встреча: ${meetingLine(s)}`,
    `Когда: ${formatRuDate(s.date) || '—'} · ${slotLabel(s.slot)}`,
  ]
}

export type ActChipStatus = 'done' | 'now' | 'wait' | 'optional'

export function actChipStatus(s: InviteState, id: ActId): ActChipStatus {
  if (actDone(s, id)) return 'done'
  if (isOptionalAct(id)) return actUnlocked(s, id) ? 'optional' : 'wait'
  if (id === currentAct(s)) return 'now'
  return 'wait'
}

export function locationObjective(s: InviteState): string {
  const loc = s.location
  if (loc === 'hub') {
    if (s.sentAt) return 'Письмо ушло. Можно ещё погулять по фойе.'
    return `Сейчас: ${signs[currentAct(s)].arch}`
  }
  if (loc === 'kubgu' || loc === 'vkusno') return signs[loc].uiObjective
  if (actDone(s, loc)) return copy.backPrompt
  return signs[loc].uiObjective
}

export function lockedToast(s: InviteState): string {
  const now = currentAct(s)
  return `${copy.locked} Сначала ${signs[now].arch}.`
}

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export { ACT_ORDER, OPTIONAL_ACTS, REQUIRED_ACTS, flavors, farewells }
