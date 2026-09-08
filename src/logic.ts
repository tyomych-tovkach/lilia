export const SESSION_KEY = 'lilia-town-v4'

export const DATE_MIN = '2026-09-12'
export const DATE_MAX = '2026-10-03'
export const MAIL_TO = 'tyomych.tovkach@tayviscon.com'

export type MachineId = 'japan' | 'sport' | 'secret'
export type DoorId = 'kubgu' | 'vkusno'
export type PortalId = 'calm' | 'play' | 'japan'
export type Slot = 'day' | 'evening'
export type Phase = 'letter' | 'explore' | 'match' | 'crash' | 'date' | 'mail' | 'sent'
export type ComposeField = 'japan' | 'sport' | 'secret' | 'place' | null

export type InviteState = {
  phase: Phase
  letterOpen: boolean
  japanStickers: string[]
  japanCustom: string
  sportMarks: string[]
  sportCustom: string
  secretMarks: string[]
  secretCustom: string
  noAttempts: number
  crashed: boolean
  restored: boolean
  saidYes: boolean
  portal: PortalId | 'custom' | null
  flavor: string
  customPlace: string
  date: string
  slot: Slot | null
  sentAt: string | null
  toast: string
  compose: ComposeField
}

export const INITIAL_STATE: InviteState = {
  phase: 'letter',
  letterOpen: false,
  japanStickers: [],
  japanCustom: '',
  sportMarks: [],
  sportCustom: '',
  secretMarks: [],
  secretCustom: '',
  noAttempts: 0,
  crashed: false,
  restored: false,
  saidYes: false,
  portal: null,
  flavor: '',
  customPlace: '',
  date: '',
  slot: null,
  sentAt: null,
  toast: '',
  compose: null,
}

export const JAPAN_STICKERS = [
  { id: 'еда', shape: 'bowl' },
  { id: 'поездки', shape: 'bag' },
  { id: 'аниме / манга', shape: 'star' },
  { id: 'язык', shape: 'glyph' },
  { id: 'эстетика', shape: 'flower' },
  { id: 'просто вайб', shape: 'orb' },
] as const

export const SPORT_MARKS = [
  { id: 'волейбол', shape: 'volley' },
  { id: 'баскетбол', shape: 'basket' },
  { id: 'теннис', shape: 'racket' },
  { id: 'смотрю', shape: 'lens' },
  { id: 'играю', shape: 'shoe' },
  { id: 'давай научишь', shape: 'whistle' },
] as const

export const SECRET_MARKS = [
  { id: 'танцы', shape: 'disco' },
  { id: 'музыка', shape: 'headphones' },
  { id: 'кино', shape: 'reel' },
  { id: 'прогулки', shape: 'boot' },
  { id: 'сладкое', shape: 'cake' },
] as const

export const PORTAL_FLAVORS: Record<PortalId, { id: string; hue: string }[]> = {
  calm: [
    { id: 'кофе с японским акцентом', hue: '#c4a574' },
    { id: 'ужин', hue: '#ff7a59' },
    { id: 'прогулка', hue: '#7ecbff' },
    { id: 'десерт', hue: '#ffb6d9' },
  ],
  play: [
    { id: 'теннис', hue: '#c8ff6a' },
    { id: 'броски', hue: '#ff8a3d' },
    { id: 'волейбол', hue: '#fff4a8' },
    { id: 'посмотреть игру', hue: '#6ad0ff' },
  ],
  japan: [
    { id: 'рамен или изакая', hue: '#ff6b6b' },
    { id: 'караоке', hue: '#d46bff' },
    { id: 'тематическое кафе', hue: '#ffd27a' },
    { id: 'вечер как мини-фестиваль', hue: '#ff8ad4' },
  ],
}

export const DATE_CHIPS = [
  '2026-09-12',
  '2026-09-13',
  '2026-09-19',
  '2026-09-20',
  '2026-09-26',
  '2026-09-27',
  '2026-10-03',
] as const

export function isDateAllowed(date: string): boolean {
  return date >= DATE_MIN && date <= DATE_MAX
}

