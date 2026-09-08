import { useEffect, useState } from 'react'
import {
  copy,
  DATE_CHIPS,
  farewells,
  flavors,
  formatOptions,
  greetings,
  japanCustom,
  japanOptions,
  letterPaper,
  limits,
  npcs,
  placeCustom,
  secretCustom,
  secretOptions,
  slotOptions,
  sportCustom,
  sportOptions,
} from '../content/evening'
import type { DateFormatId, LocationId } from '../content/types'
import { formatRuDate, japanDone, secretDone, sportDone, summaryLines, toggleLimited } from '../logic'
import { sendInvite } from '../mail'
import { useInvite } from '../state'
import { talkLock } from '../game/playerRef'
import { onTalk } from '../game/talkBus'

function npcName(loc: LocationId) {
  if (loc === 'hub') return npcs.tanya.name
  if (loc === 'letter') return npcs.sonya.name
  if (loc === 'japan') return npcs.aya.name
  if (loc === 'sport') return npcs.rita.name
  if (loc === 'secret') return npcs.nina.name
  if (loc === 'yesno') return npcs.olya.name
  if (loc === 'date') return npcs.katya.name
  if (loc === 'send') return npcs.gena.name
  if (loc === 'kubgu') return npcs.max.name
  return npcs.lena.name
}

