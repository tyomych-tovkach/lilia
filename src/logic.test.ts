import {
  INITIAL_STATE,
  actChipStatus,
  actUnlocked,
  canSend,
  currentAct,
  dateDone,
  easterUnlocked,
  formatEmailBody,
  formatRuDate,
  isDateAllowed,
  locationObjective,
  lockedToast,
} from './logic.ts'

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg)
}

const s0 = { ...INITIAL_STATE }
assert(currentAct(s0) === 'letter', 'start at letter')
assert(actUnlocked(s0, 'letter'), 'letter open')
assert(!actUnlocked(s0, 'japan'), 'tea locked before letter')
assert(!actUnlocked(s0, 'yesno'), 'bridge locked before letter')
assert(!easterUnlocked(s0), 'easter locked before letter')
assert(actChipStatus(s0, 'letter') === 'now', 'letter is now')
assert(actChipStatus(s0, 'japan') === 'wait', 'optional waits')

const afterLetter = { ...s0, letterDone: true }
assert(currentAct(afterLetter) === 'yesno', 'bridge after letter')
assert(actUnlocked(afterLetter, 'yesno'), 'bridge unlocks')
assert(actUnlocked(afterLetter, 'japan'), 'tea optional after letter')
assert(actUnlocked(afterLetter, 'sport'), 'court optional')
assert(actUnlocked(afterLetter, 'secret'), 'roof optional')
assert(!actUnlocked(afterLetter, 'date'), 'table still locked')
assert(easterUnlocked(afterLetter), 'easter after letter')
assert(actChipStatus(afterLetter, 'japan') === 'optional', 'tea marked optional')
assert(locationObjective(afterLetter).includes('МОСТИК'), 'hub names bridge')

const skippedOptional = { ...afterLetter, saidYes: true }
assert(currentAct(skippedOptional) === 'date', 'table after yes without tea')
assert(canSend(skippedOptional) === false, 'cannot send without date')

const dated = {
  ...skippedOptional,
  format: 'calm' as const,
  flavorId: 'ужин',
  date: '2026-09-19',
  slot: 'evening' as const,
}
assert(dateDone(dated), 'date complete')
assert(actUnlocked(dated, 'send'), 'post unlocks')
assert(canSend(dated), 'can send without optional acts')
assert(currentAct(dated) === 'send', 'post is current')

assert(isDateAllowed('chat'), 'chat date ok')
assert(isDateAllowed('2026-09-12'), 'window start')
assert(!isDateAllowed('2026-09-11'), 'before window')
assert(formatRuDate('chat').includes('чате'), 'chat label')
assert(formatRuDate('2026-09-12').includes('сентября'), 'human date')
assert(formatRuDate('2026-09-12').includes('сб'), 'weekday')

const mail = formatEmailBody({ ...dated, noAttempts: 2 }, '2026-09-08T12:00:00.000Z')
assert(!mail.includes('Жала'), 'no refusal report')
assert(!mail.includes('Нет'), 'no no-attempts line')
assert(!mail.includes('Слот:'), 'no slot jargon')
assert(mail.includes('Время дня: вечер'), 'daypart label')
assert(mail.includes('Письмо от Лилии'), 'subject voice')
assert(mail.includes('нажала отправить сама'), 'consent stamp')

assert(lockedToast(s0).includes('САД'), 'lock names current act')

const inGardenDone = { ...afterLetter, location: 'letter' as const }
assert(locationObjective(inGardenDone) === 'E — в фойе', 'done location points home')

console.log('invite logic: ok')