export function toggleLimited(list: string[], item: string, max: number): string[] {
  if (list.includes(item)) return list.filter((x) => x !== item)
  if (list.length >= max) return list
  return [...list, item]
}

export function machineComplete(state: InviteState, id: MachineId): boolean {
  if (id === 'japan') return state.japanStickers.length > 0 || state.japanCustom.trim().length > 0
  if (id === 'sport') return state.sportMarks.length > 0 || state.sportCustom.trim().length > 0
  return state.secretMarks.length > 0 || state.secretCustom.trim().length > 0
}

export function arcadeComplete(state: InviteState): boolean {
  return (
    machineComplete(state, 'japan') &&
    machineComplete(state, 'sport') &&
    machineComplete(state, 'secret')
  )
}

export function formatRuDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export type PlayerCard = {
  japan: string[]
  sport: string[]
  secret: string[]
}

export function buildPlayerCard(state: InviteState): PlayerCard {
  const japan = [...state.japanStickers]
  const sport = [...state.sportMarks]
  const secret = [...state.secretMarks]
  if (state.japanCustom.trim()) japan.push(state.japanCustom.trim())
  if (state.sportCustom.trim()) sport.push(state.sportCustom.trim())
  if (state.secretCustom.trim()) secret.push(state.secretCustom.trim())
  return { japan, sport, secret }
}

export function playerCardLines(card: PlayerCard): string[] {
  return [
    `Япония: ${card.japan.join(', ') || '—'}`,
    `Спорт: ${card.sport.join(', ') || '—'}`,
    `Чит-код: ${card.secret.join(', ') || '—'}`,
  ]
}

export function meetingLine(state: InviteState): string {
  if (state.portal === 'custom') return `своё место: ${state.customPlace.trim()}`
  const names: Record<PortalId, string> = {
    calm: 'спокойно',
    play: 'поиграть',
    japan: 'японское приключение',
  }
  if (!state.portal) return '—'
  return `${names[state.portal]} → ${state.flavor || '—'}`
}

export function canSend(state: InviteState): boolean {
  if (!isDateAllowed(state.date) || !state.slot) return false
  if (state.portal === 'custom') return state.customPlace.trim().length > 0
  return state.portal !== null && state.flavor.length > 0
}

export type District = 0 | 1 | 2 | 3 | 4

export function maxDistrict(state: InviteState): District {
  if (state.phase === 'sent' || canSend(state)) return 4
  if (state.saidYes) return 3
  if (arcadeComplete(state)) return 2
  if (state.letterOpen) return 1
  return 0
}

export function districtOpen(state: InviteState, district: District): boolean {
  return maxDistrict(state) >= district
}

export function formatEmailBody(state: InviteState, sentAt: string): string {
  const card = buildPlayerCard(state)
  const noLine =
    state.noAttempts > 0
      ? `да, попыток: ${state.noAttempts}${state.crashed || state.restored ? ' (мир падал и поднимался)' : ''}`
      : 'нет'
  return [
    'Лилия собрала второй тайм.',
    '',
    '— карточка игрока —',
    ...playerCardLines(card),
    '',
    `Япония, стикеры: ${state.japanStickers.join(', ') || '—'}`,
    `Япония, своё: ${state.japanCustom.trim() || '—'}`,
    `Спорт, отметки: ${state.sportMarks.join(', ') || '—'}`,
    `Спорт, своё: ${state.sportCustom.trim() || '—'}`,
    `Секрет, марки: ${state.secretMarks.join(', ') || '—'}`,
    `Секрет, «а ещё я»: ${state.secretCustom.trim() || '—'}`,
    '',
    `Жала «Нет»: ${noLine}`,
    `Встреча: ${meetingLine(state)}`,
    `Дата: ${formatRuDate(state.date)}`,
    `Слот: ${state.slot === 'day' ? 'день' : state.slot === 'evening' ? 'вечер' : '—'}`,
    `Отправлено: ${sentAt}`,
  ].join('\n')
}

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}