export function Talk() {
  const { state, patch } = useInvite()
  const [open, setOpen] = useState(false)
  const [loc, setLoc] = useState<LocationId>('hub')
  const [line, setLine] = useState(0)
  const [phase, setPhase] = useState<'lines' | 'paper' | 'multi' | 'custom' | 'yesno' | 'format' | 'flavor' | 'place' | 'when' | 'slot' | 'send'>('lines')
  const [busy, setBusy] = useState(false)

  const close = () => {
    setOpen(false)
    talkLock.current = false
  }

  useEffect(() => {
    return onTalk((id) => {
      setLoc(id)
      setOpen(true)
      setLine(0)
      setPhase('lines')
      talkLock.current = true
    })
  }, [])

  if (!open) return null

  const lines = greetings[loc]
  const text =
    phase === 'paper'
      ? letterPaper.join('\n')
      : phase === 'lines'
        ? lines[Math.min(line, lines.length - 1)]
        : phase === 'yesno'
          ? greetings.yesno[1]
          : phase === 'multi' && loc === 'japan'
            ? greetings.japan[1]
            : phase === 'multi' && loc === 'sport'
              ? greetings.sport[1]
              : phase === 'multi' && loc === 'secret'
                ? greetings.secret[1]
                : phase === 'format'
                  ? greetings.date[0]
                  : phase === 'flavor'
                    ? 'Один вкус.'
                    : phase === 'place'
                      ? placeCustom.npcAsk
                      : phase === 'when'
                        ? 'День. Только с 12.09 по 03.10.'
                        : phase === 'slot'
                          ? 'День или вечер? Точный час — в чате.'
                          : phase === 'send'
                            ? greetings.send[0]
                            : phase === 'custom'
                              ? loc === 'japan'
                                ? japanCustom.npcAsk
                                : loc === 'sport'
                                  ? sportCustom.npcAsk
                                  : secretCustom.npcAsk
                              : lines[0]

  const advanceLines = () => {
    if (line + 1 < lines.length) {
      setLine(line + 1)
      return
    }
    if (loc === 'letter') {
      setPhase('paper')
      return
    }
    if (loc === 'japan' || loc === 'sport' || loc === 'secret') {
      setPhase('multi')
      return
    }
    if (loc === 'yesno') {
      if (state.saidYes) {
        patch({ toast: farewells.yesno })
        close()
        return
      }
      setPhase('yesno')
      return
    }
    if (loc === 'date') {
      setPhase('format')
      return
    }
    if (loc === 'send') {
      setPhase('send')
      return
    }
    close()
  }

  const finishLetter = () => {
    patch({ letterDone: true, toast: farewells.letter })
    close()
  }

  const pickMulti = (id: string) => {
    if (loc === 'japan') patch({ japanIds: toggleLimited(state.japanIds, id, limits.japan.max) })
    if (loc === 'sport') patch({ sportIds: toggleLimited(state.sportIds, id, limits.sport.max) })
    if (loc === 'secret') patch({ secretIds: toggleLimited(state.secretIds, id, limits.secret.max) })
  }

  const doneMulti = loc === 'japan' ? japanDone(state) : loc === 'sport' ? sportDone(state) : secretDone(state)
  const options = loc === 'japan' ? japanOptions : loc === 'sport' ? sportOptions : secretOptions
  const selected = loc === 'japan' ? state.japanIds : loc === 'sport' ? state.sportIds : state.secretIds
  const customVal =
    loc === 'japan' ? state.japanCustom : loc === 'sport' ? state.sportCustom : loc === 'secret' ? state.secretCustom : state.customPlace

  return (
    <div className="talk">
      <p className="talk-name">{npcName(loc)}</p>
      <p className="talk-body">{text}</p>
      {phase === 'paper' && (
        <button type="button" className="talk-btn" onClick={finishLetter}>
          Пойду дальше.
        </button>
      )}
      {phase === 'lines' && loc !== 'letter' && line >= lines.length - 1 && (loc === 'hub' || loc === 'kubgu' || loc === 'vkusno') && (
        <button type="button" className="talk-btn" onClick={close}>
          Ясно.
        </button>
      )}
      {phase === 'lines' && !(loc === 'hub' || loc === 'kubgu' || loc === 'vkusno') && (
        <button type="button" className="talk-btn" onClick={advanceLines}>
          Дальше
        </button>
      )}
      {phase === 'lines' && loc === 'letter' && (
        <button type="button" className="talk-btn" onClick={advanceLines}>
          {line + 1 < lines.length ? 'Дальше' : 'Письмо'}
        </button>
      )}
      {phase === 'lines' && (loc === 'hub' || loc === 'kubgu' || loc === 'vkusno') && line < lines.length - 1 && (
        <button type="button" className="talk-btn" onClick={() => setLine(line + 1)}>
          Дальше
        </button>
      )}

      {phase === 'multi' && (
        <div className="talk-choices">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`talk-btn ${selected.includes(o.id) ? 'is-on' : ''}`}
              onClick={() => pickMulti(o.id)}
            >
              {o.playerLine}
            </button>
          ))}
          <button type="button" className="talk-btn" onClick={() => setPhase('custom')}>
            {loc === 'secret' ? secretCustom.playerLine : loc === 'sport' ? sportCustom.playerLine : japanCustom.playerLine}
          </button>
          {doneMulti && (
            <button
              type="button"
              className="talk-btn is-on"
              onClick={() => {
                patch({ toast: farewells[loc] })
                close()
              }}
            >
              Хватит.
            </button>
          )}
        </div>
      )}

      {phase === 'custom' && (
        <>
          <input
            className="talk-input"
            autoFocus
            maxLength={80}
            placeholder={loc === 'japan' ? japanCustom.placeholder : loc === 'sport' ? sportCustom.placeholder : loc === 'date' ? placeCustom.placeholder : secretCustom.placeholder}
            value={customVal}
            onChange={(e) => {
              const v = e.target.value
              if (loc === 'japan') patch({ japanCustom: v })
              else if (loc === 'sport') patch({ sportCustom: v })
              else if (loc === 'secret') patch({ secretCustom: v })
              else patch({ customPlace: v, format: 'custom', flavorId: '' })
            }}
          />
          <button
            type="button"
            className="talk-btn"
            onClick={() => {
              if (loc === 'date') setPhase('when')
              else setPhase('multi')
            }}
          >
            Запомнить
          </button>
        </>
      )}

      {phase === 'yesno' && !state.saidYes && (
        <div className="talk-choices">
          <button
            type="button"
            className="talk-btn is-on"
            onClick={() => {
              patch({ saidYes: true, crashed: false, toast: farewells.yesno })
              close()
            }}
          >
            Да.
          </button>
          <button
            type="button"
            className="talk-btn"
            style={state.noAttempts === 1 ? { transform: 'translate(70px, 18px)' } : undefined}
            onClick={() => {
              if (state.noAttempts === 0) {
                patch({ noAttempts: 1, toast: copy.noDodge })
                return
              }
              patch({ noAttempts: state.noAttempts + 1, crashed: true })
            }}
          >
            Нет.
          </button>
        </div>
      )}

      {phase === 'format' && (
        <div className="talk-choices">
          {formatOptions.map((o) => (
            <button
              key={o.id}
              type="button"
              className="talk-btn"
              onClick={() => {
                patch({ format: o.id as DateFormatId, flavorId: '', customPlace: o.id === 'custom' ? state.customPlace : '' })
                if (o.id === 'custom') setPhase('place')
                else setPhase('flavor')
              }}
            >
              {o.playerLine}
            </button>
          ))}
        </div>
      )}

      {phase === 'flavor' && state.format && state.format !== 'custom' && (
        <div className="talk-choices">
          {flavors[state.format].map((o) => (
            <button
              key={o.id}
              type="button"
              className="talk-btn"
              onClick={() => {
                patch({ flavorId: o.id })
                setPhase('when')
              }}
            >
              {o.playerLine}
            </button>
          ))}
        </div>
      )}

      {phase === 'when' && (
        <div className="talk-choices">
          {DATE_CHIPS.map((iso) => (
            <button
              key={iso}
              type="button"
              className={`talk-btn ${state.date === iso ? 'is-on' : ''}`}
              onClick={() => {
                patch({ date: iso })
                setPhase('slot')
              }}
            >
              {formatRuDate(iso)}
            </button>
          ))}
        </div>
      )}

      {phase === 'slot' && (
        <div className="talk-choices">
          {slotOptions.map((o) => (
            <button
              key={o.id}
              type="button"
              className="talk-btn"
              onClick={() => {
                patch({ slot: o.id as 'day' | 'evening', toast: farewells.date })
                close()
              }}
            >
              {o.playerLine}
            </button>
          ))}
        </div>
      )}

      {phase === 'send' && (
        <>
          <div className="talk-summary">
            {summaryLines(state).map((s) => (
              <p key={s}>{s}</p>
            ))}
          </div>
          <button
            type="button"
            className="talk-btn is-on"
            disabled={busy}
            onClick={() => {
              if (busy || state.sentAt) return
              setBusy(true)
              void sendInvite(state).then((res) => {
                setBusy(false)
                if (res.ok) {
                  patch({ sentAt: new Date().toISOString(), toast: farewells.send })
                  close()
                  return
                }
                patch({ toast: copy.sendFail })
              })
            }}
          >
            {busy ? copy.sending : 'Отправить Темычу'}
          </button>
        </>
      )}
    </div>
  )
}
